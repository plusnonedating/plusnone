import { getSalesBase } from "@/lib/sales-base";

/**
 * Data helpers for the rep portal.
 *
 * All queries filter by the `Sourced By` singleSelect field on the
 * Business / Events / Event Pitch Pipeline tables. Set on each row
 * either automatically (via the `?rep=` query param on the signup
 * URL) or manually by Kate in Airtable.
 *
 * Commission math is hard-coded from Exhibit A of the contract:
 *   - Business sub → $99/mo per active Client
 *   - Single-day event → $450 one-time
 *   - Multi-day event → $600 one-time
 *
 * A sale is only commissionable when the payment is COLLECTED (see
 * Section 3.2 + 4.1.1). For subs that means we count only accounts
 * with Status = Active. For events, Status = Booked.
 */

const BUSINESS_TABLE = "Business";
const EVENTS_TABLE = "Events";
const PIPELINE_TABLE = "Event Pitch Pipeline";
const WEB_WAITLIST_TABLE = "Web Waitlist";

const COMMISSION_BUSINESS_MONTHLY_USD = 99;
const COMMISSION_EVENT_SINGLE_USD = 450;
const COMMISSION_EVENT_MULTI_USD = 600;

export interface BusinessAccount {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  signupDate: string | null;
  status: string;
  monthlyAmount: number;
  commissionPerMonth: number;
  geotagAddress: string;
}

export interface EventAccount {
  id: string;
  eventName: string;
  contactName: string;
  email: string;
  tier: string;
  status: string;
  eventStartDate: string | null;
  amountPaid: number;
  commission: number;
  venueAddress: string;
}

export interface PipelineItem {
  id: string;
  name: string;
  type: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  notes: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  pitchSent: boolean;
  dateLastContact: string | null;
}

export interface WaitlistLead {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  location: string;
  type: string;
  signedUpAt: string | null;
  status: string;
}

export interface RepSnapshot {
  business: {
    active: BusinessAccount[];
    pending: BusinessAccount[];
  };
  events: {
    booked: EventAccount[];
    pending: EventAccount[];
  };
  pipeline: PipelineItem[];
  waitlist: WaitlistLead[];
  commission: {
    monthlyRecurring: number;
    thisMonthOneTime: number;
    thisMonthTotal: number;
    activeSubCount: number;
    bookedEventCount: number;
  };
}

