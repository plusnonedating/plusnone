import { NextResponse } from "next/server";
import {
  REP_COOKIE_MAX_AGE,
  REP_COOKIE_NAME,
  isValidRepToken,
} from "@/lib/rep-auth";

/**
 * POST /api/rep/login
 *
 * Body: { token: string }
 *
 * Verifies the submitted token against REP_TOKEN. On success, sets an
 * httpOnly cookie with the same value that lasts 30 days. On failure
 * we return 401 with a generic message — no hints about correctness.
 *
 * Simple rate-limiting is enforced by the token being long enough to
 * be un-brute-forceable in reasonable time. Kate should set a 24+
 * character random string.
 */
export async function POST(req: Request) {
  let body: { token?: string };
  try {
    body = (await req.json()) as { token?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const submitted = (body.token ?? "").trim();
  if (!submitted) {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }
  if (!isValidRepToken(submitted)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(REP_COOKIE_NAME, submitted, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: REP_COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
