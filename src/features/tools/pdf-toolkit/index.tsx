"use client";

import React, { useState, useRef, useId } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  UploadCloud,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Scissors,
  Layers,
  AlertCircle,
  CheckCircle2,
  FilePlus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";

interface PdfItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

export default function PdfToolkit() {
  const [activeTab, setActiveTab] = useState<"merge" | "split">("merge");

  // ================= MERGE STATE =================
  const [mergeFiles, setMergeFiles] = useState<PdfItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeLoadingText, setMergeLoadingText] = useState("");
  const [mergeSuccess, setMergeSuccess] = useState<string | null>(null);
  const [mergeError, setMergeError] = useState<string | null>(null);
  const [isMergeDragging, setIsMergeDragging] = useState(false);
  const mergeFileInputRef = useRef<HTMLInputElement>(null);
  const mergeFileInputId = useId();

  // ================= SPLIT STATE =================
  const [splitFile, setSplitFile] = useState<PdfItem | null>(null);
  const [splitMode, setSplitMode] = useState<"extract" | "remove">("extract");
  const [pageRangeInput, setPageRangeInput] = useState<string>("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitSuccess, setSplitSuccess] = useState<string | null>(null);
  const [splitError, setSplitError] = useState<string | null>(null);
  const [isSplitDragging, setIsSplitDragging] = useState(false);
  const splitFileInputRef = useRef<HTMLInputElement>(null);
  const splitFileInputId = useId();

  // ----------------- Helpers -----------------
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ================= MERGE LOGIC =================
  const handleMergeFilesAdded = async (newFiles: FileList | File[]) => {
    setMergeError(null);
    setMergeSuccess(null);
    const addedItems: PdfItem[] = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setMergeError(`Skipped non-PDF file: ${file.name}`);
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        addedItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          pageCount,
          arrayBuffer: buffer,
        });
      } catch (err: unknown) {
        console.error("Failed to parse PDF:", err);
        setMergeError(`Could not read "${file.name}". It may be password-protected or corrupt.`);
      }
    }

    if (addedItems.length > 0) {
      setMergeFiles((prev) => [...prev, ...addedItems]);
    }
  };

  const moveMergeItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === mergeFiles.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...mergeFiles];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setMergeFiles(updated);
  };

  const removeMergeItem = (id: string) => {
    setMergeFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllMergeFiles = () => {
    setMergeFiles([]);
    setMergeSuccess(null);
    setMergeError(null);
  };

  const handleMergeAndDownload = async () => {
    if (mergeFiles.length < 2) {
      setMergeError("Please add at least 2 PDF documents to merge.");
      return;
    }

    try {
      setIsMerging(true);
      setMergeError(null);
      setMergeSuccess(null);
      setMergeLoadingText("Initializing merged PDF container...");

      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < mergeFiles.length; i++) {
        const item = mergeFiles[i];
        setMergeLoadingText(`Merging "${item.name}" (file ${i + 1} of ${mergeFiles.length})...`);
        const srcDoc = await PDFDocument.load(item.arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      setMergeLoadingText("Compiling final document...");
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `merged-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setMergeSuccess(
        `Successfully merged ${mergeFiles.length} PDFs (${mergedPdf.getPageCount()} total pages)! Download started.`
      );
    } catch (err: unknown) {
      console.error("PDF Merge Error:", err);
      setMergeError(
        err instanceof Error
          ? err.message
          : "Failed to merge PDF files. Please ensure files are valid and unencrypted."
      );
    } finally {
      setIsMerging(false);
      setMergeLoadingText("");
    }
  };

  const totalMergePages = mergeFiles.reduce((acc, f) => acc + f.pageCount, 0);
  const totalMergeSize = mergeFiles.reduce((acc, f) => acc + f.size, 0);

  // ================= SPLIT LOGIC =================
  const handleSplitFileAdded = async (fileList: FileList | File[]) => {
    if (fileList.length === 0) return;
    const file = fileList[0];
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setSplitError("Please select a valid PDF file.");
      return;
    }

    try {
      setSplitError(null);
      setSplitSuccess(null);
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();

      const item: PdfItem = {
        id: `split-${Date.now()}`,
        file,
        name: file.name,
        size: file.size,
        pageCount,
        arrayBuffer: buffer,
      };

      setSplitFile(item);
      // Default to extract pages 1 to total or 1-2
      const initialRange = pageCount > 1 ? `1-${Math.min(pageCount, 3)}` : "1";
      setPageRangeInput(initialRange);
      syncSelectedPagesFromRange(initialRange, pageCount, "extract");
    } catch (err: unknown) {
      console.error("PDF Split load error:", err);
      setSplitError(`Could not read "${file.name}". File may be password-protected or corrupt.`);
    }
  };

  const parseRangesToPages = (rangeStr: string, totalPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(",").map((s) => s.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-").map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
          const maxEnd = Math.min(end, totalPages);
          for (let p = Math.max(1, start); p <= maxEnd; p++) {
            pages.add(p);
          }
        }
      } else {
        const single = parseInt(part, 10);
        if (!isNaN(single) && single >= 1 && single <= totalPages) {
          pages.add(single);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const syncSelectedPagesFromRange = (
    rangeStr: string,
    totalPages: number,
    mode: "extract" | "remove"
  ) => {
    const parsed = parseRangesToPages(rangeStr, totalPages);
    if (mode === "extract") {
      setSelectedPages(parsed);
    } else {
      // Remove mode: include all pages except parsed
      const kept = [];
      for (let p = 1; p <= totalPages; p++) {
        if (!parsed.includes(p)) kept.push(p);
      }
      setSelectedPages(kept);
    }
  };

  const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPageRangeInput(val);
    if (splitFile) {
      syncSelectedPagesFromRange(val, splitFile.pageCount, splitMode);
    }
  };

  const handleSplitModeToggle = (mode: "extract" | "remove") => {
    setSplitMode(mode);
    if (splitFile) {
      syncSelectedPagesFromRange(pageRangeInput, splitFile.pageCount, mode);
    }
  };

  const togglePageNumber = (pageNumber: number) => {
    if (!splitFile) return;

    if (splitMode === "extract") {
      let updated: number[];
      if (selectedPages.includes(pageNumber)) {
        updated = selectedPages.filter((p) => p !== pageNumber);
      } else {
        updated = [...selectedPages, pageNumber].sort((a, b) => a - b);
      }
      setSelectedPages(updated);
      setPageRangeInput(formatPagesToRangeString(updated));
    } else {
      // In remove mode, clicking toggles exclusion
      const currentlyExcluded = parseRangesToPages(pageRangeInput, splitFile.pageCount);
      let newExcluded: number[];
      if (currentlyExcluded.includes(pageNumber)) {
        newExcluded = currentlyExcluded.filter((p) => p !== pageNumber);
      } else {
        newExcluded = [...currentlyExcluded, pageNumber].sort((a, b) => a - b);
      }
      const newRangeStr = formatPagesToRangeString(newExcluded);
      setPageRangeInput(newRangeStr);
      syncSelectedPagesFromRange(newRangeStr, splitFile.pageCount, "remove");
    }
  };

  const formatPagesToRangeString = (pages: number[]): string => {
    if (pages.length === 0) return "";
    const ranges: string[] = [];
    let start = pages[0];
    let prev = pages[0];

    for (let i = 1; i < pages.length; i++) {
      if (pages[i] === prev + 1) {
        prev = pages[i];
      } else {
        ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
        start = pages[i];
        prev = pages[i];
      }
    }
    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
    return ranges.join(", ");
  };

  const handleSplitAndDownload = async () => {
    if (!splitFile) {
      setSplitError("Please select a PDF file first.");
      return;
    }

    if (selectedPages.length === 0) {
      setSplitError(
        splitMode === "extract"
          ? "No pages selected to extract. Enter valid page numbers (e.g. 1-3, 5)."
          : "All pages were removed. Please uncheck at least one page to keep."
      );
      return;
    }

    try {
      setIsSplitting(true);
      setSplitError(null);
      setSplitSuccess(null);

      const srcDoc = await PDFDocument.load(splitFile.arrayBuffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      // Convert 1-based page numbers to 0-based indices
      const pageIndices = selectedPages.map((p) => p - 1);
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);

      const baseName = splitFile.name.replace(/\.pdf$/i, "");
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${baseName}-${splitMode === "extract" ? "extracted" : "filtered"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setSplitSuccess(
        `Exported new PDF with ${newDoc.getPageCount()} pages! Download has started.`
      );
    } catch (err: unknown) {
      console.error("PDF Split Error:", err);
      setSplitError(
        err instanceof Error ? err.message : "Failed to extract pages from PDF."
      );
    } finally {
      setIsSplitting(false);
    }
  };

  const clearSplitFile = () => {
    setSplitFile(null);
    setPageRangeInput("");
    setSelectedPages([]);
    setSplitSuccess(null);
    setSplitError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Privacy Banner */}
      <div className="flex items-center justify-between p-3.5 px-4 rounded-xl bg-primary/5 border border-primary/20 text-xs sm:text-sm text-foreground">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong className="font-semibold text-primary">100% Client-Side Private:</strong> Your files never leave your computer. Processing happens in browser WebAssembly memory.
          </span>
        </div>
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          <Sparkles className="w-3 h-3" /> Zero Server Upload
        </span>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-border/80">
        <button
          type="button"
          onClick={() => setActiveTab("merge")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-px cursor-pointer ${
            activeTab === "merge"
              ? "border-primary text-primary bg-primary/5 rounded-t-lg"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Merge Multiple PDFs</span>
          {mergeFiles.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-mono">
              {mergeFiles.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("split")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-px cursor-pointer ${
            activeTab === "split"
              ? "border-primary text-primary bg-primary/5 rounded-t-lg"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Split & Extract Pages</span>
          {splitFile && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-mono">
              1 File
            </span>
          )}
        </button>
      </div>

      {/* ================= TAB 1: MERGE ================= */}
      {activeTab === "merge" && (
        <div className="space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsMergeDragging(true);
            }}
            onDragLeave={() => setIsMergeDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsMergeDragging(false);
              if (e.dataTransfer.files) {
                handleMergeFilesAdded(e.dataTransfer.files);
              }
            }}
            onClick={() => mergeFileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all flex flex-col items-center justify-center text-center ${
              isMergeDragging
                ? "border-primary bg-primary/10 scale-[0.99]"
                : "border-border hover:border-primary/60 bg-card/60 hover:bg-card"
            }`}
          >
            <input
              id={mergeFileInputId}
              ref={mergeFileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleMergeFilesAdded(e.target.files);
                }
                e.target.value = "";
              }}
            />
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-foreground">
              Drop PDF files here, or <span className="text-primary underline">browse</span>
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Add multiple PDFs to combine into a single document. Reorder pages and files freely before exporting.
            </p>
          </div>

          {/* Merge Feedback */}
          {mergeError && (
            <div className="flex items-center gap-2 p-3 text-xs sm:text-sm rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{mergeError}</span>
            </div>
          )}

          {mergeSuccess && (
            <div className="flex items-center gap-2 p-3 text-xs sm:text-sm rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{mergeSuccess}</span>
            </div>
          )}

          {/* File Queue */}
          {mergeFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    PDF Merge Order ({mergeFiles.length} {mergeFiles.length === 1 ? "document" : "documents"})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Total: {totalMergePages} pages • {formatBytes(totalMergeSize)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => mergeFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all cursor-pointer"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>Add More</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearAllMergeFiles}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {mergeFiles.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card/70 hover:bg-card hover:border-primary/40 transition-all shadow-xs gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate max-w-xs sm:max-w-md">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-[11px]">
                            {item.pageCount} {item.pageCount === 1 ? "page" : "pages"}
                          </span>
                          <span>•</span>
                          <span>{formatBytes(item.size)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label="Move file up"
                        title="Move Up"
                        disabled={index === 0}
                        onClick={() => moveMergeItem(index, "up")}
                        className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move file down"
                        title="Move Down"
                        disabled={index === mergeFiles.length - 1}
                        onClick={() => moveMergeItem(index, "down")}
                        className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove file"
                        title="Remove"
                        onClick={() => removeMergeItem(item.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Merge & Download Action Bar */}
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-sm font-bold text-foreground">Ready to merge</div>
                  <div className="text-xs text-muted-foreground">
                    Output document will contain {totalMergePages} pages in exact sequence
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isMerging || mergeFiles.length < 2}
                  onClick={handleMergeAndDownload}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isMerging ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{mergeLoadingText || "Merging PDFs..."}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Merge & Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: SPLIT / EXTRACT ================= */}
      {activeTab === "split" && (
        <div className="space-y-6">
          {!splitFile ? (
            /* Upload Zone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsSplitDragging(true);
              }}
              onDragLeave={() => setIsSplitDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsSplitDragging(false);
                if (e.dataTransfer.files) {
                  handleSplitFileAdded(e.dataTransfer.files);
                }
              }}
              onClick={() => splitFileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 transition-all flex flex-col items-center justify-center text-center ${
                isSplitDragging
                  ? "border-primary bg-primary/10 scale-[0.99]"
                  : "border-border hover:border-primary/60 bg-card/60 hover:bg-card"
              }`}
            >
              <input
                id={splitFileInputId}
                ref={splitFileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleSplitFileAdded(e.target.files);
                  }
                  e.target.value = "";
                }}
              />
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Scissors className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-foreground">
                Drop a PDF here to split, or <span className="text-primary underline">browse</span>
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Extract page ranges (e.g. 1-3, 5, 8-10) or remove unwanted pages with a single click.
              </p>
            </div>
          ) : (
            /* Split Workspace */
            <div className="space-y-6">
              {/* Loaded File Info Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border bg-card/70 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md">
                      {splitFile.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">
                        {splitFile.pageCount} Total Pages
                      </span>
                      <span>•</span>
                      <span>{formatBytes(splitFile.size)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearSplitFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all self-end sm:self-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Choose Another File</span>
                </button>
              </div>

              {/* Mode Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSplitModeToggle("extract")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    splitMode === "extract"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border hover:border-primary/40 bg-card/50"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        splitMode === "extract" ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    />
                    <span>Extract Specific Pages</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-5">
                    Keep only the pages you specify and discard the rest.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSplitModeToggle("remove")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    splitMode === "remove"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border hover:border-primary/40 bg-card/50"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        splitMode === "remove" ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    />
                    <span>Remove Unwanted Pages</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-5">
                    Delete specific pages and keep everything else.
                  </p>
                </button>
              </div>

              {/* Range Input Box */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label htmlFor="pdf-range-input" className="text-xs font-semibold text-foreground">
                    {splitMode === "extract"
                      ? "Pages or Ranges to Extract:"
                      : "Pages or Ranges to Remove:"}
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Example: <code className="bg-secondary px-1 py-0.5 rounded">1-3, 5, 8-10</code>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="pdf-range-input"
                    type="text"
                    value={pageRangeInput}
                    onChange={handleRangeInputChange}
                    placeholder={`e.g. 1-${Math.min(splitFile.pageCount, 5)}`}
                    className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (splitMode === "extract") {
                        const all = Array.from({ length: splitFile.pageCount }, (_, i) => i + 1);
                        setSelectedPages(all);
                        setPageRangeInput(`1-${splitFile.pageCount}`);
                      } else {
                        setSelectedPages([]);
                        setPageRangeInput("");
                      }
                    }}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all shrink-0 cursor-pointer"
                  >
                    {splitMode === "extract" ? "Select All" : "Clear All"}
                  </button>
                </div>
              </div>

              {/* Interactive Page Badges (up to 80 pages) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Interactive Page Selector (Click to toggle)
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedPages.length} of {splitFile.pageCount} pages will be in output
                  </span>
                </div>

                {splitFile.pageCount <= 120 ? (
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-card/40 max-h-56 overflow-y-auto">
                    {Array.from({ length: splitFile.pageCount }, (_, i) => i + 1).map((num) => {
                      const isIncluded = selectedPages.includes(num);
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => togglePageNumber(num)}
                          className={`w-10 h-10 rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isIncluded
                              ? "bg-primary text-primary-foreground shadow-xs scale-100"
                              : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground line-through opacity-70"
                          }`}
                        >
                          <span>{num}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 text-xs rounded-xl bg-secondary/50 text-muted-foreground flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-primary" />
                    <span>
                      Visual page grid hidden for large documents ({splitFile.pageCount} pages). Please use the range text box above.
                    </span>
                  </div>
                )}
              </div>

              {/* Feedback messages */}
              {splitError && (
                <div className="flex items-center gap-2 p-3 text-xs sm:text-sm rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{splitError}</span>
                </div>
              )}

              {splitSuccess && (
                <div className="flex items-center gap-2 p-3 text-xs sm:text-sm rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{splitSuccess}</span>
                </div>
              )}

              {/* Download Action Bar */}
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-sm font-bold text-foreground">
                    Output: {selectedPages.length} {selectedPages.length === 1 ? "page" : "pages"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedPages.length > 0
                      ? `Pages included: ${formatPagesToRangeString(selectedPages)}`
                      : "No pages selected"}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSplitting || selectedPages.length === 0}
                  onClick={handleSplitAndDownload}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSplitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Extracting Pages...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Extracted PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
