"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TOOLS_REGISTRY, CATEGORIES } from "@/config/tools-registry";
import { AdSlot } from "@/components/ads/AdSlot";
import { 
  Wrench, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  Coins, 
  FileText, 
  Braces, 
  Music, 
  Youtube, 
  Image as ImageIcon, 
  Activity, 
  ShieldCheck, 
  FileSpreadsheet,
  Zap,
  Lock,
  Cpu
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Coins,
  FileText,
  Braces,
  Music,
  Youtube,
  Image: ImageIcon,
  Activity,
  ShieldCheck,
  FileSpreadsheet,
};

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState("");

  const filteredTools = TOOLS_REGISTRY.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      !searchFilter.trim() ||
      tool.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative text-center py-6 sm:py-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>100% Free • No Login Required • In-Browser Execution</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
          Deterministic Daily Utilities.{" "}
          <span className="bg-gradient-to-r from-brand-indigo via-brand-cyan to-primary bg-clip-text text-transparent">
            Instant, Private & 100% Free.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Ten daily-use engineering, financial, media, and security tools running client-side with WebAssembly and hardware cryptography. <strong>100% free with no login required</strong>, no paywalls, zero latency.
        </p>

        {/* Search & Filter Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search tools by keyword or category... (e.g. SIP, PDF, Audio, JWT)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* High-Viewability Top Banner Ad */}
      <AdSlot position="top-banner" cpcTier="high" />

      {/* Category Tabs */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-sm"
                : "bg-card/60 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            All Utilities ({TOOLS_REGISTRY.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card/60 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTools.map((tool) => {
            const Icon = ICON_MAP[tool.iconName] || TrendingUp;

            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group p-5 rounded-2xl border border-border/70 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tool.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/30">
                          {tool.badge}
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40 text-xs">
                  <span className="text-muted-foreground/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>100% Free • No Login</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* High-Viewability Bottom Result Ad */}
      <AdSlot position="bottom-result" cpcTier="volume" />
    </div>
  );
}
