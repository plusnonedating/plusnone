import Airtable, { type Base } from "airtable";

export const SUBMISSIONS_TABLE = "Submissions";

let cachedBase: Base | null = null;

export function getBase(): Base {
  if (cachedBase) return cachedBase;

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey) {
    throw new Error("AIRTABLE_API_KEY is not set");
  }
  if (!baseId) {
    throw new Error("AIRTABLE_BASE_ID is not set");
  }

  cachedBase = new Airtable({ apiKey }).base(baseId);
  return cachedBase;
}
