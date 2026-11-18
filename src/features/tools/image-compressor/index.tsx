"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import imageCompression from "browser-image-compression";
import {
  Upload,
  Download,
  Trash2,
  Sliders,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  X,
  FileCheck,
  Check,
  Layers,
  ArrowRight,
  Maximize2,
} from "lucide-react";

type TargetFormat = "original" | "image/webp" | "image/jpeg" | "image/png";
type MaxDimension = "original" | "3840" | "1920" | "1280" | "800";

interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth?: number;
  originalHeight?: number;
  originalUrl: string;
  compressedBlob: Blob | null;
  compressedSize: number | null;
  compressedUrl: string | null;
  status: "idle" | "compressing" | "done" | "error";
  progress: number;
  error?: string;
  savedPercent?: number;
}

export default function BulkImageCompressor() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<TargetFormat>("image/webp");
  const [maxDimension, setMaxDimension] = useState<MaxDimension>("original");
  const [isCompressingAll, setIsCompressingAll] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeCompareItem, setActiveCompareItem] = useState<ImageItem | null>(null);
  const [compareSliderPos, setCompareSliderPos] = useState<number>(50);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up object URLs on unmount or item removal
  useEffect(() => {
    return () => {
      images.forEach((item) => {
        if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
      });
    };
  }, []);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
      "image/bmp",
    ];

    const imageFiles = files.filter(
      (f) =>
        validImageTypes.includes(f.type) ||
        /\.(jpe?g|png|webp|avif|gif|bmp)$/i.test(f.name)
    );

    if (imageFiles.length === 0) return;

    // Limit to max 10 images total
    const remainingSlots = 10 - images.length;
    if (remainingSlots <= 0) {
      alert("Maximum limit of 10 images reached. Remove some images to add more.");
      return;
    }

    const filesToAdd = imageFiles.slice(0, remainingSlots);

    const newItems: ImageItem[] = filesToAdd.map((file) => {
      const url = URL.createObjectURL(file);
      const item: ImageItem = {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        originalSize: file.size,
        originalUrl: url,
        compressedBlob: null,
        compressedSize: null,
        compressedUrl: null,
        status: "idle",
        progress: 0,
      };

      // Read dimensions
      const img = new Image();
      img.onload = () => {
        item.originalWidth = img.naturalWidth;
        item.originalHeight = img.naturalHeight;
      };
      img.src = url;

      return item;
    });

    setImages((prev) => [...prev, ...newItems]);
  };

  const removeItem = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
        if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
    if (activeCompareItem?.id === id) {
      setActiveCompareItem(null);
    }
  };

  const clearAll = () => {
    images.forEach((item) => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    });
    setImages([]);
    setActiveCompareItem(null);
  };

  // Compress a single image using browser-image-compression with Canvas fallback
  const compressSingleImage = async (
    item: ImageItem,
    targetQuality: number,
    targetFormat: TargetFormat,
    dimOption: MaxDimension
  ): Promise<{ blob: Blob; url: string; size: number }> => {
    // Determine mime type
    let outMime = item.file.type || "image/jpeg";
    if (targetFormat !== "original") {
      outMime = targetFormat;
    }

    const maxDim = dimOption === "original" ? undefined : parseInt(dimOption, 10);

    try {
      // Primary compression using browser-image-compression
      const options = {
        maxSizeMB: Math.max(0.1, (item.file.size / (1024 * 1024)) * (targetQuality / 100)),
        maxWidthOrHeight: maxDim,
        useWebWorker: true,
        fileType: outMime,
        initialQuality: targetQuality / 100,
        alwaysKeepResolution: maxDim === undefined,
        onProgress: (p: number) => {
          setImages((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, progress: Math.round(p) } : i))
          );
        },
      };

      const compressedFile = await imageCompression(item.file, options);
      const url = URL.createObjectURL(compressedFile);
      return { blob: compressedFile, url, size: compressedFile.size };
    } catch {
      // Robust Fallback: Canvas encoding
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.naturalWidth;
          let height = img.naturalHeight;

          if (maxDim && (width > maxDim || height > maxDim)) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve({ blob, url, size: blob.size });
              } else {
                reject(new Error("Canvas compression failed"));
              }
            },
            outMime,
            targetQuality / 100
          );
        };
        img.onerror = () => reject(new Error("Image decoding failed"));
        img.src = item.originalUrl;
      });
    }
  };

  // Compress all queued or modified images
  const handleCompressAll = useCallback(async () => {
    if (images.length === 0) return;
    setIsCompressingAll(true);

    for (const item of images) {
      setImages((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "compressing", progress: 10 } : i))
      );

      try {
        const res = await compressSingleImage(item, quality, format, maxDimension);
        const savedPercent = Math.max(
          0,
          Math.round(((item.originalSize - res.size) / item.originalSize) * 100)
        );

        setImages((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  compressedBlob: res.blob,
                  compressedUrl: res.url,
                  compressedSize: res.size,
                  status: "done",
                  progress: 100,
                  savedPercent,
                }
              : i
          )
        );
      } catch (err: any) {
        setImages((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "error", error: err?.message || "Compression failed" }
              : i
          )
        );
      }
    }

    setIsCompressingAll(false);
  }, [images, quality, format, maxDimension]);

  // Download single compressed file
  const downloadSingle = (item: ImageItem) => {
    if (!item.compressedUrl) return;
    const ext = format === "original" ? item.name.split(".").pop() : format.replace("image/", "");
    const baseName = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
    const downloadName = `${baseName}-compressed.${ext}`;

    const link = document.createElement("a");
    link.href = item.compressedUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Batch Download all compressed images
  const handleDownloadAll = async () => {
    const readyItems = images.filter((i) => i.status === "done" && i.compressedUrl);
    if (readyItems.length === 0) return;

    for (let idx = 0; idx < readyItems.length; idx++) {
      const item = readyItems[idx];
      downloadSingle(item);
      // Stagger downloads by 300ms to avoid browser blocking multi-file downloads
      await new Promise((r) => setTimeout(r, 300));
    }
  };

  // Calculate Aggregates
  const totalOriginalBytes = images.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedBytes = images.reduce((acc, curr) => {
    return acc + (curr.compressedSize !== null ? curr.compressedSize : curr.originalSize);
  }, 0);
  const hasCompressedItems = images.some((i) => i.status === "done");
  const overallSavedPercent =
    totalOriginalBytes > 0 && hasCompressedItems
      ? Math.max(
          0,
          Math.round(((totalOriginalBytes - totalCompressedBytes) / totalOriginalBytes) * 100)
        )
      : 0;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Bulk Browser Image Compressor
            </h2>
            <p className="text-xs text-muted-foreground">
              Compress up to 10 images simultaneously in browser memory using WebAssembly & Canvas. Zero uploads.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>WebP / JPEG / PNG Engine</span>
        </div>
      </div>

      {/* Control Panel: Quality Slider, Format, Dimensions */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quality Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                Quality: <span className="text-foreground font-bold">{quality}%</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                {quality >= 90
                  ? "Lossless Quality"
                  : quality >= 75
                  ? "Recommended Sweet Spot"
                  : "Maximum Compression"}
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {[
                { label: "50%", val: 50, desc: "Max" },
                { label: "70%", val: 70, desc: "Fast" },
                { label: "80%", val: 80, desc: "Balanced" },
                { label: "95%", val: 95, desc: "Ultra" },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setQuality(p.val)}
                  className={`py-1 text-[11px] rounded-md border text-center transition-colors cursor-pointer ${
                    quality === p.val
                      ? "bg-primary/10 text-primary border-primary font-bold"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Format */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Target Output Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: "image/webp", label: "WebP", sub: "Up to 90% savings" },
                { val: "image/jpeg", label: "JPEG", sub: "Universal compat." },
                { val: "image/png", label: "PNG", sub: "Crisp graphics" },
                { val: "original", label: "Original", sub: "Preserve format" },
              ].map((fmt) => (
                <button
                  key={fmt.val}
                  type="button"
                  onClick={() => setFormat(fmt.val as TargetFormat)}
                  className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                    format === fmt.val
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{fmt.label}</div>
                  <div className="text-[10px] opacity-80">{fmt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Max Dimensions Resize */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-primary" />
              Max Dimensions (Resize)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: "original", label: "Original Size", sub: "Keep dimensions" },
                { val: "1920", label: "1920px (Full HD)", sub: "Standard displays" },
                { val: "1280", label: "1280px (HD)", sub: "Web & email" },
                { val: "800", label: "800px (Mobile)", sub: "Small thumbnails" },
              ].map((dim) => (
                <button
                  key={dim.val}
                  type="button"
                  onClick={() => setMaxDimension(dim.val as MaxDimension)}
                  className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                    maxDimension === dim.val
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{dim.label}</div>
                  <div className="text-[10px] opacity-80">{dim.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        {images.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCompressAll}
                disabled={isCompressingAll}
                className="py-2.5 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isCompressingAll ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compressing {images.length} Images...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {hasCompressedItems ? "Re-Compress All Images" : "Compress All Images"}
                    </span>
                  </>
                )}
              </button>

              {hasCompressedItems && (
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All ({images.filter((i) => i.status === "done").length})</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="py-2 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All ({images.length})
            </button>
          </div>
        )}
      </div>

      {/* Aggregate Savings Summary Banner */}
      {hasCompressedItems && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-card to-primary/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ✓
            </div>
            <div>
              <div className="text-sm font-bold text-foreground flex items-center gap-2">
                <span>Total Savings:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
                  {overallSavedPercent}%
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  ({formatFileSize(totalOriginalBytes - totalCompressedBytes)} saved)
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Original {formatFileSize(totalOriginalBytes)} → Compressed{" "}
                {formatFileSize(totalCompressedBytes)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadAll}
              className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Batch Download All
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {images.length < 10 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/60 hover:bg-muted/30 bg-card/40"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp"
            className="hidden"
          />
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              {images.length === 0
                ? "Drop up to 10 images here or browse"
                : `Add more images (${10 - images.length} slots remaining)`}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              Supports JPEG, PNG, WebP, AVIF, and GIF up to 25MB each
            </p>
          </div>
        </div>
      )}

      {/* Image Items List */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            <span>Uploaded Images ({images.length}/10)</span>
            <span>Batch Progress</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {images.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-card border border-border shadow-xs hover:border-border/90 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Thumbnail & File Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted/60 shrink-0 border border-border">
                    <img
                      src={item.compressedUrl || item.originalUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                      {item.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span>Original: {formatFileSize(item.originalSize)}</span>

                      {item.status === "done" && item.compressedSize !== null && (
                        <>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/60" />
                          <span className="font-semibold text-foreground">
                            {formatFileSize(item.compressedSize)}
                          </span>
                        </>
                      )}

                      {item.originalWidth && item.originalHeight && (
                        <span className="hidden md:inline px-1.5 py-0.2 rounded bg-muted text-[10px] font-mono">
                          {item.originalWidth}×{item.originalHeight}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Savings Badge */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {item.status === "compressing" && (
                    <div className="flex items-center gap-2 text-xs text-primary font-medium">
                      <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>{item.progress}%</span>
                    </div>
                  )}

                  {item.status === "done" && (
                    <div className="flex items-center gap-2">
                      {item.savedPercent !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                            item.savedPercent > 0
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.savedPercent > 0 ? `-${item.savedPercent}%` : "0%"}
                        </span>
                      )}

                      {/* Before / After Preview Button */}
                      <button
                        type="button"
                        onClick={() => setActiveCompareItem(item)}
                        title="Compare Before vs After"
                        className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Download Single Button */}
                      <button
                        type="button"
                        onClick={() => downloadSingle(item)}
                        className="py-1.5 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  )}

                  {item.status === "error" && (
                    <div className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Failed</span>
                    </div>
                  )}

                  {item.status === "idle" && (
                    <button
                      type="button"
                      onClick={async () => {
                        setImages((prev) =>
                          prev.map((i) =>
                            i.id === item.id ? { ...i, status: "compressing", progress: 20 } : i
                          )
                        );
                        try {
                          const res = await compressSingleImage(
                            item,
                            quality,
                            format,
                            maxDimension
                          );
                          const savedPercent = Math.max(
                            0,
                            Math.round(
                              ((item.originalSize - res.size) / item.originalSize) * 100
                            )
                          );
                          setImages((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? {
                                    ...i,
                                    compressedBlob: res.blob,
                                    compressedUrl: res.url,
                                    compressedSize: res.size,
                                    status: "done",
                                    progress: 100,
                                    savedPercent,
                                  }
                                : i
                            )
                          );
                        } catch (err: any) {
                          setImages((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? {
                                    ...i,
                                    status: "error",
                                    error: err?.message || "Compression failed",
                                  }
                                : i
                            )
                          );
                        }
                      }}
                      className="py-1 px-2.5 rounded-lg bg-secondary hover:bg-muted text-secondary-foreground text-xs font-medium border border-border transition-colors cursor-pointer"
                    >
                      Compress
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Before/After Visual Comparison Modal */}
      {activeCompareItem && activeCompareItem.compressedUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Visual Fidelity Inspector
                </h4>
                <p className="text-xs text-muted-foreground truncate max-w-sm">
                  {activeCompareItem.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCompareItem(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Screen Slider Comparison */}
            <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden select-none">
              {/* After (Compressed) Image */}
              <img
                src={activeCompareItem.compressedUrl}
                alt="Compressed"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-emerald-400 font-bold">
                COMPRESSED ({formatFileSize(activeCompareItem.compressedSize || 0)})
              </div>

              {/* Before (Original) Image with clip-path */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - compareSliderPos}% 0 0)` }}
              >
                <img
                  src={activeCompareItem.originalUrl}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-white font-bold">
                  ORIGINAL ({formatFileSize(activeCompareItem.originalSize)})
                </div>
              </div>

              {/* Slider Divider Line */}
              <div
                className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none"
                style={{ left: `${compareSliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-[10px] text-black font-bold">
                  ↔
                </div>
              </div>

              {/* Interactive range input overlaid */}
              <input
                type="range"
                min="0"
                max="100"
                value={compareSliderPos}
                onChange={(e) => setCompareSliderPos(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>Drag slider left / right to compare resolution & sharpness</span>
              <button
                type="button"
                onClick={() => downloadSingle(activeCompareItem)}
                className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download This Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
