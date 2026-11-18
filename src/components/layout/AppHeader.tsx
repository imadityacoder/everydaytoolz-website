"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { TOOLS_REGISTRY, CATEGORIES } from "@/config/tools-registry";
import { 
  Wrench, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight,
  ChevronDown,
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
  DollarSign,
  Video,
  Code,
  Shield
} from "lucide-react";

const TOOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
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

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  Video,
  Code,
  Sparkles,
  Shield,
};

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const openCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      })
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 transition-transform group-hover:rotate-12" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              RePlaner <span className="text-primary font-black">Tools</span>
            </span>
            <span className="text-[10px] text-muted-foreground/80 -mt-1 hidden sm:inline">
              100% Client-Side Micro-SaaS
            </span>
          </div>
        </Link>

        {/* Desktop Topbar Navigation with Category Dropdowns */}
        <nav 
          ref={dropdownRef} 
          className="hidden xl:flex items-center gap-1 relative"
          aria-label="Categories Navigation"
        >
          {CATEGORIES.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat.icon] || Sparkles;
            const toolsInCat = TOOLS_REGISTRY.filter((t) => t.category === cat.id);
            const isCategoryActive = toolsInCat.some((t) => pathname === `/${t.slug}`);
            const isOpen = activeDropdown === cat.id;

            return (
              <div 
                key={cat.id} 
                className="relative"
                onMouseEnter={() => setActiveDropdown(cat.id)}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(isOpen ? null : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isCategoryActive
                      ? "text-primary bg-primary/10 border border-primary/20 shadow-xs"
                      : isOpen
                      ? "text-foreground bg-muted/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                  aria-expanded={isOpen}
                >
                  <CatIcon className={`w-3.5 h-3.5 ${isCategoryActive ? "text-primary" : "text-muted-foreground/80"}`} />
                  <span>{cat.name.split(" ")[0]}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-foreground" : "text-muted-foreground/60"
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div 
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-1.5 w-80 bg-card/95 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150 space-y-1"
                  >
                    <div className="px-2.5 py-1.5 border-b border-border/50 mb-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {cat.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {cat.description}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      {toolsInCat.map((tool) => {
                        const ToolIcon = TOOL_ICONS[tool.iconName] || TrendingUp;
                        const isToolActive = pathname === `/${tool.slug}`;

                        return (
                          <Link
                            key={tool.id}
                            href={`/${tool.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-start gap-3 p-2 rounded-xl transition-all ${
                              isToolActive
                                ? "bg-primary/15 border border-primary/30 text-primary"
                                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                              isToolActive ? "bg-primary text-white" : "bg-muted/80 text-primary"
                            }`}>
                              <ToolIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-xs text-foreground truncate">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-medium rounded-full bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/30 shrink-0">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {tool.shortDescription}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Global Search Trigger (Cmd + K) */}
        <button
          onClick={openCommandPalette}
          className="hidden md:flex items-center justify-between w-64 lg:w-72 xl:w-80 px-3.5 py-1.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 hover:border-primary/40 text-muted-foreground text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Open Command Palette"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground/80" />
            <span className="text-xs text-muted-foreground">Search all 10 tools...</span>
          </span>
          <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-card/80 border border-border/80 rounded text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={openCommandPalette}
            className="md:hidden p-2 rounded-lg border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            All Tools
          </Link>

          <ThemeToggle />

          {/* Mobile Drawer Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-2 rounded-lg border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-border/80 bg-background/95 backdrop-blur-2xl px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
              Tool Categories
            </div>

            {CATEGORIES.map((cat) => {
              const toolsInCat = TOOLS_REGISTRY.filter((t) => t.category === cat.id);
              const CatIcon = CATEGORY_ICONS[cat.icon] || Sparkles;

              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/80 px-2 py-1">
                    <CatIcon className="w-3.5 h-3.5 text-primary" />
                    <span>{cat.name}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {toolsInCat.map((tool) => {
                      const Icon = TOOL_ICONS[tool.iconName] || TrendingUp;
                      const isActive = pathname === `/${tool.slug}`;

                      return (
                        <Link
                          key={tool.id}
                          href={`/${tool.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-sm transition-all ${
                            isActive
                              ? "bg-primary/15 text-primary font-medium border border-primary/30"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className="w-4 h-4 shrink-0 text-primary" />
                            <span className="truncate">{tool.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-40 shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
