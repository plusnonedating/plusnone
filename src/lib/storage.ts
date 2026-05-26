import type { Slug } from "./venues";

const PREFIX = "plusnone_submitted_";
const LEGACY_KEY = "plusnone_submitted";
const TTL_MS = 24 * 60 * 60 * 1000;

function keyFor(slug: Slug): string {
  return `${PREFIX}${slug}`;
}

export function isUnlocked(slug: Slug): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(keyFor(slug));
    if (!raw) return false;
    const expiresAt = Number(raw);
    return Number.isFinite(expiresAt) && Date.now() < expiresAt;
  } catch {
    return false;
  }
}

export function unlock(slug: Slug): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      keyFor(slug),
      String(Date.now() + TTL_MS),
    );
    // Sweep legacy single-flag key from before venue scoping.
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Safari private mode, etc.
  }
}

export function lock(slug: Slug): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(keyFor(slug));
  } catch {
    // ignored
  }
}
