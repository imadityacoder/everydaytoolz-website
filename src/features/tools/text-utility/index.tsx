"use client";

import React, { useState, useMemo, useId } from "react";
import {
  FileSpreadsheet,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Clock,
  Mic,
  AlignLeft,
  Hash,
  Scissors,
  CheckCircle2,
  Share2,
} from "lucide-react";

// Standard English stop words to exclude from keyword density analysis
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
  "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
  "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
  "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
  "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no",
  "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
  "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd",
  "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that",
  "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
  "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
  "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
  "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's",
  "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom",
  "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll",
  "you're", "you've", "your", "yours", "yourself", "yourselves", "will", "just",
  "also", "can", "may", "get", "like"
]);

const SAMPLE_TEXT = `Modern web development thrives on lightning-fast utilities, private client-side processing, and seamless user experiences.

When building applications, developers often analyze text metrics to optimize readability, SEO meta tags, and social media constraints. Efficient algorithms and responsive design empower users to accomplish daily tasks with zero latency and complete data confidentiality.

Try typing or pasting your own content here to inspect real-time word counts, reading speeds, and top keyword distributions.`;

export default function TextUtility() {
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [copied, setCopied] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const textAreaId = useId();

  // ================= METRICS CALCULATION =================
  const stats = useMemo(() => {
    const raw = text;
    const trimmed = raw.trim();

    // Characters
    const charsWithSpaces = raw.length;
    const charsWithoutSpaces = raw.replace(/\s/g, "").length;

    // Words
    const wordsArray = trimmed === "" ? [] : trimmed.split(/\s+/).filter(Boolean);
    const wordCount = wordsArray.length;

    // Sentences (split by punctuation followed by space or newline)
    const sentenceMatches = raw.match(/[^.!?\n]+[.!?]+(\s|$)/g);
    const sentenceCount = sentenceMatches
      ? sentenceMatches.length
      : trimmed.length > 0
      ? 1
      : 0;

    // Paragraphs (chunks separated by newlines)
    const paragraphs = raw
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const paragraphCount = paragraphs.length;

    // Reading & Speaking times
    // Average silent reading: ~225 wpm
    // Average speaking rate: ~135 wpm
    const readingMinutes = wordCount / 225;
    const speakingMinutes = wordCount / 135;

    const formatTime = (minutesDecimal: number) => {
      if (minutesDecimal === 0) return "0 sec";
      const totalSeconds = Math.round(minutesDecimal * 60);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      if (mins === 0) return `${secs} sec`;
      if (secs === 0) return `${mins} min`;
      return `${mins}m ${secs}s`;
    };

    // Estimated standard pages (250 words per page)
    const pages = wordCount === 0 ? 0 : (wordCount / 250).toFixed(1);

    // Lines count
    const linesCount = raw === "" ? 0 : raw.split(/\r\n|\r|\n/).length;

    return {
      charsWithSpaces,
      charsWithoutSpaces,
      wordCount,
      sentenceCount,
      paragraphCount,
      readingTime: formatTime(readingMinutes),
      speakingTime: formatTime(speakingMinutes),
      pages,
      linesCount,
    };
  }, [text]);

  // ================= KEYWORD DENSITY ANALYSIS =================
  const keywordDensity = useMemo(() => {
    if (!text.trim()) return [];

    // Extract alphanumeric word tokens
    const words = text.toLowerCase().match(/\b[a-z0-9]+(?:'[a-z0-9]+)?\b/gi) || [];
    const validWords = words.filter(
      (w) => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w)
    );

    if (validWords.length === 0) return [];

    const freqMap: Record<string, number> = {};
    for (const w of validWords) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }

    const sorted = Object.entries(freqMap)
      .map(([word, count]) => ({
        word,
        count,
        density: Math.round((count / validWords.length) * 1000) / 10, // e.g. 8.4%
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return sorted;
  }, [text]);

  // ================= CASE TRANSFORMATIONS =================
  const applyTransform = (actionName: string, transformFn: (current: string) => string) => {
    setText((prev) => {
      const next = transformFn(prev);
      setLastAction(`Converted to ${actionName}`);
      setTimeout(() => setLastAction(null), 2500);
      return next;
    });
  };

  const toUpperCase = () => applyTransform("UPPERCASE", (s) => s.toUpperCase());
  const toLowerCase = () => applyTransform("lowercase", (s) => s.toLowerCase());

  const toTitleCase = () =>
    applyTransform("Title Case", (s) =>
      s.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      )
    );

  const toSentenceCase = () =>
    applyTransform("Sentence case", (s) =>
      s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    );

  const toCamelCase = () =>
    applyTransform("camelCase", (s) => {
      const words = s
        .replace(/[^a-zA-Z0-9\s]/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      if (words.length === 0) return "";
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
    });

  const toSnakeCase = () =>
    applyTransform("snake_case", (s) => {
      return s
        .replace(/[^a-zA-Z0-9\s]/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase())
        .join("_");
    });

  const toKebabCase = () =>
    applyTransform("kebab-case", (s) => {
      return s
        .replace(/[^a-zA-Z0-9\s]/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase())
        .join("-");
    });

  const stripWhitespace = () =>
    applyTransform("Cleaned Whitespace", (s) => {
      return s
        .split("\n")
        .map((line) => line.trim().replace(/[ \t]+/g, " "))
        .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
        .join("\n")
        .trim();
    });

  // ================= UTILITIES =================
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const clearText = () => {
    setText("");
    setLastAction("Cleared text");
    setTimeout(() => setLastAction(null), 2000);
  };

  const loadSample = () => {
    setText(SAMPLE_TEXT);
    setLastAction("Sample text loaded");
    setTimeout(() => setLastAction(null), 2000);
  };

  // Social Limits check
  const limits = [
    { name: "Twitter / X Post", max: 280, current: stats.charsWithSpaces },
    { name: "Google Meta Title", max: 60, current: stats.charsWithSpaces },
    { name: "Google Meta Description", max: 160, current: stats.charsWithSpaces },
    { name: "SMS Message Segment", max: 160, current: stats.charsWithSpaces },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Real-Time Live Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <div className="p-3 rounded-xl bg-card border border-border shadow-2xs text-center">
          <span className="text-[11px] font-medium text-muted-foreground block">Words</span>
          <span className="text-xl font-bold text-foreground font-mono mt-0.5 block">
            {stats.wordCount.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border shadow-2xs text-center">
          <span className="text-[11px] font-medium text-muted-foreground block">Characters</span>
          <span className="text-xl font-bold text-foreground font-mono mt-0.5 block">
            {stats.charsWithSpaces.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground block">with spaces</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border shadow-2xs text-center">
          <span className="text-[11px] font-medium text-muted-foreground block">Characters</span>
          <span className="text-xl font-bold text-foreground font-mono mt-0.5 block">
            {stats.charsWithoutSpaces.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground block">no spaces</span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border shadow-2xs text-center">
          <span className="text-[11px] font-medium text-muted-foreground block">Sentences</span>
          <span className="text-xl font-bold text-foreground font-mono mt-0.5 block">
            {stats.sentenceCount}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border shadow-2xs text-center">
          <span className="text-[11px] font-medium text-muted-foreground block">Paragraphs</span>
          <span className="text-xl font-bold text-foreground font-mono mt-0.5 block">
            {stats.paragraphCount}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shadow-2xs text-center">
          <span className="text-[11px] font-medium text-primary flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> Reading
          </span>
          <span className="text-sm font-bold text-foreground font-mono mt-1 block">
            {stats.readingTime}
          </span>
          <span className="text-[10px] text-muted-foreground block">~225 wpm</span>
        </div>

        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-2xs text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1">
            <Mic className="w-3 h-3" /> Speaking
          </span>
          <span className="text-sm font-bold text-foreground font-mono mt-1 block">
            {stats.speakingTime}
          </span>
          <span className="text-[10px] text-muted-foreground block">~135 wpm</span>
        </div>
      </div>

      {/* Editor & 1-Click Transformations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT / MAIN: TEXTAREA & CONTROLS (8 cols) ================= */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            {/* Action Bar Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-secondary/40 border-b border-border text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <AlignLeft className="w-4 h-4 text-primary" />
                <span>Text Editor</span>
                {lastAction && (
                  <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {lastAction}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={loadSample}
                  className="px-2.5 py-1 rounded-md text-xs font-medium hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  Load Sample
                </button>
                <button
                  type="button"
                  onClick={clearText}
                  className="px-2.5 py-1 rounded-md text-xs font-medium hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Input Textarea */}
            <div className="p-3">
              <label htmlFor={textAreaId} className="sr-only">
                Text content for analysis and transformation
              </label>
              <textarea
                id={textAreaId}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={10}
                className="w-full resize-y bg-transparent p-2 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/60 leading-relaxed font-sans"
              />
            </div>

            {/* Bottom Status strip */}
            <div className="flex items-center justify-between px-4 py-2 bg-secondary/20 border-t border-border text-[11px] text-muted-foreground">
              <span>{stats.linesCount} lines • ~{stats.pages} pages</span>
              <span>100% Client-Side In-Memory Processing</span>
            </div>
          </div>

          {/* 1-Click Transformations Toolbar */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                1-Click Transformations
              </span>
              <span className="text-[11px] text-muted-foreground">Instant non-destructive case converter</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toUpperCase}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary text-xs font-semibold text-foreground transition-all cursor-pointer"
              >
                UPPERCASE
              </button>
              <button
                type="button"
                onClick={toLowerCase}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary text-xs font-semibold text-foreground transition-all cursor-pointer"
              >
                lowercase
              </button>
              <button
                type="button"
                onClick={toTitleCase}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary text-xs font-semibold text-foreground transition-all cursor-pointer"
              >
                Title Case
              </button>
              <button
                type="button"
                onClick={toSentenceCase}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary text-xs font-semibold text-foreground transition-all cursor-pointer"
              >
                Sentence case
              </button>
              <button
                type="button"
                onClick={toCamelCase}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary text-xs font-mono font-medium text-foreground transition-all cursor-pointer"
              >
                camelCase
              </button>
              <button
                type="button"
                onClick={toSnakeCase}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary text-xs font-mono font-medium text-foreground transition-all cursor-pointer"
              >
                snake_case
              </button>
              <button
                type="button"
                onClick={toKebabCase}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary text-xs font-mono font-medium text-foreground transition-all cursor-pointer"
              >
                kebab-case
              </button>
              <button
                type="button"
                onClick={stripWhitespace}
                className="px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 bg-secondary/50 hover:bg-secondary text-xs font-semibold text-foreground transition-all flex items-center gap-1 cursor-pointer"
              >
                <Scissors className="w-3.5 h-3.5 text-primary" />
                Strip Whitespace
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: KEYWORDS & SOCIAL LIMITS (4 cols) ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Top-5 Keyword Density Card */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-primary" />
                <span>Top-5 Keyword Density</span>
              </h3>
              <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-secondary">
                No Stop Words
              </span>
            </div>

            {keywordDensity.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                <p>Type text to analyze keyword frequency and density.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {keywordDensity.map((item, index) => {
                  const maxCount = keywordDensity[0].count;
                  const barWidth = Math.max(10, Math.round((item.count / maxCount) * 100));

                  return (
                    <div key={item.word} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                          <span className="w-4 text-muted-foreground font-mono text-[11px]">
                            #{index + 1}
                          </span>
                          <span className="text-foreground font-semibold truncate">
                            {item.word}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <span className="text-muted-foreground font-mono text-[11px]">
                            {item.count}×
                          </span>
                          <span className="text-primary font-mono font-bold text-[11px] w-12 text-right">
                            {item.density}%
                          </span>
                        </div>
                      </div>

                      {/* Mini bar */}
                      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          style={{ width: `${barWidth}%` }}
                          className="h-full bg-primary rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Social Media & SEO Limit Meters */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-primary" />
              <span>Platform Character Limits</span>
            </h3>

            <div className="space-y-3">
              {limits.map((l) => {
                const isOver = l.current > l.max;
                const percent = Math.min(100, Math.round((l.current / l.max) * 100));

                return (
                  <div key={l.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{l.name}</span>
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          isOver ? "text-rose-500 font-bold" : "text-foreground"
                        }`}
                      >
                        {l.current} / {l.max}
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full transition-all duration-300 ${
                          isOver ? "bg-rose-500" : percent > 85 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
