"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

export type AdPosition = "top-banner" | "bottom-result" | "right-rail";

interface AdSlotProps {
  position: AdPosition;
  slotId?: string;
  cpcTier?: "high" | "volume";
  className?: string;
}

export function AdSlot({ position, slotId, cpcTier = "volume", className }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1128782780487258";
  const isDev = process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_ADSENSE_ENABLE_DEV;

  // Resolve custom or environment-specified numeric slot ID
  const adSlotId =
    slotId ||
    (position === "right-rail"
      ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT_RAIL
      : position === "top-banner"
      ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER
      : process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM);

  // Exact dimension reservations to guarantee CLS = 0
  const slotConfigs = {
    "top-banner": {
      dimensions: "728 × 90",
      format: "horizontal",
      containerClass: "w-full max-w-[728px] min-h-[90px] mx-auto",
      rpmTierLabel: cpcTier === "high" ? "High RPM ($35 - $75)" : "Volume RPM ($8 - $18)",
    },
    "bottom-result": {
      dimensions: "728 × 90",
      format: "horizontal",
      containerClass: "w-full max-w-[728px] min-h-[90px] mx-auto",
      rpmTierLabel: cpcTier === "high" ? "High RPM ($35 - $75)" : "Volume RPM ($8 - $18)",
    },
    "right-rail": {
      dimensions: "300 × 600",
      format: "vertical",
      containerClass: "w-[300px] min-h-[600px] shrink-0 sticky top-24",
      rpmTierLabel: cpcTier === "high" ? "High Skyscraper RPM ($45 - $90)" : "Standard Skyscraper ($12 - $25)",
    },
  };

  const config = slotConfigs[position];

  useEffect(() => {
    if (!isDev) {
      try {
        // Push ad to AdSense window queue safely
        ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense push failed:", e);
      }
    }
  }, [isDev]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-xl my-4",
        config.containerClass,
        className
      )}
      style={{
        // Strict inline CSS min-height guarantees zero layout shift before styles mount
        minHeight: position === "right-rail" ? "600px" : "90px",
      }}
    >
      {/* Micro-label for Google AdSense policy compliance */}
      <div className="absolute top-1 right-2 text-[9px] tracking-wider uppercase font-semibold text-muted-foreground/60 select-none z-10">
        ADVERTISEMENT
      </div>

      {isDev ? (
        // High-trust developer-grade wireframe blueprint in development mode
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center border border-dashed border-primary/30 bg-primary/5 rounded-xl transition-all">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AdSlot: {position} ({config.dimensions})
          </div>
          <p className="text-xs font-medium text-foreground/80">
            CLS Protected (CLS = 0)
          </p>
          <span className="text-[11px] text-muted-foreground mt-0.5 font-mono">
            Tier: {config.rpmTierLabel}
          </span>
        </div>
      ) : (
        // Production Google AdSense Ins Tag
        <div className="w-full h-full flex items-center justify-center bg-card/40 border border-border/40 rounded-xl">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={clientId}
            {...(adSlotId ? { "data-ad-slot": adSlotId } : {})}
            data-ad-format={config.format}
            data-full-width-responsive="true"
          />
        </div>
      )}
    </div>
  );
}
