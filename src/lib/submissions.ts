import { unstable_cache } from "next/cache";
import { getBase, SUBMISSIONS_TABLE } from "./airtable";
import type { Submission } from "./types";

function escapeFormulaString(value: string): string {
  return value.replace(/'/g, "\\'");
}

function freshFormula(venueLabel: string): string {
  const escaped = escapeFormulaString(venueLabel);
  return `AND(NOT({Consent Acknowledged} = BLANK()), {Venue} = '${escaped}', DATETIME_DIFF(NOW(), CREATED_TIME(), 'hours') < 6)`;
}

function firstNameOf(full: unknown): string {
  if (typeof full !== "string") return "";
  return full.trim().split(/\s+/)[0] ?? "";
}

function asTrimmed(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

async function fetchRecentSubmissionsImpl(
  venueLabel: string,
): Promise<Submission[]> {
  const base = getBase();
  const records = await base(SUBMISSIONS_TABLE)
    .select({
      filterByFormula: freshFormula(venueLabel),
      pageSize: 100,
    })
    .all();

  const submissions: Submission[] = [];
  for (const r of records) {
    const firstName = firstNameOf(r.get("Submitter Name"));
    const age = asNumber(r.get("Age"));
    const gender = asTrimmed(r.get("Gender"));
    const videoUrl = asTrimmed(r.get("Video URL"));

    if (!firstName || age === null || !gender || !videoUrl) continue;

    submissions.push({
      id: r.id,
      firstName,
      age,
      gender,
      interestedIn: asTrimmed(r.get("Interested In")),
      lookingFor: asTrimmed(r.get("Looking For")),
      pitch: asTrimmed(r.get("Ice Breaker")),
      videoUrl,
    });
  }
  return submissions;
}

export const fetchRecentSubmissions = unstable_cache(
  fetchRecentSubmissionsImpl,
  ["recent-submissions-v2"],
  { revalidate: 30, tags: ["submissions"] },
);

export async function fetchAllRecordIds(): Promise<string[]> {
  const base = getBase();
  const records = await base(SUBMISSIONS_TABLE)
    .select({ fields: [], pageSize: 100 })
    .all();
  return records.map((r) => r.id);
}

export async function deleteRecords(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  const base = getBase();
  let deleted = 0;
  for (let i = 0; i < ids.length; i += 10) {
    const chunk = ids.slice(i, i + 10);
    await base(SUBMISSIONS_TABLE).destroy(chunk);
    deleted += chunk.length;
  }
  return deleted;
}
