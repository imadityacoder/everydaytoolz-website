"use client";

import React, { useState } from "react";
import { Braces, KeyRound, Sparkles } from "lucide-react";
import { JsonStudioTab } from "./components/JsonStudioTab";
import { JwtDebuggerTab } from "./components/JwtDebuggerTab";

export default function JsonJwtStudio() {
  const [activeTab, setActiveTab] = useState<"json" | "jwt">("json");

  return (
    <div className="w-full space-y-6">
      {/* Top Header bar with Tab switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm">
        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/40">
          <button
            type="button"
            onClick={() => setActiveTab("json")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "json"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Braces className="w-4 h-4" />
            <span>JSON Studio</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("jwt")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "jwt"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>JWT Debugger</span>
          </button>
        </div>

        {/* Feature Highlights pill */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/40">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-foreground">100% Client-Side</span>
            <span className="hidden sm:inline">• Zero Server Uploads</span>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "json" ? <JsonStudioTab /> : <JwtDebuggerTab />}
    </div>
  );
}
