"use client";

import React, { useState, useEffect, useMemo } from "react";
import { computeAllHashes, ComputedHashResult } from "../utils/crypto";
import {
  Hash,
  Copy,
  Check,
  Sparkles,
  Trash2,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
} from "lucide-react";

export function TextHasherTab() {
  const [inputText, setInputText] = useState<string>("Hello, World! Security Vault 2026.");
  const [format, setFormat] = useState<"hex" | "hexUpper" | "base64">("hex");
  const [compareHash, setCompareHash] = useState<string>("");
  const [hashes, setHashes] = useState<ComputedHashResult[]>([]);
  const [copiedAlgo, setCopiedAlgo] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(0);

  // Compute hashes asynchronously in real-time
  useEffect(() => {
    let isCancelled = false;
    const start = performance.now();

    computeAllHashes(inputText)
      .then((results) => {
        if (!isCancelled) {
          setHashes(results);
          setLatencyMs(Math.round((performance.now() - start) * 10) / 10);
        }
      })
      .catch((err) => {
        console.error("Hashing error:", err);
      });

    return () => {
      isCancelled = true;
    };
  }, [inputText]);

  // Text metrics
  const textMetrics = useMemo(() => {
    const chars = inputText.length;
    const bytes = new TextEncoder().encode(inputText).length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    return { chars, bytes, words };
  }, [inputText]);

  // Format hash output
  const getDisplayHash = (item: ComputedHashResult) => {
    if (format === "hexUpper") return item.hexUpper;
    if (format === "base64") return item.base64;
    return item.hex;
  };

  const handleCopyHash = (value: string, algo: string) => {
    navigator.clipboard.writeText(value);
    setCopiedAlgo(algo);
    setTimeout(() => setCopiedAlgo(null), 2000);
  };

  const handleCopyAll = () => {
    const text = hashes
      .map((h) => `${h.algorithm} (${h.bitLength}-bit):\n${getDisplayHash(h)}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Compare hash matching
  const matchResult = useMemo(() => {
    const cleanCompare = compareHash.trim().toLowerCase();
    if (!cleanCompare) return null;

    for (const h of hashes) {
      if (
        h.hex.toLowerCase() === cleanCompare ||
        h.base64.trim() === compareHash.trim()
      ) {
        return { matched: true, algorithm: h.algorithm };
      }
    }
    return { matched: false };
  }, [compareHash, hashes]);

  const presets = [
    { label: "Hello World", text: "Hello, World!" },
    { label: "API Secret", text: "sk_live_99847291039848201938" },
    { label: "Empty String", text: "" },
    {
      label: "Sample Paragraph",
      text: "The quick brown fox jumps over the lazy dog. Secure client-side hashing with zero server transmission.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Presets bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/60 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Presets:
          </span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setInputText(p.text)}
              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer border border-border/40"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputText("")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all cursor-pointer border border-destructive/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Input Text Area Card */}
      <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-primary" />
            <span>Input Text String</span>
            <span className="font-normal text-muted-foreground ml-1">
              (Hashes update automatically in real-time)
            </span>
          </label>

          <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
            <span>{textMetrics.chars} chars</span>
            <span>•</span>
            <span>{textMetrics.bytes} UTF-8 bytes</span>
            <span>•</span>
            <span>{textMetrics.words} words</span>
            <span>•</span>
            <span className="text-primary font-bold">{latencyMs}ms</span>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste any text string to generate cryptographic hashes..."
          className="w-full h-28 p-3.5 font-mono text-xs rounded-xl bg-muted/40 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/50 resize-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Format Switcher & Batch Copy Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm">
        {/* Format Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Output Format:</span>
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/40 text-xs">
            <button
              type="button"
              onClick={() => setFormat("hex")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                format === "hex"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hex (lowercase)
            </button>
            <button
              type="button"
              onClick={() => setFormat("hexUpper")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                format === "hexUpper"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hex (UPPERCASE)
            </button>
            <button
              type="button"
              onClick={() => setFormat("base64")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                format === "base64"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Base64
            </button>
          </div>
        </div>

        {/* Copy All Hashes Button */}
        <button
          type="button"
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-xs"
        >
          {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedAll ? "Copied All Hashes!" : "Copy All Hashes"}</span>
        </button>
      </div>

      {/* Hash Output Cards List */}
      <div className="space-y-3">
        {hashes.map((item) => {
          const displayValue = getDisplayHash(item);
          const isMatched =
            matchResult?.matched && matchResult.algorithm === item.algorithm;

          return (
            <div
              key={item.algorithm}
              className={`p-4 rounded-2xl bg-card border transition-all ${
                isMatched
                  ? "border-emerald-500 shadow-md ring-1 ring-emerald-500"
                  : "border-border/60 hover:border-primary/40 shadow-xs"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">
                    {item.algorithm}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40 font-mono">
                    {item.bitLength}-bit • {displayValue.length} chars
                  </span>
                  {item.algorithm === "MD5" && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                      RFC 1321
                    </span>
                  )}
                  {item.algorithm.startsWith("SHA") && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium">
                      WebCrypto
                    </span>
                  )}
                  {isMatched && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> MATCHED
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyHash(displayValue, item.algorithm)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/40"
                  title={`Copy ${item.algorithm} hash`}
                >
                  {copiedAlgo === item.algorithm ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedAlgo === item.algorithm ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Hash string box */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border/40 font-mono text-xs text-foreground select-all break-all leading-relaxed">
                {displayValue}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hash Verifier / Matcher Card */}
      <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <FileCheck2 className="w-4 h-4 text-primary" />
          <span>Hash Matcher & Checksum Verifier</span>
          <span className="font-normal text-muted-foreground ml-1">
            (Paste expected hash to verify integrity)
          </span>
        </label>

        <div className="relative">
          <input
            type="text"
            value={compareHash}
            onChange={(e) => setCompareHash(e.target.value)}
            placeholder="Paste expected hash here (e.g. 5d41402abc4b2a76b9719d911017c592)..."
            className="w-full px-3.5 py-2.5 font-mono text-xs rounded-xl bg-muted/40 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {compareHash.trim() && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border font-medium ${
              matchResult?.matched
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/15 border-destructive/40 text-destructive"
            }`}
          >
            {matchResult?.matched ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Match Confirmed! Input matches computed{" "}
                  <strong>{matchResult.algorithm}</strong> checksum.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Checksum Mismatch: Does not match any of the 5 computed hashes.
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
