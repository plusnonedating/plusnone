import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Rep-portal authentication.
 *
 * Sydney (and any future sales rep) logs in via /rep/login with a
 * shared password (`REP_TOKEN` env var). We set an httpOnly cookie
 * with the same value on success, and check it on every /rep page.
 *
 * Not per-user auth — everyone with the token gets in. Fine for now
 * (Sydney is the only rep). If Kate hires more reps we'll swap for
 * magic-link auth with a Rep table in Airtable.
 */

const REP_COOKIE = "rep_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function repTokenFromEnv(): string | null {
  const t = process.env.REP_TOKEN;
  return t && t.length > 0 ? t : null;
}

/**
 * Compare a submitted password to the configured REP_TOKEN. Constant-
 * time comparison isn't strictly required here (short tokens, low
 * value, rate limited by the login route), but we do it anyway.
 */
export function isValidRepToken(submitted: string): boolean {
  const expected = repTokenFromEnv();
  if (!expected) return false;
  if (submitted.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ submitted.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Reads the rep session cookie and confirms it matches REP_TOKEN.
 * Returns true if the request is authenticated as a rep.
 */
export async function isAuthenticatedRep(): Promise<boolean> {
  const jar = await cookies();
  const cookie = jar.get(REP_COOKIE)?.value;
  if (!cookie) return false;
  return isValidRepToken(cookie);
}

/**
 * Server-component guard. Call at the top of any /rep page: if the
 * viewer isn't authenticated, they're bounced to /rep/login.
 */
export async function requireRep(): Promise<void> {
  const ok = await isAuthenticatedRep();
  if (!ok) {
    redirect("/rep/login");
  }
}

export const REP_COOKIE_NAME = REP_COOKIE;
export const REP_COOKIE_MAX_AGE = COOKIE_MAX_AGE_SECONDS;
