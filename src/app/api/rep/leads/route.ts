import { NextResponse } from "next/server";
import type { FieldSet } from "airtable";
import { isAuthenticatedRep } from "@/lib/rep-auth";
import { getSalesBase } from "@/lib/sales-base";

const PIPELINE_TABLE = "Event Pitch Pipeline";
const REP_HANDLE = "sydney"; // Shared-token session; single rep for now.

interface LeadBody {
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
}

/**
 * POST /api/rep/leads
 *
 * Creates a new lead in the Event Pitch Pipeline table, tagged to the
 * signed-in rep. Only the name is required; everything else is
 * optional so Sydney can capture a lead fast and fill in details later.
 */
export async function POST(req: Request) {
  if (!(await isAuthenticatedRep())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const base = getSalesBase();
  const fields: Partial<FieldSet> = {
    "Event Name": name,
    "Sourced By": REP_HANDLE,
  };
  if (body.type) fields["Type"] = body.type;
  if (body.category) fields["Category"] = body.category;
  if (body.contactName) fields["Contact"] = body.contactName;
  if (body.contactEmail) fields["Contact Email"] = body.contactEmail;
  if (body.contactPhone) fields["Contact Phone"] = body.contactPhone;
  if (body.location) fields["Location"] = body.location;
  if (body.seasonDates) fields["Season / Dates"] = body.seasonDates;
  if (body.attendance) fields["Attendance"] = body.attendance;
  if (body.whyItsAFit) fields["Why It's a Fit"] = body.whyItsAFit;
  if (body.priority) fields["Priority"] = body.priority;
  if (body.status) fields["Status"] = body.status;
  if (body.notes) fields["Notes"] = body.notes;

  try {
    const [row] = await base(PIPELINE_TABLE).create([{ fields }], {
      // typecast auto-creates missing singleSelect options (Type,
      // Priority, Status, Category) so the form can send whatever
      // makes sense to the rep.
      typecast: true,
    });
    return NextResponse.json({ id: row.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/rep/leads] create failed:", msg);
    return NextResponse.json(
      { error: "Couldn't save the lead. Try again in a moment." },
      { status: 500 },
    );
  }
}
