"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  parseJwt,
  evaluateJwtExpiration,
  formatTimestamp,
  verifyHs256Signature,
  generateSampleJwt,
  JwtExpirationStatus,
} from "../utils/jwt";
import {
  Key,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Lock,
  RefreshCw,
} from "lucide-react";

export function JwtDebuggerTab() {
  const [tokenInput, setTokenInput] = useState<string>(() => generateSampleJwt("active"));
  const [secretKey, setSecretKey] = useState<string>("your-256-bit-secret");
  const [copiedPart, setCopiedPart] = useState<string | null>(null);
  const [sigCheckResult, setSigCheckResult] = useState<{
    tested: boolean;
    valid: boolean;
    message: string;
  } | null>(null);

  // Live timer for countdown: tick every second
  const [currentEpoch, setCurrentEpoch] = useState<number>(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Parse JWT
  const parsed = useMemo(() => {
    return parseJwt(tokenInput);
  }, [tokenInput]);

  // Expiration analysis based on live clock
  const expStatus: JwtExpirationStatus = useMemo(() => {
    return evaluateJwtExpiration(parsed.payload, currentEpoch);
  }, [parsed.payload, currentEpoch]);

  const handleCopy = (text: string, part: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPart(part);
    setTimeout(() => setCopiedPart(null), 2000);
  };

  const handleVerifySig = async () => {
    if (!parsed.validFormat) return;
    const res = await verifyHs256Signature(
      parsed.rawHeader,
      parsed.rawPayload,
      parsed.rawSignature,
      secretKey
    );
    setSigCheckResult({
      tested: true,
      valid: res.verified,
      message: res.message,
    });
  };

  const loadPreset = (type: "active" | "expired" | "no_exp") => {
    const sample = generateSampleJwt(type);
    setTokenInput(sample);
    setSigCheckResult(null);
  };

  // Badge styles
  const badgeStyle = useMemo(() => {
    switch (expStatus.badgeVariant) {
      case "success":
        return "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400";
      case "danger":
        return "bg-destructive/15 border-destructive/40 text-destructive";
      case "warning":
        return "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400";
      default:
        return "bg-blue-500/15 border-blue-500/40 text-blue-600 dark:text-blue-400";
    }
  }, [expStatus.badgeVariant]);

  return (
    <div className="space-y-5">
      {/* Top Presets bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/60 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            JWT Presets:
          </span>
          <button
            type="button"
            onClick={() => loadPreset("active")}
            className="px-2.5 py-1 text-xs rounded-lg font-medium bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer border border-border/40"
          >
            Active Token (+2h)
          </button>
          <button
            type="button"
            onClick={() => loadPreset("expired")}
            className="px-2.5 py-1 text-xs rounded-lg font-medium bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer border border-border/40"
          >
            Expired Token (-1h)
          </button>
          <button
            type="button"
            onClick={() => loadPreset("no_exp")}
            className="px-2.5 py-1 text-xs rounded-lg font-medium bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer border border-border/40"
          >
            Lifetime (No Expiry)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTokenInput("")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer border border-border/40"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleCopy(tokenInput, "raw-all")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            {copiedPart === "raw-all" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPart === "raw-all" ? "Copied JWT!" : "Copy JWT"}</span>
          </button>
        </div>
      </div>

      {/* Main JWT Paste & Color Breakdown Area */}
      <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Key className="w-4 h-4 text-primary" />
            <span>Encoded Token</span>
            <span className="font-normal text-muted-foreground ml-1">(Paste Bearer or raw token)</span>
          </label>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="flex items-center gap-1 text-rose-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Header
            </span>
            <span className="flex items-center gap-1 text-purple-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Payload
            </span>
            <span className="flex items-center gap-1 text-cyan-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Signature
            </span>
          </div>
        </div>

        {/* Input textarea */}
        <textarea
          value={tokenInput}
          onChange={(e) => {
            setTokenInput(e.target.value.replace(/^Bearer\s+/i, ""));
            setSigCheckResult(null);
          }}
          placeholder="Paste encoded JWT string here (e.g. eyJhbGciOi...)..."
          className="w-full h-24 p-3 font-mono text-xs rounded-xl bg-muted/40 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/50 resize-none break-all"
        />

        {/* Live Colorized Token String Visualizer */}
        {parsed.validFormat && (
          <div className="p-3 rounded-xl bg-muted/20 border border-border/40 font-mono text-xs break-all leading-relaxed select-all">
            <span className="text-rose-500 dark:text-rose-400 font-semibold bg-rose-500/10 px-0.5 rounded">
              {parsed.rawHeader}
            </span>
            <span className="text-muted-foreground font-bold px-0.5">.</span>
            <span className="text-purple-500 dark:text-purple-400 font-semibold bg-purple-500/10 px-0.5 rounded">
              {parsed.rawPayload}
            </span>
            <span className="text-muted-foreground font-bold px-0.5">.</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold bg-cyan-500/10 px-0.5 rounded">
              {parsed.rawSignature}
            </span>
          </div>
        )}

        {parsed.error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{parsed.error}</span>
          </div>
        )}
      </div>

      {/* Decoded Sections: 2-Column Responsive Layout */}
      {parsed.validFormat && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column: Header & Signature */}
          <div className="space-y-5">
            {/* 1. Header Card */}
            <div className="rounded-2xl bg-card border border-rose-500/30 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-rose-500/10 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-rose-500">Header: Algorithm & Token Type</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(parsed.header, null, 2), "header")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-400 cursor-pointer"
                >
                  {copiedPart === "header" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPart === "header" ? "Copied" : "Copy JSON"}</span>
                </button>
              </div>

              <div className="p-4 space-y-3">
                <pre className="font-mono text-xs text-foreground bg-muted/30 p-3 rounded-xl border border-border/40 overflow-x-auto leading-relaxed">
                  {JSON.stringify(parsed.header, null, 2)}
                </pre>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                    Algorithm: <strong className="text-foreground">{parsed.header?.alg || "None"}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                    Type: <strong className="text-foreground">{parsed.header?.typ || "JWT"}</strong>
                  </span>
                  {parsed.header?.kid && (
                    <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                      Key ID (kid): <strong className="text-foreground">{parsed.header.kid}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Signature & Verification Card */}
            <div className="rounded-2xl bg-card border border-cyan-500/30 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-cyan-500/10 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    Signature: Cryptographic Proof
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(parsed.rawSignature, "sig")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:opacity-80 cursor-pointer"
                >
                  {copiedPart === "sig" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPart === "sig" ? "Copied" : "Copy Signature"}</span>
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/40 font-mono text-xs text-muted-foreground break-all">
                  {parsed.rawSignature || "<no signature>"}
                </div>

                {/* Secret Key verification for HS256 */}
                <div className="space-y-2 pt-1 border-t border-border/40">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      Client-Side HS256 Signature Verification:
                    </span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      Runs 100% locally
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={secretKey}
                      onChange={(e) => {
                        setSecretKey(e.target.value);
                        setSigCheckResult(null);
                      }}
                      placeholder="Enter HMAC SHA-256 secret key..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-muted/40 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleVerifySig}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shrink-0 shadow-xs"
                    >
                      Verify
                    </button>
                  </div>

                  {sigCheckResult?.tested && (
                    <div
                      className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                        sigCheckResult.valid
                          ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-destructive/15 border border-destructive/40 text-destructive"
                      }`}
                    >
                      {sigCheckResult.valid ? (
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                      )}
                      <span>{sigCheckResult.message}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-muted/20 p-2.5 rounded-xl border border-border/30">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                  <span>
                    Tokens and secret keys never leave your browser. If your token uses RS256/ES256,
                    signatures are cryptographically verified against the issuer's public RSA/ECDSA key.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payload & Live Expiration Evaluation */}
          <div className="space-y-5">
            {/* Payload Card */}
            <div className="rounded-2xl bg-card border border-purple-500/30 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 bg-purple-500/10 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    Payload: Decoded Claims & Data
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(parsed.payload, null, 2), "payload")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:opacity-80 cursor-pointer"
                >
                  {copiedPart === "payload" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPart === "payload" ? "Copied" : "Copy JSON"}</span>
                </button>
              </div>

              <div className="p-4 space-y-4 flex-1 flex flex-col">
                {/* Live Active / Expired Countdown Badge */}
                <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${badgeStyle}`}>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                    <div className="text-xs font-bold">{expStatus.label}</div>
                  </div>
                  <div className="text-[11px] font-mono opacity-80 whitespace-nowrap">
                    Clock: {new Date(currentEpoch * 1000).toLocaleTimeString()}
                  </div>
                </div>

                {/* Formatted Claims JSON */}
                <pre className="font-mono text-xs text-foreground bg-muted/30 p-3 rounded-xl border border-border/40 overflow-x-auto leading-relaxed max-h-56">
                  {JSON.stringify(parsed.payload, null, 2)}
                </pre>

                {/* Standard Claims Inspector Table */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>Claims & Timestamp Inspection</span>
                  </h4>

                  <div className="rounded-xl border border-border/50 overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-muted/50 border-b border-border/50 text-[11px] text-muted-foreground uppercase font-semibold">
                        <tr>
                          <th className="px-3 py-2">Claim</th>
                          <th className="px-3 py-2">Description</th>
                          <th className="px-3 py-2">Decoded / Date Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 font-mono text-[11px]">
                        {/* exp */}
                        {parsed.payload?.exp !== undefined && (
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-2 font-bold text-purple-500">exp</td>
                            <td className="px-3 py-2 font-sans text-muted-foreground">Expiration Time</td>
                            <td className="px-3 py-2">
                              <div>{formatTimestamp(parsed.payload.exp).local}</div>
                              <div className="text-[10px] text-muted-foreground font-sans">
                                (UTC: {formatTimestamp(parsed.payload.exp).utc})
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* iat */}
                        {parsed.payload?.iat !== undefined && (
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-2 font-bold text-purple-500">iat</td>
                            <td className="px-3 py-2 font-sans text-muted-foreground">Issued At</td>
                            <td className="px-3 py-2">
                              <div>{formatTimestamp(parsed.payload.iat).local}</div>
                              <div className="text-[10px] text-muted-foreground font-sans">
                                (UTC: {formatTimestamp(parsed.payload.iat).utc})
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* nbf */}
                        {parsed.payload?.nbf !== undefined && (
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-2 font-bold text-purple-500">nbf</td>
                            <td className="px-3 py-2 font-sans text-muted-foreground">Not Before</td>
                            <td className="px-3 py-2">
                              <div>{formatTimestamp(parsed.payload.nbf).local}</div>
                            </td>
                          </tr>
                        )}

                        {/* iss */}
                        {parsed.payload?.iss && (
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-2 font-bold text-purple-500">iss</td>
                            <td className="px-3 py-2 font-sans text-muted-foreground">Issuer</td>
                            <td className="px-3 py-2 text-foreground font-sans break-all">
                              {parsed.payload.iss}
                            </td>
                          </tr>
                        )}

                        {/* sub */}
                        {parsed.payload?.sub && (
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-2 font-bold text-purple-500">sub</td>
                            <td className="px-3 py-2 font-sans text-muted-foreground">Subject / User ID</td>
                            <td className="px-3 py-2 text-foreground font-sans break-all">
                              {parsed.payload.sub}
                            </td>
                          </tr>
                        )}

                        {/* aud */}
                        {parsed.payload?.aud && (
                          <tr className="hover:bg-muted/20">
                            <td className="px-3 py-2 font-bold text-purple-500">aud</td>
                            <td className="px-3 py-2 font-sans text-muted-foreground">Audience</td>
                            <td className="px-3 py-2 text-foreground font-sans break-all">
                              {Array.isArray(parsed.payload.aud)
                                ? parsed.payload.aud.join(", ")
                                : parsed.payload.aud}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
