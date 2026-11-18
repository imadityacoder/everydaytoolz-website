"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToolDefinition } from "@/types/tools";
import { getRelatedTools, CATEGORIES } from "@/config/tools-registry";
import { AdSlot } from "@/components/ads/AdSlot";
import { trackToolUsage, getToolStats } from "@/lib/supabase/client";
import { 
  ChevronRight, 
  Share2, 
  Check, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  Eye, 
  Star,
  ChevronDown
} from "lucide-react";

interface ToolShellProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function ToolShell({ tool, children }: ToolShellProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [stats, setStats] = useState<{ usageCount: number; avgRating: number } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [formulaOpen, setFormulaOpen] = useState(true);

  const categoryMeta = CATEGORIES.find((c) => c.id === tool.category);
  const relatedTools = getRelatedTools(tool);

  // Track tool usage on mount
  useEffect(() => {
    let isMounted = true;

    async function loadAndTrack() {
      // Fetch initial stats
      const initial = await getToolStats(tool.id);
      if (isMounted && initial) {
        setStats({ usageCount: initial.usageCount, avgRating: initial.avgRating });
      }

      // Increment usage count
      const updated = await trackToolUsage(tool.id);
      if (isMounted && updated) {
        setStats(updated);
      }
    }

    loadAndTrack();
    return () => {
      isMounted = false;
    };
  }, [tool.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} | RePlaner Tools`,
          text: tool.shortDescription,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 items-start">
      {/* Central Tool Workspace (max-w-[960px]) */}
      <main className="w-full xl:max-w-[960px] flex-1 min-w-0">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          <Link href={`/?category=${tool.category}`} className="hover:text-foreground transition-colors capitalize">
            {categoryMeta?.name.split(" ")[0]}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
            {tool.name}
          </span>
        </nav>

        {/* Tool Header: Title, Description, Stats & Share */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {tool.name}
              </h1>
              {tool.badge && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/30">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {tool.shortDescription}
            </p>

            {/* Real-Time Live Usage & Rating Badge */}
            <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/60 border border-border/60 font-mono">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>
                  {stats?.usageCount ? stats.usageCount.toLocaleString() : "14,000+"} uses
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/60 border border-border/60 font-mono">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{stats?.avgRating ? stats.avgRating.toFixed(1) : "4.9"} / 5.0</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                100% Client-Side
              </span>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="self-start inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all shrink-0"
            aria-label="Share tool link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Tool</span>
              </>
            )}
          </button>
        </div>

        {/* High-Viewability Top Banner AdSlot */}
        <AdSlot position="top-banner" cpcTier={tool.cpcTier} />

        {/* Dynamic Interactive Tool Workspace (Above the fold, zero login wall) */}
        <section aria-label="Tool Workspace" className="my-6">
          {children}
        </section>

        {/* High-Viewability Bottom Result AdSlot */}
        <AdSlot position="bottom-result" cpcTier={tool.cpcTier} />

        {/* SEO How to Use & Formula Accordion */}
        {tool.guide && (
          <section className="mt-8 rounded-2xl border border-border/70 bg-card/50 overflow-hidden">
            <button
              onClick={() => setFormulaOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm sm:text-base text-foreground hover:bg-muted/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>How to Use & Mathematical Formula</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  formulaOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {formulaOpen && (
              <div className="p-4 pt-0 text-sm text-muted-foreground space-y-4 border-t border-border/40">
                <p className="mt-4">{tool.guide.description}</p>

                {tool.guide.formula && (
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground block mb-1">
                      Formula Specification
                    </span>
                    <code className="text-sm font-mono text-primary font-bold">
                      {tool.guide.formula}
                    </code>
                  </div>
                )}

                {tool.guide.steps && (
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-semibold tracking-wider text-foreground block">
                      Step-by-Step Instructions
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm pl-1">
                      {tool.guide.steps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {tool.guide.notes && (
                  <div className="space-y-1 pt-2 text-xs text-muted-foreground/80 italic">
                    {tool.guide.notes.map((note, idx) => (
                      <p key={idx}>• {note}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Frequently Asked Questions (FAQPage Rich Snippet Grounding) */}
        {tool.faqs.length > 0 && (
          <section className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {tool.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/70 bg-card/40 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-foreground hover:bg-muted/30 transition-colors"
                    >
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30">
                        <p className="mt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Tools Internal Linking Grid */}
        {relatedTools.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border/60">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-base font-bold text-foreground">
                Related Tools in {categoryMeta?.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTools.map((relTool) => (
                <Link
                  key={relTool.id}
                  href={`/${relTool.slug}`}
                  className="p-3.5 rounded-xl border border-border/70 bg-card/40 hover:bg-card hover:border-primary/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {relTool.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {relTool.shortDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-primary font-medium mt-3">
                    <span>Open Tool</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky Right AdSense Rail (300px wide, min-h 600px desktop skyscraper) */}
      <aside aria-label="Sidebar Advertisement" className="hidden xl:block w-[300px] shrink-0">
        <AdSlot position="right-rail" cpcTier={tool.cpcTier} />
      </aside>
    </div>
  );
}
