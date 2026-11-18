import { Currency } from "./types";

/**
 * Formats a number with currency symbol and appropriate locale comma separation.
 */
export function formatCurrency(
  value: number,
  currency: Currency,
  includeDecimals = false
): string {
  if (isNaN(value) || !isFinite(value)) return currency === "INR" ? "₹0" : "$0";
  const absVal = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (currency === "INR") {
    const formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: includeDecimals ? 2 : 0,
      minimumFractionDigits: includeDecimals ? 2 : 0,
    }).format(absVal);
    return `${sign}${formatted}`;
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0,
  }).format(absVal);
  return `${sign}${formatted}`;
}

/**
 * Formats a number compactly (e.g. ₹1.25 Cr, ₹50 Lakh, $1.5M, $250k).
 */
export function formatCompact(value: number, currency: Currency): string {
  if (isNaN(value) || !isFinite(value)) return currency === "INR" ? "₹0" : "$0";
  const absVal = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (currency === "INR") {
    if (absVal >= 10000000) {
      const cr = absVal / 10000000;
      return `${sign}₹${cr >= 100 ? cr.toFixed(1) : cr.toFixed(2)} Cr`;
    }
    if (absVal >= 100000) {
      const lk = absVal / 100000;
      return `${sign}₹${lk >= 100 ? lk.toFixed(1) : lk.toFixed(2)} Lakh`;
    }
    if (absVal >= 1000) {
      const k = absVal / 1000;
      return `${sign}₹${k.toFixed(1)}k`;
    }
    return `${sign}₹${Math.round(absVal)}`;
  }

  // USD compact format
  if (absVal >= 1000000000) {
    const b = absVal / 1000000000;
    return `${sign}$${b.toFixed(2)}B`;
  }
  if (absVal >= 1000000) {
    const m = absVal / 1000000;
    return `${sign}$${m.toFixed(2)}M`;
  }
  if (absVal >= 1000) {
    const k = absVal / 1000;
    return `${sign}$${k.toFixed(1)}k`;
  }
  return `${sign}$${Math.round(absVal)}`;
}

/**
 * Formats a percentage nicely (e.g. 12% or 12.5%).
 */
export function formatPercent(value: number): string {
  if (isNaN(value)) return "0%";
  return `${Number(value.toFixed(2))}%`;
}
