import { NextResponse } from "next/server";
import { REP_COOKIE_NAME } from "@/lib/rep-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(REP_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