function num(v: unknown): number {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function str(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  return String(v);
}

/**
 * Airtable's returned fields aren't strongly typed. Cast to a loose
 * record and use accessors that tolerate missing values.
 */
type FieldSet = Record<string, unknown>;

/**
 * Fetch the full rep snapshot in parallel. Returns empty collections
 * if any table read fails, so the dashboard degrades gracefully
 * instead of erroring out during Sydney's demo.
 */
export async function fetchRepSnapshot(rep: string): Promise<RepSnapshot> {
  const base = getSalesBase();

  const businessRows = await base(BUSINESS_TABLE)
    .select({
      filterByFormula: `LOWER({Sourced By}) = "${rep.toLowerCase()}"`,
      pageSize: 100,
    })
    .all()
    .catch(() => []);
  const eventRows = await base(EVENTS_TABLE)
    .select({
      filterByFormula: `LOWER({Sourced By}) = "${rep.toLowerCase()}"`,
      pageSize: 100,
    })
    .all()
    .catch(() => []);
  const pipelineRows = await base(PIPELINE_TABLE)
    .select({
      filterByFormula: `LOWER({Sourced By}) = "${rep.toLowerCase()}"`,
      pageSize: 100,
    })
    .all()
    .catch(() => []);
  const waitlistRows = await base(WEB_WAITLIST_TABLE)
    .select({
      filterByFormula: `LOWER({Sourced By}) = "${rep.toLowerCase()}"`,
      pageSize: 100,
    })
    .all()
    .catch(() => []);

  const business = { active: [] as BusinessAccount[], pending: [] as BusinessAccount[] };
  for (const row of businessRows) {
    const fields = row.fields as FieldSet;
    const status = str(fields["Status"]);
    const account: BusinessAccount = {
      id: row.id,
      businessName: str(fields["Business Name"]),
      contactName: str(fields["Contact Name"]),
      email: str(fields["Email"]),
      signupDate: str(fields["Signup Date"]) || null,
      status,
      monthlyAmount: num(fields["Monthly Amount"]),
      commissionPerMonth: COMMISSION_BUSINESS_MONTHLY_USD,
      geotagAddress: str(fields["Geotag Address"]),
    };
    if (status === "Active") business.active.push(account);
    else if (status === "Pending Payment") business.pending.push(account);
  }

  const events = { booked: [] as EventAccount[], pending: [] as EventAccount[] };
  for (const row of eventRows) {
    const fields = row.fields as FieldSet;
    const status = str(fields["Status"]);
    const tier = str(fields["Tier"]);
    const isMulti = /multi|weekend/i.test(tier);
    const commission = isMulti
      ? COMMISSION_EVENT_MULTI_USD
      : COMMISSION_EVENT_SINGLE_USD;
    const account: EventAccount = {
      id: row.id,
      eventName: str(fields["Event Name"]),
      contactName: str(fields["Contact Name"]),
      email: str(fields["Email"]),
      tier,
      status,
      eventStartDate: str(fields["Event Start Date"]) || null,
      amountPaid: num(fields["Amount Paid"]),
      commission,
      venueAddress: str(fields["Venue Address (Geotag)"]),
    };
    if (status === "Booked") events.booked.push(account);
    else if (status === "Pending Payment") events.pending.push(account);
  }

  const pipeline: PipelineItem[] = pipelineRows.map((row) => {
    const fields = row.fields as FieldSet;
    return {
      id: row.id,
      name: str(fields["Event Name"]),
      type: str(fields["Type"]),
      category: str(fields["Category"]),
      priority: str(fields["Priority"]),
      status: str(fields["Status"]),
      location: str(fields["Location"]),
      notes: str(fields["Notes"]),
      contactName: str(fields["Contact"]),
      contactEmail: str(fields["Contact Email"]),
      contactPhone: str(fields["Contact Phone"]),
      pitchSent: Boolean(fields["Pitch Sent?"]),
      dateLastContact: str(fields["Date Last Contact"]) || null,
    };
  });

  const waitlist: WaitlistLead[] = waitlistRows.map((row) => {
    const fields = row.fields as FieldSet;
    return {
      id: row.id,
      businessName: str(fields["Business Name"]),
      contactName: str(fields["Contact Name"]),
      email: str(fields["Email"]),
      location: str(fields["Location"]),
      type: str(fields["Type"]),
      signedUpAt: str(fields["Signed up at"]) || null,
      status: str(fields["Status"]),
    };
  });

  // Commission: recurring is what she'll earn every month from Active
  // subs. this-month one-time = events booked since the 1st.
  const monthlyRecurring =
    business.active.length * COMMISSION_BUSINESS_MONTHLY_USD;
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);
  const thisMonthOneTime = events.booked
    .filter((e) => {
      // Rough: use event start date. If Kate wants "collected this
      // month", swap to a "Booking Date" or "Collected On" column later.
      if (!e.eventStartDate) return false;
      const t = Date.parse(e.eventStartDate);
      return Number.isFinite(t) && t >= startOfMonth.getTime();
    })
    .reduce((sum, e) => sum + e.commission, 0);

  return {
    business,
    events,
    pipeline,
    waitlist,
    commission: {
      monthlyRecurring,
      thisMonthOneTime,
      thisMonthTotal: monthlyRecurring + thisMonthOneTime,
      activeSubCount: business.active.length,
      bookedEventCount: events.booked.length,
    },
  };
}
