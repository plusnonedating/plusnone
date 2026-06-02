// Daily Airtable snapshot — runs from .github/workflows/airtable-backup.yml.
//
// Dumps both bases (Submissions + Partners) to CSV files under backups/,
// with today's date in the filename. The workflow commits these to the
// `backups` branch.
//
// Env vars (provided by the workflow from repo secrets):
//   AIRTABLE_API_KEY            — Submissions PAT
//   AIRTABLE_BASE_ID            — Submissions base ID (optional, has default)
//   AIRTABLE_BUSINESS_API_KEY   — Partners PAT
//   AIRTABLE_BUSINESS_BASE_ID   — Partners base ID (optional, has default)

import Airtable from "airtable";
import { mkdirSync, writeFileSync } from "node:fs";

const today = new Date().toISOString().slice(0, 10);

function csvCell(v) {
  if (v === undefined || v === null) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function recordsToCsv(records) {
  if (records.length === 0) return "id,createdTime\n";
  const fields = new Set();
  for (const r of records) for (const k of Object.keys(r.fields)) fields.add(k);
  const cols = ["id", "createdTime", ...Array.from(fields).sort()];
  const header = cols.map(csvCell).join(",");
  const rows = records.map((r) =>
    cols
      .map((c) => {
        if (c === "id") return csvCell(r.id);
        if (c === "createdTime") return csvCell(r._rawJson.createdTime);
        return csvCell(r.fields[c]);
      })
      .join(","),
  );
  return [header, ...rows].join("\n") + "\n";
}

async function dump({ apiKey, baseId, tableId, label }) {
  // Throw rather than skip when the key is missing — a silently-empty
  // backup is worse than a loud failure. The workflow step exits
  // non-zero, GitHub Actions marks the run as failed, and the commit
  // step never runs (so we don't end up pushing an empty CSV that
  // looks like a successful backup).
  if (!apiKey) {
    throw new Error(
      `${label}: no API key set — refusing to write empty backup`,
    );
  }
  const base = new Airtable({ apiKey }).base(baseId);
  const records = await base(tableId).select().all();
  const csv = recordsToCsv(records);
  mkdirSync("backups", { recursive: true });
  const path = `backups/${today}-${label}.csv`;
  writeFileSync(path, csv);
  console.log(`✓ ${label}: ${records.length} records → ${path}`);
}

await dump({
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID || "app1bnUYIncirnxRn",
  tableId: "Submissions",
  label: "submissions",
});

await dump({
  apiKey:
    process.env.AIRTABLE_BUSINESS_API_KEY || process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BUSINESS_BASE_ID || "appNewsi5A4VKSs4g",
  tableId: "tblCjS56kFGGr1XYo",
  label: "partners",
});
