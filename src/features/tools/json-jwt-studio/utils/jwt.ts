export interface JwtClaims {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: number | string;
  [key: string]: any;
}

export interface JwtHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: any;
}

export interface ParsedJwtResult {
  validFormat: boolean;
  rawHeader: string;
  rawPayload: string;
  rawSignature: string;
  header: JwtHeader | null;
  payload: JwtClaims | null;
  error?: string;
}

export interface JwtExpirationStatus {
  status: "active" | "expired" | "not_yet_valid" | "no_exp";
  message: string;
  label: string;
  badgeVariant: "success" | "danger" | "warning" | "neutral";
  remainingSeconds?: number;
  elapsedSeconds?: number;
}

export function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function parseJwt(token: string): ParsedJwtResult {
  const cleanToken = token.trim();
  if (!cleanToken) {
    return {
      validFormat: false,
      rawHeader: "",
      rawPayload: "",
      rawSignature: "",
      header: null,
      payload: null,
      error: "Enter or paste a JSON Web Token (JWT) to inspect.",
    };
  }

  const parts = cleanToken.split(".");
  if (parts.length !== 3) {
    return {
      validFormat: false,
      rawHeader: parts[0] || "",
      rawPayload: parts[1] || "",
      rawSignature: parts[2] || "",
      header: null,
      payload: null,
      error: `Invalid JWT format. Expected 3 base64url segments separated by dots (found ${parts.length}).`,
    };
  }

  let header: JwtHeader | null = null;
  let payload: JwtClaims | null = null;

  try {
    const decodedHeader = base64UrlDecode(parts[0]);
    header = JSON.parse(decodedHeader);
  } catch (err: any) {
    return {
      validFormat: false,
      rawHeader: parts[0],
      rawPayload: parts[1],
      rawSignature: parts[2],
      header: null,
      payload: null,
      error: `Failed to decode JWT Header: ${err.message}`,
    };
  }

  try {
    const decodedPayload = base64UrlDecode(parts[1]);
    payload = JSON.parse(decodedPayload);
  } catch (err: any) {
    return {
      validFormat: false,
      rawHeader: parts[0],
      rawPayload: parts[1],
      rawSignature: parts[2],
      header,
      payload: null,
      error: `Failed to decode JWT Payload: ${err.message}`,
    };
  }

  return {
    validFormat: true,
    rawHeader: parts[0],
    rawPayload: parts[1],
    rawSignature: parts[2],
    header,
    payload,
  };
}

export function evaluateJwtExpiration(
  claims: JwtClaims | null,
  nowEpochSec: number = Math.floor(Date.now() / 1000)
): JwtExpirationStatus {
  if (!claims) {
    return {
      status: "no_exp",
      message: "No claims available",
      label: "No Claims",
      badgeVariant: "neutral",
    };
  }

  const { exp, nbf } = claims;

  // Check nbf (Not Before)
  if (typeof nbf === "number" && nowEpochSec < nbf) {
    const diff = nbf - nowEpochSec;
    return {
      status: "not_yet_valid",
      message: `Token not valid yet (starts in ${formatDuration(diff)})`,
      label: `Not Valid Yet (in ${formatDuration(diff)})`,
      badgeVariant: "warning",
      remainingSeconds: diff,
    };
  }

  // Check exp (Expiration)
  if (typeof exp === "number") {
    if (nowEpochSec > exp) {
      const elapsed = nowEpochSec - exp;
      return {
        status: "expired",
        message: `Token expired ${formatDuration(elapsed)} ago`,
        label: `Expired (${formatDuration(elapsed)} ago)`,
        badgeVariant: "danger",
        elapsedSeconds: elapsed,
      };
    } else {
      const remaining = exp - nowEpochSec;
      return {
        status: "active",
        message: `Token is active! Expires in ${formatDuration(remaining)}`,
        label: `Active (Expires in ${formatDuration(remaining)})`,
        badgeVariant: "success",
        remainingSeconds: remaining,
      };
    }
  }

  return {
    status: "no_exp",
    message: "Token has no exp (expiration) claim. Valid indefinitely.",
    label: "No Expiration (Lifetime Token)",
    badgeVariant: "neutral",
  };
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function formatTimestamp(epochSec?: number): {
  raw: string;
  utc: string;
  local: string;
} {
  if (epochSec === undefined || epochSec === null) {
    return { raw: "N/A", utc: "N/A", local: "N/A" };
  }
  const date = new Date(epochSec * 1000);
  return {
    raw: String(epochSec),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
  };
}

export async function verifyHs256Signature(
  rawHeader: string,
  rawPayload: string,
  rawSignature: string,
  secret: string
): Promise<{ verified: boolean; message: string }> {
  if (!secret) {
    return { verified: false, message: "Enter secret key to verify HMAC-SHA256 signature." };
  }

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign", "verify"]
    );

    const dataToVerify = encoder.encode(`${rawHeader}.${rawPayload}`);

    // Decode signature from base64url into Uint8Array
    let b64 = rawSignature.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) b64 += "=";
    const binary = atob(b64);
    const sigBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      sigBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await window.crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      sigBytes,
      dataToVerify
    );

    if (isValid) {
      return { verified: true, message: "Signature Verified successfully! Secret matches." };
    } else {
      return { verified: false, message: "Signature verification failed: Invalid secret key." };
    }
  } catch (err: any) {
    return { verified: false, message: `Verification error: ${err.message}` };
  }
}

// Generate dynamic sample tokens with active / expired timestamps
export function generateSampleJwt(type: "active" | "expired" | "no_exp"): string {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  let payload: JwtClaims = {
    iss: "https://auth.replaner.in",
    sub: "usr_8829104",
    aud: "https://api.replaner.in/v1",
    email: "developer@replaner.in",
    name: "Alex Morgan",
    roles: ["admin", "developer"],
    iat: now - 3600, // issued 1 hour ago
  };

  if (type === "active") {
    payload.exp = now + 7200; // expires in 2 hours
    payload.nbf = now - 3600;
  } else if (type === "expired") {
    payload.iat = now - 86400; // issued 1 day ago
    payload.exp = now - 3600; // expired 1 hour ago
  }

  const hB64 = base64UrlEncode(JSON.stringify(header));
  const pB64 = base64UrlEncode(JSON.stringify(payload));
  // A realistic dummy signature for display
  const dummySig = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

  return `${hB64}.${pB64}.${dummySig}`;
}
