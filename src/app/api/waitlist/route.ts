import { NextResponse } from "next/server";
import Airtable from "airtable";

const WAITLIST_TABLE = "Waitlist";

type WaitlistType =
  | "Business"
  | "Event Single Day"
  | "Event Multi Day";

const ALLOWED_TYPES: WaitlistType[] = [
  "Business",
  "Event Single Day",
  "Event Multi Day",
];

interface WaitlistBody {
  businessName?: string;
  contactName?: string;
  email?: string;
  location?: string;
  notes?: string;
  type?: string;
}

/**
 * POST /api/waitlist
 *
 * Captures a prospect's interest before Plus None has a payment
 * processor approved. Writes a row to the Airtable "Waitlist" table
 * in the Submissions base.
 *
 * Expected request body (JSON):
 *   {
 *     businessName: string,
 *     contactName: string,
 *     email: string,
 *     location: string,
 *     notes?: string,
 *     type: "Business" | "Event Single Day" | "Event Multi Day"
 *   }
 *
 * 200 → { ok: true }
 * 400 → { error: <human-readable> }   (validation failure)
 * 500 → { error: <human-readable> }   (server/Airtable failure)
 */
export async function POST(req: Request) {
  let body: WaitlistBody;
  try {
    body = (await req.json()) as WaitlistBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const businessName = body.businessName?.trim();
  const contactName = body.contactName?.trim();
  const email = body.email?.trim();
  const location = body.location?.trim();
  const notes = body.notes?.trim() ?? "";
  const type = body.type?.trim();

  if (!businessName || !contactName || !email || !location) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!type || !ALLOWED_TYPES.includes(type as WaitlistType)) {
    return NextResponse.json(
      { error: "Invalid waitlist type." },
      { status: 400 },
    );
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    console.error(
      "[waitlist] AIRTABLE_API_KEY or AIRTABLE_BASE_ID not set",
    );
    return NextResponse.json(
      {
        error:
          "Server configuration error. Email plusnone@fetewell.com instead.",
      },
      { status: 500 },
    );
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  try {
    const base = new Airtable({ apiKey }).base(baseId);
    await base(WAITLIST_TABLE).create({
      "Business Name": businessName,
      "Contact Name": contactName,
      Email: email,
      Location: location,
      Type: type,
      Notes: notes,
      "Signed up at": new Date().toISOString(),
      "IP Address": ip,
      "User Agent": userAgent,
      Status: "Pending",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[waitlist] Airtable write failed:", message);
    return NextResponse.json(
      {
        error:
          "Couldn't save your signup right now. Try again, or email plusnone@fetewell.com.",
      },
      { status: 500 },
    );
  }
}
