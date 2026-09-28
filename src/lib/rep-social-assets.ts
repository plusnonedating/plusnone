import { getBase, SUBMISSIONS_TABLE } from "./airtable";

/**
 * Feeds the rep-facing social-assets tab: dater submissions where the
 * submitter checked "OK to Post" on the WPForms consent step (Bonus
 * checkbox → Airtable field). ONLY these rows are showable — every
 * other row is off-limits by contract (§9.10) regardless of what
 * fields the row has populated.
 *
 * We do NOT filter by "Posted to IG"/"Posted to TikTok" — Sydney needs
 * to see both what's already up (for context/scheduling) and what's
 * queued.
 */

export interface SocialAsset {
  id: string;
  firstName: string;
  handle: string;
  age: number | null;
  gender: string;
  interestedIn: string;
  lookingFor: string;
  iceBreaker: string;
  photoUrl: string;
  venue: string;
  submittedAt: string | null;
  postedToIg: boolean;
  igPostUrl: string;
  igPostDate: string;
  postedToTiktok: boolean;
  tiktokPostUrl: string;
  tiktokPostDate: string;
  usedInEpisode: boolean;
  episodeNumber: string;
  captionUsed: string;
  status: string;
}

function s(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}
function firstName(full: unknown): string {
  const t = s(full);
  return t.split(/\s+/)[0] ?? "";
}
function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Fetches every opted-in dater submission. Returns them sorted by
 * most-recent first, with the un-posted rows bubbled to the top so
 * Sydney sees fresh options before the archive.
 */
export async function fetchSocialAssets(): Promise<SocialAsset[]> {
  const base = getBase();
  const rows = await base(SUBMISSIONS_TABLE)
    .select({
      filterByFormula: `{OK to Post} = TRUE()`,
      pageSize: 100,
    })
    .all()
    .catch(() => []);

  const assets: SocialAsset[] = [];
  for (const row of rows) {
    const photoUrl = s(row.get("Photo URL"));
    if (!photoUrl) continue; // no image = nothing to post
    // Read Venue as a singleSelect — Airtable returns either
    // { name, id, color } or a plain string in the SDK depending on
    // version, so tolerate both.
    const venueRaw = row.get("Venue");
    const venue =
      venueRaw && typeof venueRaw === "object" && "name" in venueRaw
        ? s((venueRaw as { name: unknown }).name)
        : s(venueRaw);

    assets.push({
      id: row.id,
      firstName: firstName(row.get("Submitter Name")),
      handle: s(row.get("Handle")),
      age: num(row.get("Age")),
      gender: s(row.get("Gender")),
      interestedIn: s(row.get("Interested In")),
      lookingFor: s(row.get("Looking For")),
      iceBreaker: s(row.get("Ice Breaker")),
      photoUrl,
      venue,
      submittedAt: s(row.get("Submitted At")) || null,
      postedToIg: Boolean(row.get("Posted to IG")),
      igPostUrl: s(row.get("IG Post URL")),
      igPostDate: s(row.get("IG Post Date")),
      postedToTiktok: Boolean(row.get("Posted to TikTok")),
      tiktokPostUrl: s(row.get("TikTok Post URL")),
      tiktokPostDate: s(row.get("TikTok Post Date")),
      usedInEpisode: Boolean(row.get("Used in Episode")),
      episodeNumber: s(row.get("Episode #")),
      captionUsed: s(row.get("Caption Used")),
      status: s(row.get("Status")),
    });
  }

  // Un-posted first, then newest submitted first. If Sydney wants a
  // different order later (e.g. by venue), add tabs/filters in the UI
  // rather than baking it in here.
  assets.sort((a, b) => {
    const aPosted = a.postedToIg && a.postedToTiktok;
    const bPosted = b.postedToIg && b.postedToTiktok;
    if (aPosted !== bPosted) return aPosted ? 1 : -1;
    const aT = a.submittedAt ? Date.parse(a.submittedAt) : 0;
    const bT = b.submittedAt ? Date.parse(b.submittedAt) : 0;
    return bT - aT;
  });

  return assets;
}
