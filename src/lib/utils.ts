import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  num: number,
  options?: {
    currency?: "INR" | "USD";
    style?: "decimal" | "currency";
    maximumFractionDigits?: number;
  }
): string {
  const { currency, style = "decimal", maximumFractionDigits = 0 } = options || {};

  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style,
      currency: "INR",
      maximumFractionDigits,
    }).format(num);
  }

  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style,
      currency: "USD",
      maximumFractionDigits,
    }).format(num);
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(num);
}

export function formatInrIndianScale(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return formatNumber(amount, { currency: "INR", style: "currency" });
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
