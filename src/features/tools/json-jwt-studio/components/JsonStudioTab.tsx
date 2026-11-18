"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  parseAndFormatJson,
  minifyJson,
  JSON_SAMPLE_PRESETS,
  JsonErrorInfo,
} from "../utils/json";
import { JsonTreeView } from "./JsonTreeView";
import {
  Copy,
  Check,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Code2,
  FolderTree,
  FileText,
  Sparkles,
  AlignLeft,
  Minimize,
} from "lucide-react";

export function JsonStudioTab() {
  const [inputText, setInputText] = useState<string>(() => JSON_SAMPLE_PRESETS[0].json);
  const [indentOption, setIndentOption] = useState<number>(2);
  const [viewMode, setViewMode] = useState<"code" | "tree">("code");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute parsed, formatted, error
  const { formatted, parsed, error } = useMemo(() => {
    return parseAndFormatJson(inputText, indentOption);
  }, [inputText, indentOption]);

  const handleFormat = (spaces: number) => {
    setIndentOption(spaces);
    if (!error && parsed !== null) {
      setInputText(JSON.stringify(parsed, null, spaces));
    }
  };

  const handleMinify = () => {
    const res = minifyJson(inputText);
    if (!res.error) {
      setInputText(res.minified);
    }
  };

  const handleClear = () => {
    setInputText("");
  };

  const handleCopy = () => {
    if (!inputText) return;
    const textToCopy = viewMode === "code" ? (formatted || inputText) : JSON.stringify(parsed, null, indentOption);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = formatted || inputText;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  };

  // Line count for input editor
  const inputLines = useMemo(() => {
    return inputText.split("\n");
  }, [inputText]);

  // Size calculation
  const byteSize = useMemo(() => {
    return new TextEncoder().encode(inputText).length;
  }, [inputText]);

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Samples & Global Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/60 shadow-sm">
        {/* Sample Loaders */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Samples:
          </span>
          {JSON_SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setInputText(preset.json)}
              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer border border-border/40 hover:border-primary/40"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* File actions */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,.txt"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer border border-border/40"
            title="Upload JSON file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all cursor-pointer border border-destructive/20"
            title="Clear Editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Validation Status Banner */}
      {inputText.trim() ? (
        error ? (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs font-medium space-y-1">
                <div className="font-bold">
                  JSON Syntax Error — Line {error.line}, Column {error.column}
                </div>
                <div className="text-destructive/90">{error.message}</div>
              </div>
            </div>

            {/* Error Pointer Box */}
            <div className="mt-2 p-2.5 rounded-lg bg-card/80 dark:bg-background/80 border border-destructive/20 font-mono text-xs overflow-x-auto">
              {error.snippet.map((snip) => (
                <div
                  key={snip.lineNum}
                  className={`flex items-start ${
                    snip.isError ? "text-destructive font-bold bg-destructive/15 -mx-1 px-1 rounded" : "text-muted-foreground"
                  }`}
                >
                  <span className="w-8 shrink-0 select-none text-right pr-3 opacity-60">
                    {snip.lineNum}
                  </span>
                  <span className="whitespace-pre">{snip.text || " "}</span>
                </div>
              ))}
              {/* Pointer indicator arrow */}
              <div className="flex items-start text-destructive font-bold">
                <span className="w-8 shrink-0 select-none text-right pr-3 opacity-0">.</span>
                <span className="whitespace-pre">{error.pointer}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">Valid JSON</span>
              <span className="text-muted-foreground ml-2">
                • {inputLines.length} lines • {byteSize} bytes
              </span>
            </div>
            <div className="text-[11px] font-mono text-muted-foreground">
              {typeof parsed === "object" && parsed !== null
                ? Array.isArray(parsed)
                  ? `Root Array [${parsed.length}]`
                  : `Root Object {${Object.keys(parsed).length} keys}`
                : "Primitive Value"}
            </div>
          </div>
        )
      ) : null}

      {/* Dual Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane: Input Editor */}
        <div className="flex flex-col rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Code2 className="w-4 h-4 text-primary" />
              <span>Input Editor (Raw JSON)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleFormat(2)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  indentOption === 2
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
                title="Format with 2 spaces"
              >
                2 Spaces
              </button>
              <button
                type="button"
                onClick={() => handleFormat(4)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  indentOption === 4
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
                title="Format with 4 spaces"
              >
                4 Spaces
              </button>
              <button
                type="button"
                onClick={handleMinify}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                title="Minify JSON (1-click compact)"
              >
                <Minimize className="w-3 h-3" />
                <span>Minify</span>
              </button>
            </div>
          </div>

          {/* Text Area with Line numbers */}
          <div className="relative flex flex-1 min-h-[460px] max-h-[600px] overflow-hidden bg-card/40">
            {/* Gutter */}
            <div className="w-10 select-none py-3 text-right pr-2 bg-muted/20 text-muted-foreground/60 font-mono text-xs overflow-hidden shrink-0 border-r border-border/30">
              {inputLines.map((_, i) => (
                <div
                  key={i}
                  className={`leading-relaxed ${
                    error && error.line === i + 1
                      ? "text-destructive font-bold bg-destructive/10"
                      : ""
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Input area */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder='Paste or type your JSON here (e.g. {"name": "Antigravity", "active": true})...'
              className="flex-1 p-3 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none leading-relaxed overflow-auto"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Pane: Formatted Output / Tree View */}
        <div className="flex flex-col rounded-2xl bg-card border border-border/60 shadow-sm overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border/50">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-xl border border-border/40">
              <button
                type="button"
                onClick={() => setViewMode("code")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "code"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5 text-primary" />
                <span>Formatted Code</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("tree")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "tree"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FolderTree className="w-3.5 h-3.5 text-primary" />
                <span>Collapsible Tree</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-xs"
                title="Copy Formatted JSON"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-muted/80 hover:bg-muted text-foreground transition-all cursor-pointer border border-border/40"
                title="Download .json file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Right Pane Body */}
          <div className="p-3 flex-1 min-h-[460px] max-h-[600px] overflow-auto bg-card/40">
            {error ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-3">
                <AlertTriangle className="w-10 h-10 text-destructive/60" />
                <div className="max-w-xs text-xs">
                  <span className="font-semibold text-foreground">Cannot preview invalid JSON</span>
                  <p className="mt-1 text-muted-foreground">
                    Fix syntax error on Line {error.line}, Column {error.column} in the left editor.
                  </p>
                </div>
              </div>
            ) : !inputText.trim() ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-2">
                <FileText className="w-10 h-10 opacity-40" />
                <div className="text-xs">
                  Paste JSON in the left pane to format, validate, and explore the tree.
                </div>
              </div>
            ) : viewMode === "tree" && parsed !== null ? (
              <JsonTreeView data={parsed} />
            ) : (
              <pre className="font-mono text-xs leading-relaxed text-foreground whitespace-pre overflow-x-auto p-2">
                {formatted}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
