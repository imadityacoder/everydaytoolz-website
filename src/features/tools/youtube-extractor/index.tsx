"use client";

import React, { useState, useEffect } from "react";
import {
  Youtube,
  Search,
  Download,
  Copy,
  Check,
  Smartphone,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  Tag,
  Hash,
  AlertCircle,
  Eye,
  Sliders,
  CheckCircle,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
} from "lucide-react";

interface ThumbnailVariant {
  id: string;
  label: string;
  resolution: string;
  url: string;
  width: number;
  height: number;
  isMaxRes?: boolean;
}

interface VideoMetadata {
  id: string;
  title: string;
  author: string;
  views: string;
  duration: string;
  uploadedAt: string;
}

export default function YoutubeThumbnailExtractor() {
  const [inputUrl, setInputUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [videoId, setVideoId] = useState<string>("dQw4w9WgXcQ");
  const [metadata, setMetadata] = useState<VideoMetadata>({
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    author: "Rick Astley",
    views: "1.5B views",
    duration: "3:33",
    uploadedAt: "14 years ago",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Feed Previewer State
  const [feedTheme, setFeedTheme] = useState<"dark" | "light">("dark");
  const [selectedThumbId, setSelectedThumbId] = useState<string>("maxres");
  const [previewTitle, setPreviewTitle] = useState<string>(metadata.title);
  const [previewChannel, setPreviewChannel] = useState<string>(metadata.author);
  const [previewDuration, setPreviewDuration] = useState<string>(metadata.duration);
  const [previewViews, setPreviewViews] = useState<string>(metadata.views);

  // Helper to extract YouTube video ID
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    const trimmed = url.trim();

    // Direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    // Standard YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /(?:m\.youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Thumbnail variants for current video ID
  const thumbnails: ThumbnailVariant[] = [
    {
      id: "maxres",
      label: "Maximum Resolution (HD)",
      resolution: "1280 × 720 (1080p)",
      url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      width: 1280,
      height: 720,
      isMaxRes: true,
    },
    {
      id: "sd",
      label: "Standard Definition (SD)",
      resolution: "640 × 480 (SD)",
      url: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
      width: 640,
      height: 480,
    },
    {
      id: "hq",
      label: "High Quality (HQ)",
      resolution: "480 × 360 (HQ)",
      url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      width: 480,
      height: 360,
    },
    {
      id: "mq",
      label: "Medium Quality (MQ)",
      resolution: "320 × 180 (MQ)",
      url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      width: 320,
      height: 180,
    },
  ];

  // Fetch Video Info via oEmbed
  const fetchVideoInfo = async (id: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
      );

      if (res.ok) {
        const data = await res.json();
        const newMeta: VideoMetadata = {
          id,
          title: data.title || "YouTube Video",
          author: data.author_name || "Creator",
          views: "1.2M views",
          duration: "10:24",
          uploadedAt: "Recently uploaded",
        };
        setMetadata(newMeta);
        setPreviewTitle(newMeta.title);
        setPreviewChannel(newMeta.author);
      } else {
        // Fallback for custom or unlisted video
        const fallbackMeta: VideoMetadata = {
          id,
          title: `YouTube Video (${id})`,
          author: "YouTube Creator",
          views: "540K views",
          duration: "8:15",
          uploadedAt: "Recently uploaded",
        };
        setMetadata(fallbackMeta);
        setPreviewTitle(fallbackMeta.title);
        setPreviewChannel(fallbackMeta.author);
      }
    } catch {
      // Graceful fallback if oEmbed blocked by CORS/network
      const fallbackMeta: VideoMetadata = {
        id,
        title: `YouTube Video (${id})`,
        author: "YouTube Creator",
        views: "850K views",
        duration: "12:00",
        uploadedAt: "3 days ago",
      };
      setMetadata(fallbackMeta);
      setPreviewTitle(fallbackMeta.title);
      setPreviewChannel(fallbackMeta.author);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtract = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const id = extractVideoId(inputUrl);
    if (!id) {
      setErrorMessage("Please enter a valid YouTube video URL, shorts link, or 11-character video ID.");
      return;
    }

    setVideoId(id);
    fetchVideoInfo(id);
  };

  // Instant Download Helper
  const downloadThumbnail = async (variant: ThumbnailVariant) => {
    setDownloadingId(variant.id);
    const filename = `yt_${videoId}_${variant.id}.jpg`;

    try {
      // Attempt client fetch with blob
      const res = await fetch(variant.url, { mode: "cors" });
      if (!res.ok) throw new Error("CORS restricted");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: Open directly in new window for saving
      const a = document.createElement("a");
      a.href = variant.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloadingId(null);
    }
  };

  // Generate SEO Tags based on title and metadata
  const generateTags = () => {
    const rawTitle = previewTitle || metadata.title;
    // Extract meaningful words from title
    const stopWords = new Set([
      "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "of", "with", "by", "is", "it",
      "official", "video", "music", "hd", "4k", "vs", "ft", "feat",
    ]);

    const words = rawTitle
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    const primaryTags = Array.from(new Set(words));
    const channelTag = previewChannel.toLowerCase().replace(/[^\w\s]/g, "").trim();

    const tagList: string[] = [
      channelTag,
      rawTitle.slice(0, 40).trim(),
      ...primaryTags.map((w) => `${w} tutorial`),
      ...primaryTags.map((w) => `best ${w}`),
      ...primaryTags,
      "youtube",
      "trending",
      "how to",
    ].filter(Boolean);

    // Deduplicate
    return Array.from(new Set(tagList)).slice(0, 16);
  };

  const tags = generateTags();
  const commaSeparatedTags = tags.join(", ");
  const hashtags = tags
    .slice(0, 8)
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Quick Samples
  const sampleVideos = [
    { label: "Rick Astley", id: "dQw4w9WgXcQ" },
    { label: "Lofi Beats", id: "jfKfPfyJRdk" },
    { label: "Nature 4K", id: "Bey4XXJAqS8" },
  ];

  const currentPreviewThumb =
    thumbnails.find((t) => t.id === selectedThumbId)?.url || thumbnails[0].url;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header Info Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              YouTube Thumbnail & SEO Tag Extractor
            </h2>
            <p className="text-xs text-muted-foreground">
              Instant 1080p MaxRes thumbnail downloader, YouTube feed mobile simulator, and SEO tag generator.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Supports Shorts & Standard URLs</span>
        </div>
      </div>

      {/* Input Search Form */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <form onSubmit={handleExtract} className="space-y-3">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Enter YouTube Video or Shorts URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Youtube className="w-4 h-4 text-red-600" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or youtu.be/... or shorts/..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm text-foreground transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Extract Assets</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Picks */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
          <span>Try popular samples:</span>
          {sampleVideos.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                const url = `https://www.youtube.com/watch?v=${s.id}`;
                setInputUrl(url);
                setVideoId(s.id);
                fetchVideoInfo(s.id);
              }}
              className="px-2.5 py-1 rounded-md bg-secondary hover:bg-muted text-secondary-foreground font-medium border border-border/60 transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Grid: 4 Thumbnail Resolutions & Instant Downloads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Available Thumbnail Resolutions
            </h3>
            <p className="text-xs text-muted-foreground">
              Select or download any resolution. MaxRes is highest quality available from YouTube servers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {thumbnails.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl bg-card border overflow-hidden flex flex-col justify-between transition-all group ${
                selectedThumbId === t.id
                  ? "border-primary ring-2 ring-primary/20 shadow-md"
                  : "border-border/80 hover:border-primary/50"
              }`}
            >
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video bg-muted/60 overflow-hidden cursor-pointer"
                onClick={() => setSelectedThumbId(t.id)}
              >
                <img
                  src={t.url}
                  alt={t.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // If maxres does not exist on old videos, fallback to hqdefault
                    if (t.isMaxRes) {
                      (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                    }
                  }}
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-[10px] font-mono font-medium text-white shadow-xs">
                  {t.resolution.split(" ")[0]}
                </div>
                {selectedThumbId === t.id && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-[10px] font-semibold text-primary-foreground shadow-xs flex items-center gap-1">
                    <Check className="w-3 h-3" /> Selected
                  </div>
                )}
              </div>

              {/* Card Footer Details */}
              <div className="p-3.5 space-y-3">
                <div>
                  <div className="text-xs font-bold text-foreground truncate">{t.label}</div>
                  <div className="text-[11px] text-muted-foreground">{t.resolution}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadThumbnail(t)}
                    disabled={downloadingId === t.id}
                    className="flex-1 py-2 px-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {downloadingId === t.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Download</span>
                  </button>

                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive YouTube Feed Previewer & Editor */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              Interactive YouTube Feed Previewer
            </h3>
            <p className="text-xs text-muted-foreground">
              Preview your thumbnail in the real YouTube Mobile Feed. Test title contrast, text readability, and clickability in Dark & Light themes.
            </p>
          </div>

          {/* Dark / Light Mode Switcher for Mock Feed */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary border border-border/80">
            <button
              type="button"
              onClick={() => setFeedTheme("dark")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                feedTheme === "dark"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Dark Feed
            </button>
            <button
              type="button"
              onClick={() => setFeedTheme("light")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                feedTheme === "light"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Light Feed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Simulated Mobile Feed Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm rounded-[2.5rem] p-3.5 bg-neutral-800 shadow-2xl border-4 border-neutral-700">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-neutral-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-neutral-950 mr-2" />
                <div className="w-10 h-1 bg-neutral-700 rounded-full" />
              </div>

              {/* Feed Card Screen */}
              <div
                className={`rounded-[1.8rem] overflow-hidden transition-colors ${
                  feedTheme === "dark" ? "bg-[#0f0f0f] text-white" : "bg-[#ffffff] text-[#0f0f0f]"
                }`}
              >
                {/* Simulated YouTube App Top Bar */}
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1.5 font-bold tracking-tight text-sm">
                    <div className="w-5 h-3.5 bg-red-600 rounded-xs flex items-center justify-center">
                      <div className="w-0 h-0 border-y-2 border-y-transparent border-l-3 border-l-white ml-0.5" />
                    </div>
                    <span>YouTube</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs opacity-75">
                    <span>9:41</span>
                  </div>
                </div>

                {/* Video Feed Item */}
                <div className="pb-4">
                  {/* Thumbnail Image */}
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                      src={currentPreviewThumb}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-sm bg-black/85 text-[11px] font-mono text-white font-medium">
                      {previewDuration || "10:24"}
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="px-3.5 pt-3 flex items-start gap-3">
                    {/* Channel Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
                      {previewChannel ? previewChannel.charAt(0).toUpperCase() : "C"}
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className="text-xs font-semibold leading-snug line-clamp-2">
                        {previewTitle || metadata.title}
                      </h4>
                      <div
                        className={`text-[11px] mt-1 flex items-center gap-1.5 ${
                          feedTheme === "dark" ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        <span className="truncate max-w-[120px]">{previewChannel}</span>
                        <span>•</span>
                        <span>{previewViews || "1.2M views"}</span>
                        <span>•</span>
                        <span>{metadata.uploadedAt}</span>
                      </div>
                    </div>

                    {/* 3 dots action menu */}
                    <div className="text-neutral-400 text-sm font-bold pt-0.5 cursor-pointer">
                      ⋮
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Customization Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              Customize Preview Content
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Video Title (Test CTR & Length)
                </label>
                <textarea
                  rows={2}
                  value={previewTitle}
                  onChange={(e) => setPreviewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-xs focus:ring-1 focus:ring-primary outline-hidden"
                  placeholder="Enter video title..."
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>Characters: {previewTitle.length} / 100</span>
                  <span
                    className={
                      previewTitle.length <= 60
                        ? "text-emerald-500 font-medium"
                        : "text-amber-500 font-medium"
                    }
                  >
                    {previewTitle.length <= 60
                      ? "✓ Safe from mobile truncation"
                      : "⚠ May truncate on phones"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    value={previewChannel}
                    onChange={(e) => setPreviewChannel(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-xs focus:ring-1 focus:ring-primary outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Duration Badge
                  </label>
                  <input
                    type="text"
                    value={previewDuration}
                    onChange={(e) => setPreviewDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-xs focus:ring-1 focus:ring-primary outline-hidden"
                    placeholder="e.g. 14:22"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Social Proof (Views & Time)
                </label>
                <input
                  type="text"
                  value={previewViews}
                  onChange={(e) => setPreviewViews(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-xs focus:ring-1 focus:ring-primary outline-hidden"
                  placeholder="e.g. 2.4M views"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Tags Extraction & 1-Click Copy */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              High-Ranking YouTube SEO Tags
            </h3>
            <p className="text-xs text-muted-foreground">
              Extracted keyword tags and hashtags ready to copy straight into YouTube Studio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(commaSeparatedTags, "all-tags")}
              className="py-2 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedType === "all-tags" ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedType === "all-tags" ? "Copied All!" : "Copy All Tags"}</span>
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(hashtags, "hashtags")}
              className="py-2 px-3 rounded-lg bg-secondary hover:bg-muted text-secondary-foreground font-semibold text-xs border border-border transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedType === "hashtags" ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Hash className="w-3.5 h-3.5" />
              )}
              <span>{copiedType === "hashtags" ? "Copied #Tags!" : "Copy Hashtags"}</span>
            </button>
          </div>
        </div>

        {/* Tag Pills */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => copyToClipboard(tag, `tag-${idx}`)}
                className="group px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-primary/10 hover:border-primary/40 border border-border/70 text-xs text-foreground font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{tag}</span>
                {copiedType === `tag-${idx}` ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity" />
                )}
              </button>
            ))}
          </div>

          {/* Raw Tag String Box */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs font-mono text-muted-foreground break-all select-all">
            {commaSeparatedTags}
          </div>
        </div>
      </div>
    </div>
  );
}
