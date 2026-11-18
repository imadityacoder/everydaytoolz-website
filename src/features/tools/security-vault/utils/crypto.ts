import { md5Bytes, md5Hex, md5Base64 } from "./md5";

export interface PasswordConfig {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}

export const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?~",
};

export const AMBIGUOUS_CHARS = new Set(["O", "0", "o", "1", "l", "I", "|", "`", "'", '"', ";", ":"]);

/**
 * CSPRNG unbiased random integer in range [0, max - 1].
 * Uses rejection sampling to eliminate modulo bias.
 */
export function getCsprngRandomInt(max: number): number {
  if (max <= 1) return 0;
  // Maximum multiple of `max` that fits in a Uint32
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % max);
  const buffer = new Uint32Array(1);

  while (true) {
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(buffer);
    } else {
      // Fallback for non-browser/SSR environments
      buffer[0] = Math.floor(Math.random() * maxUint32);
    }

    if (buffer[0] < limit) {
      return buffer[0] % max;
    }
  }
}

/**
 * Filter ambiguous characters from a string
 */
function sanitizeCharset(charset: string, avoidAmbiguous: boolean): string {
  if (!avoidAmbiguous) return charset;
  return charset
    .split("")
    .filter((char) => !AMBIGUOUS_CHARS.has(char))
    .join("");
}

/**
 * Cryptographic Fisher-Yates shuffle using CSPRNG
 */
export function csprngShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getCsprngRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Generate a cryptographically secure random password using window.crypto.getRandomValues()
 */
export function generateCsprngPassword(config: PasswordConfig): {
  password: string;
  poolSize: number;
  entropyBits: number;
} {
  const { length, uppercase, lowercase, digits, symbols, avoidAmbiguous } = config;

  const activeSets: string[] = [];
  if (uppercase) activeSets.push(sanitizeCharset(CHARSETS.uppercase, avoidAmbiguous));
  if (lowercase) activeSets.push(sanitizeCharset(CHARSETS.lowercase, avoidAmbiguous));
  if (digits) activeSets.push(sanitizeCharset(CHARSETS.digits, avoidAmbiguous));
  if (symbols) activeSets.push(sanitizeCharset(CHARSETS.symbols, avoidAmbiguous));

  // Fallback if user deselects all charsets
  if (activeSets.length === 0) {
    activeSets.push(sanitizeCharset(CHARSETS.lowercase, avoidAmbiguous));
  }

  // Combined character pool
  const pool = activeSets.join("");
  const poolSize = pool.length;

  // Guarantee at least 1 character from each chosen charset
  const chosenChars: string[] = [];
  for (const set of activeSets) {
    if (set.length > 0) {
      const idx = getCsprngRandomInt(set.length);
      chosenChars.push(set[idx]);
    }
  }

  // Fill remaining slots from the full pool
  const remainingCount = Math.max(0, length - chosenChars.length);
  for (let i = 0; i < remainingCount; i++) {
    const idx = getCsprngRandomInt(poolSize);
    chosenChars.push(pool[idx]);
  }

  // Trim if length was less than active sets count (e.g. length 2 with 4 sets)
  const sliced = chosenChars.slice(0, length);

  // Unbiased shuffle so guaranteed characters aren't stuck at the front
  const shuffled = csprngShuffle(sliced);
  const password = shuffled.join("");

  const entropyBits = calculateEntropy(length, poolSize);

  return { password, poolSize, entropyBits };
}

/**
 * Bulk generate passwords
 */
export function generateBulkPasswords(
  config: PasswordConfig,
  count: number
): { password: string; entropyBits: number }[] {
  const safeCount = Math.min(100, Math.max(1, count));
  const results = [];
  for (let i = 0; i < safeCount; i++) {
    const { password, entropyBits } = generateCsprngPassword(config);
    results.push({ password, entropyBits });
  }
  return results;
}

/**
 * Shannon Entropy calculation: H = L * log2(R)
 */
export function calculateEntropy(length: number, poolSize: number): number {
  if (length <= 0 || poolSize <= 1) return 0;
  const entropy = length * Math.log2(poolSize);
  return Math.round(entropy * 10) / 10;
}

export interface EntropyRating {
  score: number; // 0-100
  label: string;
  colorClass: string;
  bgClass: string;
  barColor: string;
}

export function getEntropyRating(bits: number): EntropyRating {
  if (bits < 36) {
    return {
      score: 15,
      label: "Very Weak",
      colorClass: "text-destructive",
      bgClass: "bg-destructive/15 border-destructive/30",
      barColor: "bg-destructive",
    };
  }
  if (bits < 56) {
    return {
      score: 35,
      label: "Weak",
      colorClass: "text-amber-500",
      bgClass: "bg-amber-500/15 border-amber-500/30",
      barColor: "bg-amber-500",
    };
  }
  if (bits < 75) {
    return {
      score: 65,
      label: "Moderate",
      colorClass: "text-yellow-500",
      bgClass: "bg-yellow-500/15 border-yellow-500/30",
      barColor: "bg-yellow-500",
    };
  }
  if (bits < 100) {
    return {
      score: 85,
      label: "Strong",
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-500/15 border-emerald-500/30",
      barColor: "bg-emerald-500",
    };
  }
  return {
    score: 100,
    label: "Cryptographically Hardened",
    colorClass: "text-purple-500 dark:text-purple-400",
    bgClass: "bg-purple-500/15 border-purple-500/30",
    barColor: "bg-purple-500",
  };
}

export interface CrackTimeScenario {
  name: string;
  rateLabel: string;
  description: string;
  timeString: string;
  isInstant: boolean;
}

