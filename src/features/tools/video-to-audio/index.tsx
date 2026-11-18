"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileVideo,
  Music,
  Upload,
  Download,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Radio,
  Clock,
  HardDrive,
  FileCheck,
} from "lucide-react";

// Types
type AudioFormat = "mp3" | "wav";
type AudioBitrate = "128k" | "192k" | "320k";
type ConversionStatus = "idle" | "loading-core" | "converting" | "completed" | "error";

interface VideoMetadata {
  file: File;
  name: string;
  size: number;
  duration?: number;
  type: string;
}

export default function VideoToAudioConverter() {
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [bitrate, setBitrate] = useState<AudioBitrate>("192k");
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const ffmpegRef = useRef<any>(null);

  // Clean up object URLs on unmount or new conversion
  useEffect(() => {
    return () => {
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
      }
    };
  }, [outputUrl]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    // Validate file type
    const validExtensions = ["mp4", "mkv", "webm", "mov", "avi", "flv", "m4v"];
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const isVideo = file.type.startsWith("video/") || validExtensions.includes(extension);

    if (!isVideo) {
      setErrorMessage("Please select a valid video file (MP4, MKV, WebM, MOV, AVI).");
      return;
    }

    // Reset previous conversion output
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }
    setOutputUrl(null);
    setOutputBlob(null);
    setOutputSize(null);
    setErrorMessage(null);
    setStatus("idle");
    setProgress(0);

    const metadata: VideoMetadata = {
      file,
      name: file.name,
      size: file.size,
      type: file.type || `video/${extension}`,
    };

    // Attempt to get video duration via HTML5 video element
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.onloadedmetadata = () => {
      window.URL.revokeObjectURL(tempVideo.src);
      metadata.duration = tempVideo.duration;
      setVideo({ ...metadata });
    };
    tempVideo.src = URL.createObjectURL(file);

    setVideo(metadata);
  };

  // Convert via Web Audio API Fallback (lossless WAV extraction)
  const convertWithWebAudio = async (file: File): Promise<Blob> => {
    setStatusMessage("Decoding audio frames via Web Audio API...");
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    try {
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setStatusMessage("Encoding 16-bit PCM WAV stream...");
      setProgress(75);

      // Encode AudioBuffer to WAV
      const numOfChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length * numOfChannels * 2 + 44;
      const outBuffer = new ArrayBuffer(length);
      const view = new DataView(outBuffer);
      const channels: Float32Array[] = [];
      let sampleRate = audioBuffer.sampleRate;
      let offset = 0;
      let pos = 0;

      // write WAVE header
      function setUint16(data: number) {
        view.setUint16(pos, data, true);
        pos += 2;
      }
      function setUint32(data: number) {
        view.setUint32(pos, data, true);
        pos += 4;
      }

      setUint32(0x46464952); // "RIFF"
      setUint32(length - 8); // file length - 8
      setUint32(0x45564157); // "WAVE"
      setUint32(0x20746d66); // "fmt " chunk
      setUint32(16); // length = 16
      setUint16(1); // PCM (uncompressed)
      setUint16(numOfChannels);
      setUint32(sampleRate);
      setUint32(sampleRate * 2 * numOfChannels); // avg. bytes/sec
      setUint16(numOfChannels * 2); // block-align
      setUint16(16); // 16-bit precision
      setUint32(0x61746164); // "data" - chunk
      setUint32(length - pos - 4); // chunk length

      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
      }

      while (offset < audioBuffer.length) {
        for (let i = 0; i < numOfChannels; i++) {
          let sample = Math.max(-1, Math.min(1, channels[i][offset]));
          sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
          view.setInt16(pos, sample, true);
          pos += 2;
        }
        offset++;
      }

      audioContext.close();
      return new Blob([outBuffer], { type: "audio/wav" });
    } catch (err: any) {
      audioContext.close();
      throw new Error("Unable to decode audio stream. " + (err?.message || ""));
    }
  };

  // Convert via FFmpeg WASM
  const handleConvert = async () => {
    if (!video) return;

    setStatus("loading-core");
    setProgress(5);
    setStatusMessage("Loading WebAssembly FFmpeg core...");
    setErrorMessage(null);

    const baseName = video.name.substring(0, video.name.lastIndexOf(".")) || video.name;
    const inputExt = video.name.split(".").pop()?.toLowerCase() || "mp4";
    const inputFileName = `input_${Date.now()}.${inputExt}`;
    const outputFileName = `output_${Date.now()}.${format}`;

    try {
      // Dynamically load @ffmpeg/ffmpeg and @ffmpeg/util
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      let ffmpeg = ffmpegRef.current;
      if (!ffmpeg) {
        ffmpeg = new FFmpeg();
        ffmpegRef.current = ffmpeg;

        ffmpeg.on("progress", ({ progress: p }: { progress: number }) => {
          const pct = Math.min(98, Math.max(10, Math.round(p * 100)));
          setProgress(pct);
        });
      }

      if (!ffmpeg.loaded) {
        setStatusMessage("Downloading WASM binaries (first run only, cached locally)...");
        // Using unpkg ESM core builds
        const coreBaseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
        try {
          await ffmpeg.load({
            coreURL: await toBlobURL(`${coreBaseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(`${coreBaseURL}/ffmpeg-core.wasm`, "application/wasm"),
          });
        } catch (loadErr: any) {
          console.warn("FFmpeg WASM load fallback:", loadErr);
          // If WASM fails (e.g. cross-origin isolation or network), fall back to Web Audio API for WAV
          if (format === "wav") {
            const wavBlob = await convertWithWebAudio(video.file);
            finalizeAudio(wavBlob, baseName);
            return;
          } else {
            throw new Error(
              "WASM Transcoder could not initialize. If offline or in restricted sandbox, switch format to WAV for native browser extraction."
            );
          }
        }
      }

      setStatus("converting");
      setStatusMessage(`Writing video into browser virtual filesystem...`);
      setProgress(25);

      const fileData = await fetchFile(video.file);
      await ffmpeg.writeFile(inputFileName, fileData);

      setStatusMessage(`Transcoding stream to ${format.toUpperCase()} (${bitrate})...`);
      setProgress(40);

      // Build FFmpeg command arguments
      const args: string[] = ["-i", inputFileName, "-vn"];

      if (format === "mp3") {
        args.push("-b:a", bitrate, "-ac", "2", "-ar", "44100", outputFileName);
      } else {
        // WAV: Uncompressed 16-bit PCM
        args.push("-ac", "2", "-ar", "44100", outputFileName);
      }

      const exitCode = await ffmpeg.exec(args);

      if (exitCode !== 0) {
        throw new Error(`FFmpeg exited with error code ${exitCode}`);
      }

      setStatusMessage("Reading generated audio buffer...");
      setProgress(95);

      const data = await ffmpeg.readFile(outputFileName);
      const mimeType = format === "mp3" ? "audio/mpeg" : "audio/wav";
      const rawData = data as any;
      const blob = new Blob([rawData], { type: mimeType });

      // Clean up virtual filesystem
      try {
        await ffmpeg.deleteFile(inputFileName);
        await ffmpeg.deleteFile(outputFileName);
      } catch {
        // Ignore deletion errors
      }

      finalizeAudio(blob, baseName);
    } catch (err: any) {
      console.error("FFmpeg conversion error:", err);
      // Try fallback to Web Audio API if WAV or if FFmpeg fails
      if (format === "wav") {
        try {
          const wavBlob = await convertWithWebAudio(video.file);
          finalizeAudio(wavBlob, baseName);
          return;
        } catch (fallbackErr: any) {
          setErrorMessage(fallbackErr?.message || "Conversion failed. Please try a different video.");
          setStatus("error");
        }
      } else {
        setErrorMessage(
          err?.message ||
            "Unable to transcode to MP3 in this browser session. Try selecting WAV format (native browser encoding)."
        );
        setStatus("error");
      }
    }
  };

  const finalizeAudio = (blob: Blob, baseName: string) => {
    const url = URL.createObjectURL(blob);
    setOutputUrl(url);
    setOutputBlob(blob);
    setOutputSize(blob.size);
    setProgress(100);
    setStatus("completed");
    setStatusMessage("Audio extraction complete!");
  };

  // Audio Player Controls
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const resetAll = () => {
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }
    setVideo(null);
    setOutputUrl(null);
    setOutputBlob(null);
    setOutputSize(null);
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
    setIsPlaying(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getOutputFilename = () => {
    if (!video) return `audio.${format}`;
    const baseName = video.name.substring(0, video.name.lastIndexOf(".")) || video.name;
    return `${baseName}.${format}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner / Privacy Guarantee */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Browser-WASM Video-to-Audio Extractor
            </h2>
            <p className="text-xs text-muted-foreground">
              Powered by @ffmpeg/ffmpeg WebAssembly. Zero uploads to servers — 100% private.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client-Side Sandbox</span>
        </div>
      </div>

      {/* Main Drop Zone & File Selection */}
      {!video ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/60 hover:bg-muted/40 bg-card/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="video/mp4,video/mkv,video/webm,video/quicktime,video/x-matroska,video/*"
            className="hidden"
          />

          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              Drop your video here or browse
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supports MP4, MKV, WebM, MOV, AVI, and FLV up to 2 GB
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["MP4", "MKV", "WebM", "MOV"].map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground font-medium"
                >
                  .{badge.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Video Selected Card */
        <div className="p-6 rounded-2xl bg-card border border-border space-y-6 shadow-xs">
          {/* File Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileVideo className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate max-w-sm sm:max-w-md">
                  {video.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    {formatFileSize(video.size)}
                  </span>
                  {video.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(video.duration)}
                    </span>
                  )}
                  <span className="uppercase px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">
                    {video.name.split(".").pop()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={resetAll}
              disabled={status === "converting" || status === "loading-core"}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-border/70 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Change Video
            </button>
          </div>

          {/* Audio Conversion Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Selection */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Radio className="w-3.5 h-3.5 text-primary" />
                Target Audio Format
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("mp3")}
                  disabled={status === "converting" || status === "loading-core"}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all flex flex-col items-center gap-1 ${
                    format === "mp3"
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <span>MP3 Audio</span>
                  <span className="text-[10px] opacity-80 font-normal">Universal & Compact</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("wav")}
                  disabled={status === "converting" || status === "loading-core"}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all flex flex-col items-center gap-1 ${
                    format === "wav"
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <span>WAV Audio</span>
                  <span className="text-[10px] opacity-80 font-normal">Lossless Studio PCM</span>
                </button>
              </div>
            </div>

            {/* Bitrate Selection */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-primary" />
                  Bitrate Quality
                </span>
                {format === "wav" && (
                  <span className="text-[10px] text-primary lowercase">Lossless (1411 kbps)</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { val: "128k", label: "128 kbps", note: "Standard" },
                    { val: "192k", label: "192 kbps", note: "High Quality" },
                    { val: "320k", label: "320 kbps", note: "Audiophile" },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.val}
                    type="button"
                    onClick={() => setBitrate(b.val)}
                    disabled={
                      format === "wav" || status === "converting" || status === "loading-core"
                    }
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all flex flex-col items-center gap-0.5 ${
                      format === "wav"
                        ? "opacity-40 cursor-not-allowed bg-muted/50 border-border"
                        : bitrate === b.val
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-card text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    <span>{b.label}</span>
                    <span className="text-[10px] opacity-80 font-normal">{b.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          {status !== "completed" && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConvert}
                disabled={status === "converting" || status === "loading-core"}
                className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {status === "converting" || status === "loading-core" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Transcoding {format.toUpperCase()} Stream...</span>
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4" />
                    <span>
                      Extract {format.toUpperCase()} (
                      {format === "mp3" ? bitrate : "Lossless"})
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Live Progress Bar */}
          {(status === "loading-core" || status === "converting") && (
            <div className="space-y-2 p-4 rounded-xl bg-secondary/60 border border-border/80 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  {statusMessage || "Processing video..."}
                </span>
                <span className="font-mono font-bold text-primary">{progress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold">Extraction Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Completed Result Card & Preview */}
          {status === "completed" && outputUrl && (
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/5 via-card to-primary/5 border border-emerald-500/30 space-y-5 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Extraction Ready for Playback & Download</span>
                </div>
                {outputSize && video.size > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                    {Math.round(((video.size - outputSize) / video.size) * 100)}% Size Reduction
                  </span>
                )}
              </div>

              {/* Audio Player Preview */}
              <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-3">
                <audio
                  ref={audioRef}
                  src={outputUrl}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onLoadedMetadata={handleAudioLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shrink-0 shadow-md"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(audioDuration || (video.duration || 0))}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={audioDuration || video.duration || 100}
                      step="0.1"
                      value={currentTime}
                      onChange={handleAudioSeek}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="hidden sm:flex items-center gap-2 w-28 shrink-0">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                  <span className="flex items-center gap-1 font-mono">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {getOutputFilename()}
                  </span>
                  <span>{outputSize ? formatFileSize(outputSize) : "Ready"}</span>
                </div>
              </div>

              {/* Download & Secondary Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={outputUrl}
                  download={getOutputFilename()}
                  className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {format.toUpperCase()} ({outputSize ? formatFileSize(outputSize) : ""})</span>
                </a>

                <button
                  type="button"
                  onClick={resetAll}
                  className="py-3 px-4 rounded-xl bg-secondary hover:bg-muted text-secondary-foreground font-semibold text-sm border border-border transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Convert Another Video</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Zero Server Uploads
          </div>
          <p className="text-xs text-muted-foreground">
            Transcoding happens inside WebAssembly memory on your GPU/CPU. Privacy is guaranteed.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            Studio Bitrates
          </div>
          <p className="text-xs text-muted-foreground">
            Extract up to 320 kbps MP3 or lossless 16-bit 44.1kHz WAV for podcasting, DJing, and video editing.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <FileVideo className="w-3.5 h-3.5" />
            Broad Compatibility
          </div>
          <p className="text-xs text-muted-foreground">
            Extracts audio from MP4, WebM, MKV, QuickTime MOV, AVI, and mobile camera clips.
          </p>
        </div>
      </div>
    </div>
  );
}
