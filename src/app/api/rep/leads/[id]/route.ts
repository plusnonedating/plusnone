import { NextResponse } from "next/server";
import type { FieldSet } from "airtable";
import { isAuthenticatedRep } from "@/lib/rep-auth";
import { getSalesBase } from "@/lib/sales-base";

const PIPELINE_TABLE = "Event Pitch Pipeline";
const REP_HANDLE = "sydney";

interface UpdateBody {
  name?: string;
  type?: string;
  category?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  seasonDates?: string;
  attendance?: string;
  whyItsAFit?: string;
  priority?: string;
  status?: string;
  notes?: string;
  dateLastContact?: string;
  pitchSent?: boolean;
}

/**
 * PATCH /api/rep/leads/[id]
 *
 * Updates a lead the signed-in rep owns. Guarded server-side by
 * re-reading the row and refusing the write if Sourced By doesn't
 * match the rep — prevents Sydney from editing rows Kate curated for
 * a different rep or for herself.
 *
 * Missing fields in the body are left untouched (patch, not replace).
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticatedRep())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { id } = await params;

  const base = getSalesBase();
  const existing = await base(PIPELINE_TABLE)
    .find(id)
    .catch(() => null);
  if (!existing) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }
  const ownedBy = (existing.fields as Record<string, unknown>)["Sourced By"];
  if (ownedBy !== REP_HANDLE) {
    return NextResponse.json({ error: "Not your lead." }, { status: 403 });
  }

  let body: UpdateBody;
  try {
    body = (await req.json()) as UpdateBody;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const fields: Partial<FieldSet> = {};
  if (body.name !== undefined) fields["Event Name"] = body.name.trim();
  if (body.type !== undefined) fields["Type"] = body.type;
  if (body.category !== undefined) fields["Category"] = body.category;
  if (body.contactName !== undefined) fields["Contact"] = body.contactName;
  if (body.contactEmail !== undefined) fields["Contact Email"] = body.contactEmail;
  if (body.contactPhone !== undefined) fields["Contact Phone"] = body.contactPhone;
  if (body.location !== undefined) fields["Location"] = body.location;
  if (body.seasonDates !== undefined) fields["Season / Dates"] = body.seasonDates;
  if (body.attendance !== undefined) fields["Attendance"] = body.attendance;
  if (body.whyItsAFit !== undefined) fields["Why It's a Fit"] = body.whyItsAFit;
  if (body.priority !== undefined) fields["Priority"] = body.priority;
  if (body.status !== undefined) fields["Status"] = body.status;
  if (body.notes !== undefined) fields["Notes"] = body.notes;
  if (body.dateLastContact !== undefined) fields["Date Last Contact"] = body.dateLastContact;
  if (body.pitchSent !== undefined) fields["Pitch Sent?"] = body.pitchSent;

  try {
    await base(PIPELINE_TABLE).update(id, fields, { typecast: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/rep/leads/PATCH] failed:", msg);
    return NextResponse.json(
      { error: "Couldn't save the changes. Try again in a moment." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/rep/leads/[id]
 *
 * Same ownership check as PATCH. Actually deletes the Airtable row —
 * Sydney can use this to clear out dead leads. If we want a soft
 * delete later, add an "Archived" status option and update this to
 * flip that flag instead.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticatedRep())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { id } = await params;
  const base = getSalesBase();
  const existing = await base(PIPELINE_TABLE)
    .find(id)
    .catch(() => null);
  if (!existing) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }
  const ownedBy = (existing.fields as Record<string, unknown>)["Sourced By"];
  if (ownedBy !== REP_HANDLE) {
    return NextResponse.json({ error: "Not your lead." }, { status: 403 });
  }
  try {
    await base(PIPELINE_TABLE).destroy(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/rep/leads/DELETE] failed:", msg);
    return NextResponse.json(
      { error: "Couldn't delete. Try again in a moment." },
      { status: 500 },
    );
  }
}
