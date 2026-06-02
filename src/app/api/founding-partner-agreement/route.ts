import { NextResponse } from "next/server";
import Airtable from "airtable";

const AGREEMENTS_TABLE = "Founding Partner Agreements";

interface AgreementBody {
  venueName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  venueAddress?: string;
  agreedToTerms?: boolean;
}

/**
 * POST /api/founding-partner-agreement
 *
 * Records a founding partner's acceptance of the Plus None Partner
 * Terms + Founding Partner offer. Writes a row to the Airtable
 * "Founding Partner Agreements" table in the Submissions base.
 *
 * The IP + User Agent fields are forensic — they're our record that
 * THIS person on THIS device at THIS time clicked agree. If a partner
 * ever disputes the agreement, that's the proof.
 *
 * Expected request body (JSON):
 *   {
 *     venueName: string,
 *     contactName: string,
 *     email: string,
 *     phone: string,
 *     venueAddress: string,
 *     agreedToTerms: true
 *   }
 *
 * 200 → { ok: true }
 * 400 → { error: <human-readable> }   (validation failure)
 * 500 → { error: <human-readable> }   (server/Airtable failure)
 */
export async function POST(req: Request) {
  let body: AgreementBody;
  try {
    body = (await req.json()) as AgreementBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const venueName = body.venueName?.trim();
  const contactName = body.contactName?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim() ?? "";
  const venueAddress = body.venueAddress?.trim();

  if (!venueName || !contactName || !email || !venueAddress) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!body.agreedToTerms) {
    return NextResponse.json(
      { error: "You must accept the Partner Terms to continue." },
      { status: 400 },
    );
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    console.error(
      "[founding-partner-agreement] AIRTABLE_API_KEY or AIRTABLE_BASE_ID not set",
    );
    return NextResponse.json(
      {
        error:
          "Server configuration error. Email plusnone@fetewell.com so we can record your agreement manually.",
      },
      { status: 500 },
    );
  }

  // Best-effort forensic capture. Vercel terminates the TLS so the
  // client IP shows up in x-forwarded-for (first entry).
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  try {
    const base = new Airtable({ apiKey }).base(baseId);
    await base(AGREEMENTS_TABLE).create({
      "Venue Name": venueName,
      "Contact Name": contactName,
      Email: email,
      Phone: phone,
      "Venue Address": venueAddress,
      "Agreed At": new Date().toISOString(),
      "IP Address": ip,
      "User Agent": userAgent,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      "[founding-partner-agreement] Airtable write failed:",
      message,
    );
    return NextResponse.json(
      {
        error:
          "Couldn't save your agreement right now. Try again, or email plusnone@fetewell.com.",
      },
      { status: 500 },
    );
  }
}
