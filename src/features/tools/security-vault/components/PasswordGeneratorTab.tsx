"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  PasswordConfig,
  generateCsprngPassword,
  generateBulkPasswords,
  getEntropyRating,
  estimateCrackTimes,
  CrackTimeScenario,
} from "../utils/crypto";
import {
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Sliders,
  ListPlus,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export function PasswordGeneratorTab() {
  const [config, setConfig] = useState<PasswordConfig>({
    length: 16,
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: true,
    avoidAmbiguous: false,
  });

  const [password, setPassword] = useState<string>("");
  const [poolSize, setPoolSize] = useState<number>(94);
  const [entropyBits, setEntropyBits] = useState<number>(104.9);
  const [copied, setCopied] = useState<boolean>(false);
  const [spinRefresh, setSpinRefresh] = useState<boolean>(false);

  // Bulk Generator State
  const [bulkMode, setBulkMode] = useState<boolean>(false);
  const [bulkCount, setBulkCount] = useState<number>(10);
  const [bulkPasswords, setBulkPasswords] = useState<{ password: string; entropyBits: number }[]>([]);
  const [bulkCopied, setBulkCopied] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Regenerate primary password
  const regenerate = useCallback(() => {
    setSpinRefresh(true);
    setTimeout(() => setSpinRefresh(false), 300);
    const res = generateCsprngPassword(config);
    setPassword(res.password);
    setPoolSize(res.poolSize);
    setEntropyBits(res.entropyBits);
  }, [config]);

  // Initial and reactive generation
  useEffect(() => {
    regenerate();
  }, [regenerate]);

  // Bulk generation trigger
  const handleGenerateBulk = () => {
    const list = generateBulkPasswords(config, bulkCount);
    setBulkPasswords(list);
  };

  useEffect(() => {
    if (bulkMode) {
      handleGenerateBulk();
    }
  }, [bulkMode, bulkCount, config]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBulkSingle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const handleCopyAllBulk = () => {
    const text = bulkPasswords.map((p) => p.password).join("\n");
    navigator.clipboard.writeText(text);
    setBulkCopied(true);
    setTimeout(() => setBulkCopied(false), 2000);
  };

  const handleDownloadBulk = () => {
    const text = bulkPasswords.map((p) => p.password).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passwords_${config.length}chars_${bulkCount}items.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Entropy rating & crack times
  const entropyRating = useMemo(() => getEntropyRating(entropyBits), [entropyBits]);
  const crackScenarios: CrackTimeScenario[] = useMemo(() => estimateCrackTimes(entropyBits), [entropyBits]);

  return (
    <div className="space-y-6">
      {/* Primary Password Display Card */}
      <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">
              CSPRNG Generated Password
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBulkMode(!bulkMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                bulkMode
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border-border/40"
              }`}
            >
              <ListPlus className="w-3.5 h-3.5" />
              <span>Bulk Mode</span>
            </button>
          </div>
        </div>

        {/* Large Monospace Password Display */}
        <div className="relative flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 gap-3">
          <div className="flex-1 font-mono text-lg sm:text-2xl font-bold tracking-wider break-all text-foreground select-all leading-normal">
            {password.split("").map((char, index) => {
              let charStyle = "text-foreground";
              if (/[0-9]/.test(char)) charStyle = "text-sky-500 dark:text-sky-400";
              else if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?~]/.test(char))
                charStyle = "text-amber-500 dark:text-amber-400";
              else if (/[A-Z]/.test(char)) charStyle = "text-purple-600 dark:text-purple-400";
              return (
                <span key={index} className={charStyle}>
                  {char}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={regenerate}
              className="p-2.5 rounded-xl bg-card hover:bg-muted text-foreground border border-border/60 hover:border-primary/40 transition-all cursor-pointer shadow-xs"
              title="Regenerate Password"
            >
              <RefreshCw
                className={`w-4 h-4 ${spinRefresh ? "animate-spin text-primary" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={() => handleCopy(password)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-all cursor-pointer shadow-xs"
              title="Copy Password"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Real-Time Entropy Bits Meter */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-foreground">Password Entropy:</span>
              <span className="font-mono font-bold text-foreground">{entropyBits} bits</span>
              <span className="text-muted-foreground">({poolSize} char pool)</span>
            </div>
            <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${entropyRating.bgClass} ${entropyRating.colorClass}`}>
              {entropyRating.label}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${entropyRating.barColor}`}
              style={{ width: `${Math.min(100, entropyRating.score)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Configuration Sliders & Checkboxes */}
      <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <span>Generator Settings</span>
        </h3>

        {/* Length Slider & Direct Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Password Length: <span className="font-mono text-primary text-sm font-bold">{config.length}</span> chars
            </label>
            {/* Quick length presets */}
            <div className="flex items-center gap-1.5">
              {[12, 16, 24, 32, 64].map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, length: len }))}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                    config.length === len
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min={8}
              max={128}
              value={config.length}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, length: parseInt(e.target.value, 10) }))
              }
              className="flex-1 accent-primary h-2 bg-muted/80 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min={8}
              max={128}
              value={config.length}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setConfig((prev) => ({ ...prev, length: Math.min(128, Math.max(8, val)) }));
                }
              }}
              className="w-16 px-2.5 py-1 text-center font-mono text-xs rounded-lg bg-muted/40 border border-border/60 text-foreground font-bold"
            />
          </div>
        </div>

        {/* Character Set Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Uppercase */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/40 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={config.uppercase}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, uppercase: e.target.checked }))
              }
              className="rounded accent-primary w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <div className="font-bold text-foreground">Uppercase</div>
              <div className="text-muted-foreground font-mono text-[11px]">A-Z</div>
            </div>
          </label>

          {/* Lowercase */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/40 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={config.lowercase}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, lowercase: e.target.checked }))
              }
              className="rounded accent-primary w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <div className="font-bold text-foreground">Lowercase</div>
              <div className="text-muted-foreground font-mono text-[11px]">a-z</div>
            </div>
          </label>

          {/* Digits */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/40 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={config.digits}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, digits: e.target.checked }))
              }
              className="rounded accent-primary w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <div className="font-bold text-foreground">Digits</div>
              <div className="text-muted-foreground font-mono text-[11px]">0-9</div>
            </div>
          </label>

          {/* Symbols */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/40 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={config.symbols}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, symbols: e.target.checked }))
              }
              className="rounded accent-primary w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <div className="font-bold text-foreground">Symbols</div>
              <div className="text-muted-foreground font-mono text-[11px]">!@#$%^&*...</div>
            </div>
          </label>
        </div>

        {/* Avoid Ambiguous Toggle */}
        <div className="pt-1">
          <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={config.avoidAmbiguous}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, avoidAmbiguous: e.target.checked }))
              }
              className="rounded accent-primary w-4 h-4 cursor-pointer"
            />
            <span>
              Avoid ambiguous characters{" "}
              <span className="text-muted-foreground font-mono">(excludes 0, O, o, 1, l, I, |)</span>
            </span>
          </label>
        </div>
      </div>

      {/* Bulk Generator View */}
      {bulkMode && (
        <div className="p-6 rounded-2xl bg-card border border-primary/30 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                Bulk Password Batch
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs">
                <span className="px-2 text-muted-foreground font-semibold">Count:</span>
                {[5, 10, 25, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBulkCount(num)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      bulkCount === num
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopyAllBulk}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-xs"
              >
                {bulkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{bulkCopied ? "Copied All!" : "Copy All"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBulk}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-muted/80 hover:bg-muted text-foreground transition-all cursor-pointer border border-border/40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .txt</span>
              </button>
            </div>
          </div>

          {/* Passwords List */}
          <div className="max-h-64 overflow-y-auto space-y-2 p-2 rounded-xl bg-muted/20 border border-border/40">
            {bulkPasswords.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/40 hover:border-primary/40 transition-colors text-xs"
              >
                <span className="w-6 text-muted-foreground font-mono text-[11px]">
                  #{idx + 1}
                </span>
                <span className="flex-1 font-mono font-semibold text-foreground select-all break-all px-2">
                  {item.password}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {item.entropyBits} bits
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyBulkSingle(item.password, idx)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Copy this password"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brute-Force Crack Time Estimate Grid */}
      <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">
              Brute-Force Crack Time Estimates
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Based on average combinations (2^{entropyBits - 1})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {crackScenarios.map((scenario) => (
            <div
              key={scenario.name}
              className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-foreground">{scenario.name}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  {scenario.rateLabel}
                </div>
              </div>

              <div className="pt-2 border-t border-border/30">
                <div className="text-[10px] text-muted-foreground">Est. Crack Duration</div>
                <div
                  className={`text-sm font-bold font-mono mt-0.5 ${
                    scenario.isInstant
                      ? "text-destructive"
                      : entropyBits >= 80
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-foreground"
                  }`}
                >
                  {scenario.timeString}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 text-muted-foreground text-xs border border-border/30">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Entropy is generated exclusively via <strong className="text-foreground">window.crypto.getRandomValues()</strong> CSPRNG.
            No weak <code className="font-mono">Math.random()</code> pseudo-random numbers are ever utilized.
          </span>
        </div>
      </div>
    </div>
  );
}
