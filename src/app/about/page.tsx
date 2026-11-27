import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Zap, Lock, Cpu, Globe, ArrowLeft, ArrowRight } from "lucide-react";
import { TOOLS_REGISTRY } from "@/config/tools-registry";

export const metadata: Metadata = {
  title: "About Us | EveryDayToolz",
  description:
    "Learn about EveryDayToolz: deterministic, high-speed, 100% private online utilities designed with WebAssembly and local-first browser execution.",
  alternates: {
    canonical: "https://replaner.in/about",
  },
  openGraph: {
    title: "About Us | EveryDayToolz",
    description:
      "Learn about EveryDayToolz: deterministic, high-speed, 100% private online utilities designed with WebAssembly and local-first browser execution.",
    url: "https://replaner.in/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 sm:py-10">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Tools</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/30 text-xs font-semibold">
          <Wrench className="w-3.5 h-3.5" />
          <span>Our Mission & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          About EveryDayToolz
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          We build deterministic, client-side web utilities that eliminate cloud latency, abolish paywalls,
          and guarantee 100% data privacy through in-browser computation.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-card/60 border border-border/70 space-y-2">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Zero Latency & No Servers</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Rather than sending your data across the world to a remote server, our utilities run on your computer&apos;s
            own CPU and GPU. Calculations complete in microseconds without server round-trips.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card/60 border border-border/70 space-y-2">
          <div className="p-2.5 rounded-xl bg-brand-cyan/10 text-brand-cyan w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Absolute Device Privacy</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your confidential PDF files, security hashes, auth tokens, video recordings, and financial metrics never touch
            an external server. When you close the browser tab, memory is cleanly reclaimed.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card/60 border border-border/70 space-y-2">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Powered by WebAssembly & WASM</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We leverage native C/C++ libraries compiled directly into WebAssembly, including FFmpeg for local audio extraction
            and pdf-lib for in-memory document restructuring.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card/60 border border-border/70 space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">100% Free with No Login Required</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No signup forms, no subscriptions, no &ldquo;free tier&rdquo; bait-and-switch limitations, and zero email harvesting.
            Instant access to every single tool whenever you need it.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-8">
        <h2 className="text-xl font-bold text-foreground">Available Utilities</h2>
        <p>
          EveryDayToolz currently features {TOOLS_REGISTRY.length} specialized daily utilities across financial modeling,
          media transcoding, developer debugging, and productivity:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {TOOLS_REGISTRY.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="p-3.5 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {tool.shortDescription}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
