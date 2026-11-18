"use client";

import React, { useState } from "react";
import { ShieldCheck, Hash, Sparkles } from "lucide-react";
import { PasswordGeneratorTab } from "./components/PasswordGeneratorTab";
import { TextHasherTab } from "./components/TextHasherTab";

export default function SecurityVault() {
  const [activeTab, setActiveTab] = useState<"password" | "hasher">("password");

  return (
    <div className="w-full space-y-6">
      {/* Top Header bar with Tab switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm">
        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/40">
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "password"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>CSPRNG Password Generator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hasher")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "hasher"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>Text Hasher</span>
          </button>
        </div>

        {/* Security Highlights pill */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/40">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-foreground">window.crypto.subtle</span>
            <span className="hidden sm:inline">• 100% Client-Side Engine</span>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "password" ? <PasswordGeneratorTab /> : <TextHasherTab />}
    </div>
  );
}
