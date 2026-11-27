import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/config/tools-registry";
import { Wrench, ShieldCheck, Zap, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/70 bg-card/40 backdrop-blur-md mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Value Prop Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 pb-8 border-b border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Zero AI Cost & Latency</p>
              <p className="text-[11px] text-muted-foreground">Deterministic algorithms run in microseconds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
            <div className="p-2 rounded-lg bg-brand-cyan/10 text-brand-cyan">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">100% Browser Privacy</p>
              <p className="text-[11px] text-muted-foreground">Files & secrets never leave your device memory</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">100% Free • No Login Required</p>
              <p className="text-[11px] text-muted-foreground">Unlimited free access with zero signups or paywalls</p>
            </div>
          </div>
        </div>

        {/* Main Footer Directory */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand Col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">
                EveryDay<span className="text-primary font-black">Toolz</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed mb-4">
              High-accuracy, developer-grade online utilities. Built with Next.js 15, WebAssembly, and modern browser cryptographic standards.
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              © {new Date().getFullYear()} EveryDayToolz. All rights reserved.
            </p>
          </div>

          {/* Popular Utilities */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Popular Tools
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/tools/sip-calculator" className="hover:text-foreground transition-colors">
                  SIP Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-toolkit" className="hover:text-foreground transition-colors">
                  PDF Toolkit
                </Link>
              </li>
              <li>
                <Link href="/tools/video-to-audio" className="hover:text-foreground transition-colors">
                  Video to Audio
                </Link>
              </li>
              <li>
                <Link href="/tools/json-jwt-studio" className="hover:text-foreground transition-colors">
                  JSON & JWT Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Categories */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Categories
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {CATEGORIES.slice(0, 4).map((category) => (
                <li key={category.id}>
                  <Link href={`/?category=${category.id}`} className="hover:text-foreground transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Legal & Info
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
