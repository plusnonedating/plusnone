const SLUG_PREFIX = "plusnone_submitted_";
const LEGACY_KEY = "plusnone_submitted";
const JUST_SUBMITTED_KEY = "plusnone_just_submitted";
const SLUG_TTL_MS = 24 * 60 * 60 * 1000;
const JUST_SUBMITTED_TTL_MS = 5 * 60 * 1000;

function keyFor(slug: string): string {
  return `${SLUG_PREFIX}${slug}`;
}

/**
 * True if the visitor has submitted at `slug` within the last 24h — the
 * /scan client uses this to decide whether to show the full feed or a
 * blurred preview gating on submission. Keyed by string so the new
 * Airtable-driven dynamic slugs (tsd, fno, sr, …) work without code
 * changes; the type used to be `Slug` (hardcoded union) before the
 * /scan refactor.
 */
export function isUnlocked(slug: string): boolean {
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

export function unlock(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      keyFor(slug),
      String(Date.now() + SLUG_TTL_MS),
    );
    // Sweep legacy single-flag key from before venue scoping.
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Safari private mode, etc.
  }
}

export function lock(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(keyFor(slug));
  } catch {
    // ignored
  }
}

/**
 * Marks the device as having just submitted, with a short 5-minute TTL.
 *
 * Used for the post-WPForm handoff: the form's thank-you URL hits `/`
 * with `?from=submission`, which sets this flag and redirects the
 * visitor to `/scan`. /scan reads the flag, treats whatever venue the
 * fresh geo check matches as unlocked, and promotes the just-submitted
 * flag into a per-slug `unlock()` so the 24h cache kicks in.
 *
 * Slug-agnostic on purpose — the form doesn't reliably know the slug
 * post-submission for Airtable-driven venues, and the geo check on
 * /scan resolves the venue more reliably than any URL param could.
 */
export function markJustSubmitted(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      JUST_SUBMITTED_KEY,
      String(Date.now() + JUST_SUBMITTED_TTL_MS),
    );
  } catch {
    // ignored
  }
}

export function wasJustSubmitted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(JUST_SUBMITTED_KEY);
    if (!raw) return false;
    const expiresAt = Number(raw);
    return Number.isFinite(expiresAt) && Date.now() < expiresAt;
  } catch {
    return false;
  }
}

export function clearJustSubmitted(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(JUST_SUBMITTED_KEY);
  } catch {
    // ignored
  }
}
