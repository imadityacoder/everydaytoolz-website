"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-lg border border-border/50 bg-card/50 ${className || ""}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 transition-all text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${
        className || ""
      }`}
      aria-label="Toggle visual theme"
      title={isDark ? "Switch to Paper Crisp Light" : "Switch to Cosmic Dark"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-brand-indigo transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
