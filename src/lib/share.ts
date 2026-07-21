import type { GameKey, GameStats } from "@/lib/storage";

export type SharedStats = Record<GameKey, GameStats>;

function base64UrlEncode(str: string): string {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  return decodeURIComponent(escape(atob(padded)));
}

export function encodeSharedStats(stats: SharedStats): string {
  return base64UrlEncode(JSON.stringify(stats));
}

export function decodeSharedStats(encoded: string): SharedStats | null {
  try {
    const parsed = JSON.parse(base64UrlDecode(encoded));
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as SharedStats;
  } catch {
    return null;
  }
}
