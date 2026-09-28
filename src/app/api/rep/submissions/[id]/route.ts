import { NextResponse } from "next/server";
import type { FieldSet } from "airtable";
import { isAuthenticatedRep } from "@/lib/rep-auth";
import { getBase, SUBMISSIONS_TABLE } from "@/lib/airtable";

/**
 * PATCH /api/rep/submissions/[id]
 *
 * Rep-facing endpoint for marking a Submissions row as posted to
 * IG/TikTok from the /rep/social-assets tab. We only allow this on
 * rows where the submitter checked "OK to Post" — the safety check
 * for §9.10 lives here as well as in the reader, so a mis-crafted
 * PATCH can't sneak an un-consented row into "posted" status.
 *
 * Accepts a subset of writable fields; every other Airtable field on
 * the row is left alone.
 */
interface PatchBody {
  postedToIg?: boolean;
  postedToTiktok?: boolean;
  igPostUrl?: string;
  tiktokPostUrl?: string;
}

// YYYY-MM-DD for Airtable's date field, in the site's local TZ so a
// late-night post doesn't show up under tomorrow.
function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticatedRep())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { id } = await params;

  let body: PatchBody;
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const base = getBase();
  const row = await base(SUBMISSIONS_TABLE)
    .find(id)
    .catch(() => null);
  if (!row) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }
  const okToPost = Boolean((row.fields as Record<string, unknown>)["OK to Post"]);
  if (!okToPost) {
    // Defense in depth: reader already filters to OK to Post = TRUE,
    // but if someone crafts a request against a non-consented row we
    // refuse it.
    return NextResponse.json(
      { error: "This submission has not consented to being posted." },
      { status: 403 },
    );
  }

  const fields: Partial<FieldSet> = {};
  const today = todayIso();
  if (body.postedToIg === true) {
    fields["Posted to IG"] = true;
    fields["IG Post Date"] = today;
  }
  if (body.postedToTiktok === true) {
    fields["Posted to TikTok"] = true;
    fields["TikTok Post Date"] = today;
  }
  if (typeof body.igPostUrl === "string") {
    fields["IG Post URL"] = body.igPostUrl.trim();
  }
  if (typeof body.tiktokPostUrl === "string") {
    fields["TikTok Post URL"] = body.tiktokPostUrl.trim();
  }

  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    await base(SUBMISSIONS_TABLE).update(id, fields);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/rep/submissions/PATCH] failed:", msg);
    return NextResponse.json(
      { error: "Couldn't save. Try again in a moment." },
      { status: 500 },
    );
  }
}
