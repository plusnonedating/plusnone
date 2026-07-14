"use client";

import { useMemo, useState } from "react";
import { CheckoutIframe } from "./CheckoutIframe";

type Tier = "single" | "multi";

interface CheckoutState {
  formUrl: string;
  token: string;
  rowId: string;
}

interface FormState {
  eventName: string;
  contactName: string;
  email: string;
  phone: string;
  venueAddress: string;
  eventStartDate: string;
  eventEndDate: string;
  shippingAddress: string;
  logoUrl: string;
}

const initialState: FormState = {
  eventName: "",
  contactName: "",
  email: "",
  phone: "",
  venueAddress: "",
  eventStartDate: "",
  eventEndDate: "",
  shippingAddress: "",
  logoUrl: "",
};

interface Props {
  initialTier: Tier;
}

// Same business-day arithmetic used server-side, kept here to give
// immediate client feedback on a too-close event date. The server
// re-runs it authoritatively.
function businessDaysBetween(from: Date, to: Date): number {
  if (to.getTime() < from.getTime()) return -1;
  let count = 0;
  const cursor = new Date(from.getTime());
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to.getTime());
  end.setHours(0, 0, 0, 0);
  while (cursor.getTime() < end.getTime()) {
    cursor.setDate(cursor.getDate() + 1);
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

/**
 * Events booking form. Client-side pre-validation of the 14-business-
 * day rule so users don't hit the server error path. On submit, the
 * client auto-POSTs the returned token to Auth.net's hosted payment
 * page (same handoff pattern as BusinessSignupForm).
 */
export default function EventsBookingForm({ initialTier }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [tier, setTier] = useState<Tier>(initialTier);
  const [shippingSameAsVenue, setShippingSameAsVenue] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<CheckoutState | null>(null);

  const businessDaysOut = useMemo(() => {
    if (!form.eventStartDate) return null;
    const ts = Date.parse(form.eventStartDate);
    if (!Number.isFinite(ts)) return null;
    return businessDaysBetween(new Date(), new Date(ts));
  }, [form.eventStartDate]);

  const dateTooClose =
    businessDaysOut !== null && businessDaysOut < 14 && businessDaysOut >= 0;

  const handleChange =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError("Please check the Partner Terms box to continue.");
      return;
    }
    if (dateTooClose) {
      setError(
        "Event date must be at least 14 business days out. Please pick a later date.",
      );
      return;
    }
    setSubmitting(true);

    const shipping = shippingSameAsVenue ? form.venueAddress : form.shippingAddress;

    try {
      const res = await fetch("/api/events/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          shippingAddress: shipping,
          tier,
          agreedToTerms: true,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Something went wrong. Try again in a moment.");
      }
      const { formUrl, token, rowId } = (await res.json()) as {
        formUrl: string;
        token: string;
        rowId: string;
      };

      // Swap the form for a Plus None-branded checkout view that
      // embeds the Auth.net hosted payment page as an iframe. URL bar
      // stays on plusnone.fetewell.com; cards enter on the iframe.
      setCheckout({ formUrl, token, rowId });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  };

  if (checkout) {
    return (
      <div className="space-y-4">
        <div className="rounded border border-stone-200 bg-white/70 px-4 py-3 text-sm text-stone-700">
          <p className="font-medium text-stone-900">
            Complete your ${tier === "single" ? "499" : "799"} booking
          </p>
          <p className="mt-0.5 text-xs text-stone-600">
            Card entered on our processor&apos;s secure page (embedded
            below). Plus None never sees or stores your card number.
          </p>
        </div>
        <CheckoutIframe
          formUrl={checkout.formUrl}
          token={checkout.token}
          onSuccess={() => {
            window.location.href = `/events/booking/callback?rowId=${encodeURIComponent(
              checkout.rowId,
            )}`;
          }}
          onCancel={() => {
            setCheckout(null);
            setSubmitting(false);
          }}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-stone-700">
          Which activation?
        </legend>
        <TierRadio
          value="single"
          current={tier}
          onChange={setTier}
          label="Single Day ($499)"
          desc="24-hour activation"
        />
        <TierRadio
          value="multi"
          current={tier}
          onChange={setTier}
          label="Multi-Day ($799)"
          desc="72-hour activation"
        />
      </fieldset>

      <Field
        label="Event name"
        value={form.eventName}
        onChange={handleChange("eventName")}
        required
        autoComplete="organization"
      />
      <Field
        label="Organizer name"
        value={form.contactName}
        onChange={handleChange("contactName")}
        required
        autoComplete="name"
      />
      <Field
        label="Email"
        type="email"
        value={form.email}
        onChange={handleChange("email")}
        required
        autoComplete="email"
      />
      <Field
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={handleChange("phone")}
        required
        autoComplete="tel"
      />
      <Field
        label="Venue address (where guests scan the QR code)"
        value={form.venueAddress}
        onChange={handleChange("venueAddress")}
        required
        textarea
        autoComplete="street-address"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Event start date"
          type="date"
          value={form.eventStartDate}
          onChange={handleChange("eventStartDate")}
          required
        />
        <Field
          label="Event end date"
          type="date"
          value={form.eventEndDate}
          onChange={handleChange("eventEndDate")}
        />
      </div>
      {dateTooClose && (
        <p className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Heads up — that&apos;s only {businessDaysOut} business days
          away. We need at least 14 business days for signage design +
          shipping. Please pick a later date.
        </p>
      )}

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={shippingSameAsVenue}
          onChange={(e) => setShippingSameAsVenue(e.target.checked)}
          className="mt-1 h-5 w-5 flex-shrink-0 cursor-pointer accent-[#2647e8]"
        />
        <span className="text-sm text-stone-700">
          Ship signage to the same address as the event venue.
        </span>
      </label>

      {!shippingSameAsVenue && (
        <Field
          label="Shipping address for signage"
          value={form.shippingAddress}
          onChange={handleChange("shippingAddress")}
          required
          textarea
          autoComplete="shipping street-address"
        />
      )}

      <Field
        label="Logo URL (paste a link to your event logo — optional)"
        value={form.logoUrl}
        onChange={handleChange("logoUrl")}
        type="url"
        autoComplete="url"
      />

      <label className="flex cursor-pointer items-start gap-3 pt-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-5 w-5 flex-shrink-0 cursor-pointer accent-[#2647e8]"
          required
          aria-required="true"
        />
        <span className="text-sm leading-relaxed text-stone-700">
          I have read and agree to Plus None&apos;s{" "}
          <a
            href="/partner-terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Partner Terms
          </a>
          . I understand my card is charged in full at booking. Free
          reschedule up to 7 days before my event; non-refundable within 7
          days.
        </span>
      </label>

      {error && (
        <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-block bg-black px-5 py-3 text-sm text-[#f4ede4] disabled:opacity-50 md:px-6 md:py-4 md:text-base"
      >
        {submitting
          ? "Redirecting to checkout…"
          : tier === "single"
            ? "Continue to checkout — $499 →"
            : "Continue to checkout — $799 →"}
      </button>

      <p className="text-xs leading-snug text-stone-500">
        Card entry happens on our processor&apos;s secure page. Plus None
        never sees or stores your card number.
      </p>
    </form>
  );
}

function TierRadio({
  value,
  current,
  onChange,
  label,
  desc,
}: {
  value: Tier;
  current: Tier;
  onChange: (v: Tier) => void;
  label: string;
  desc: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded border px-3 py-2.5 ${
        current === value
          ? "border-stone-900 bg-stone-50"
          : "border-stone-300 bg-white"
      }`}
    >
      <input
        type="radio"
        name="tier"
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
        className="mt-1 h-4 w-4 accent-[#2647e8]"
      />
      <span>
        <span className="block text-sm font-medium text-stone-900">{label}</span>
        <span className="block text-xs text-stone-600">{desc}</span>
      </span>
    </label>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  autoComplete?: string;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  textarea = false,
  autoComplete,
}: FieldProps) {
  const inputClass =
    "mt-1.5 block w-full rounded border border-stone-300 bg-white px-3 py-2 text-base text-stone-900 focus:border-stone-900 focus:outline-none";
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-700" aria-hidden="true">
            *
          </span>
        )}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          required={required}
          rows={3}
          autoComplete={autoComplete}
          className={inputClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={inputClass}
        />
      )}
    </label>
  );
}
