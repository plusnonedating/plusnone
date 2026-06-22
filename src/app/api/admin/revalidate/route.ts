import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * POST /api/admin/revalidate
 *
 * Manually bust the partners + submissions caches. Used when you edit
 * a venue in Airtable and don't want to wait up to 24h (partners) /
 * 5min (submissions) for the next scheduled revalidation to pick up
 * your change.
 *
 * Auth: same shared ADMIN_TOKEN env var as the /[slug]?admin=… flow.
 * Pass either as `?token=<value>` query string or as a JSON body
 * `{ "token": "<value>" }`.
 *
 * Body:
 *   {
 *     "tag": "partners" | "submissions" | "all"   // optional, default "all"
 *   }
 *
 * 200 → { ok: true, revalidated: [...] }
 * 401 → { error: "unauthorized" }
 * 500 → { error: <server config issue> }
 */
export async function POST(req: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || expected.length === 0) {
    return NextResponse.json(
      { error: "ADMIN_TOKEN not set on the server." },
      { status: 500 },
    );
  }

  // Accept token via ?token=… OR JSON body so it's easy to invoke
  // from either the URL bar or a curl one-liner.
  const url = new URL(req.url);
  const queryToken = url.searchParams.get("token");
  let bodyToken: string | undefined;
  let tagInput: string | undefined;
  try {
    const body = (await req.json().catch(() => null)) as {
      token?: string;
      tag?: string;
    } | null;
    if (body) {
      bodyToken = body.token;
      tagInput = body.tag;
    }
  } catch {
    // Body is optional; non-JSON bodies are fine.
  }
  const provided = queryToken ?? bodyToken;
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Choose which tags to bust. Default to both.
  const tag = (tagInput ?? "all").toLowerCase();
  const revalidated: string[] = [];
  // Next 16's revalidateTag requires a profile arg; "default" maps to
  // the standard cache lifetime so the next read pulls fresh.
  if (tag === "partners" || tag === "all") {
    revalidateTag("partners", "default");
    revalidated.push("partners");
  }
  if (tag === "submissions" || tag === "all") {
    revalidateTag("submissions", "default");
    revalidated.push("submissions");
  }
  if (revalidated.length === 0) {
    return NextResponse.json(
      { error: `Unknown tag "${tag}". Use partners | submissions | all.` },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, revalidated });
}