/**
 * Calculate brute-force crack time estimates across 4 attack speed tiers
 */
export function estimateCrackTimes(bits: number): CrackTimeScenario[] {
  // Total combinations N = 2^bits. Average guesses to find key = 2^(bits - 1)
  // We compute log10(seconds) to avoid float overflow for huge bit sizes
  // log10(seconds) = (bits - 1) * log10(2) - log10(rate)

  const LOG10_2 = Math.log10(2);

  function computeTimeStr(rate: number): { timeString: string; isInstant: boolean } {
    const log10Rate = Math.log10(rate);
    const log10Sec = (bits - 1) * LOG10_2 - log10Rate;

    if (log10Sec < 0) {
      return { timeString: "Instant (< 1 second)", isInstant: true };
    }

    const sec = Math.pow(10, Math.min(log10Sec, 15)); // Clamp for direct numbers

    if (log10Sec < 1.77) {
      // < 60 seconds
      return { timeString: `${Math.max(1, Math.round(sec))} seconds`, isInstant: false };
    }

    const min = sec / 60;
    if (log10Sec < 3.55) {
      // < 60 minutes
      return { timeString: `${Math.round(min)} minutes`, isInstant: false };
    }

    const hours = min / 60;
    if (log10Sec < 4.93) {
      // < 24 hours
      return { timeString: `${Math.round(hours)} hours`, isInstant: false };
    }

    const days = hours / 24;
    if (log10Sec < 7.5) {
      // < 365 days
      return { timeString: `${Math.round(days)} days`, isInstant: false };
    }

    // Years
    const yearsLog10 = log10Sec - Math.log10(365.25 * 86400);

    if (yearsLog10 < 3) {
      return { timeString: `${Math.round(Math.pow(10, yearsLog10))} years`, isInstant: false };
    }
    if (yearsLog10 < 6) {
      return {
        timeString: `${Math.round(Math.pow(10, yearsLog10)).toLocaleString()} years`,
        isInstant: false,
      };
    }
    if (yearsLog10 < 9) {
      return {
        timeString: `${(Math.pow(10, yearsLog10) / 1e6).toFixed(1)} million years`,
        isInstant: false,
      };
    }
    if (yearsLog10 < 12) {
      return {
        timeString: `${(Math.pow(10, yearsLog10) / 1e9).toFixed(1)} billion years`,
        isInstant: false,
      };
    }
    if (yearsLog10 < 15) {
      return {
        timeString: `${(Math.pow(10, yearsLog10) / 1e12).toFixed(1)} trillion years`,
        isInstant: false,
      };
    }

    return {
      timeString: `10^${Math.round(yearsLog10)} years (Outlasts Universe)`,
      isInstant: false,
    };
  }

  const scenarios = [
    {
      name: "Online Web Form (Rate Limited)",
      rateLabel: "100 guesses / sec",
      description: "Throttled API / Captcha login attempt rate",
      ...computeTimeStr(100),
    },
    {
      name: "Offline Slow Hash (bcrypt / PBKDF2)",
      rateLabel: "100,000 guesses / sec",
      description: "Modern salted & memory-hard password hashes",
      ...computeTimeStr(100_000),
    },
    {
      name: "Fast GPU Cluster (MD5 / NTLM / SHA)",
      rateLabel: "100 Billion guesses / sec",
      description: "Dedicated 8x RTX 4090 hash cracking rig",
      ...computeTimeStr(100_000_000_000),
    },
    {
      name: "Supercomputer / Nation-State",
      rateLabel: "100 Trillion guesses / sec",
      description: "Large distributed compute cluster",
      ...computeTimeStr(100_000_000_000_000),
    },
  ];

  return scenarios;
}

export interface ComputedHashResult {
  algorithm: string;
  bitLength: number;
  hex: string;
  hexUpper: string;
  base64: string;
}

/**
 * Compute all 5 cryptographic hashes (SHA-256, SHA-512, SHA-384, SHA-1, MD5)
 */
export async function computeAllHashes(text: string): Promise<ComputedHashResult[]> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Helper to convert buffer to hex and base64
  function bufferToFormats(buffer: ArrayBuffer | Uint8Array) {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let hex = "";
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, "0");
      binary += String.fromCharCode(bytes[i]);
    }
    return {
      hex,
      hexUpper: hex.toUpperCase(),
      base64: btoa(binary),
    };
  }

  // 1. SHA-256
  const sha256Buf = await window.crypto.subtle.digest("SHA-256", data);
  const sha256 = bufferToFormats(sha256Buf);

  // 2. SHA-512
  const sha512Buf = await window.crypto.subtle.digest("SHA-512", data);
  const sha512 = bufferToFormats(sha512Buf);

  // 3. SHA-384
  const sha384Buf = await window.crypto.subtle.digest("SHA-384", data);
  const sha384 = bufferToFormats(sha384Buf);

  // 4. SHA-1
  const sha1Buf = await window.crypto.subtle.digest("SHA-1", data);
  const sha1 = bufferToFormats(sha1Buf);

  // 5. MD5 (RFC 1321 pure TS)
  const md5BytesResult = md5Bytes(data);
  const md5 = bufferToFormats(md5BytesResult);

  return [
    {
      algorithm: "SHA-256",
      bitLength: 256,
      ...sha256,
    },
    {
      algorithm: "SHA-512",
      bitLength: 512,
      ...sha512,
    },
    {
      algorithm: "SHA-384",
      bitLength: 384,
      ...sha384,
    },
    {
      algorithm: "SHA-1",
      bitLength: 160,
      ...sha1,
    },
    {
      algorithm: "MD5",
      bitLength: 128,
      ...md5,
    },
  ];
}
