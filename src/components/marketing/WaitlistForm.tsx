"use client";

import { useState } from "react";

export type WaitlistMode = "business" | "events";
export type EventsTier = "single" | "multi" | "undecided";

interface FormState {
  businessName: string;
  contactName: string;
  email: string;
  location: string;
  notes: string;
}

const initialState: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  location: "",
  notes: "",
};

interface Props {
  mode: WaitlistMode;
  /** Only meaningful when mode === "events". Pre-selects a tier in
   * the radio group based on which page CTA the user clicked. */
  initialTier?: EventsTier;
}

/**
 * Client-side waitlist form rendered on /business/waitlist and
 * /events/waitlist.
 *
 * POSTs to /api/waitlist with the form data + a Type string. On
 * success swaps the form for a "you're on the list" confirmation.
 */
export default function WaitlistForm({
  mode,
  initialTier = "undecided",
}: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [tier, setTier] = useState<EventsTier>(initialTier);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setSubmitting(true);

    // Map form mode + tier → the Type string Airtable expects.
    const type =
      mode === "business"
        ? "Business"
        : tier === "single"
          ? "Event Single Day"
          : tier === "multi"
            ? "Event Multi Day"
            : "Event Single Day"; // undecided → default bucket; Kate can recategorize manually

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(
          data.error ??
            "Submission failed. Try again or email plusnone@fetewell.com.",
        );
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-stone-300 bg-white p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
          You&apos;re on the list
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-tight text-stone-900 md:text-3xl">
          We&apos;ll be in touch.
        </h3>
        <p className="mt-4 text-stone-700">
          We&apos;ve recorded your interest. As soon as Plus None opens
          for{" "}
          {mode === "business"
            ? "new businesses"
            : "new event activations"}
          , you&apos;ll be among the first we reach out to.
        </p>
        <p className="mt-4 text-stone-700">
          In the meantime, take a look at the playbook so you know
          what to expect:
        </p>
        <a
          href="/plus-none-playbook.pdf"
          download
          className="mt-4 inline-block bg-black px-5 py-3 text-sm text-[#f4ede4] md:px-6 md:py-4 md:text-base"
        >
          Download the Plus None Playbook →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field
        label={mode === "business" ? "Business name" : "Event name"}
        value={form.businessName}
        onChange={handleChange("businessName")}
        required
        autoComplete="organization"
      />
      <Field
        label="Your full name"
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
        label={
          mode === "business"
            ? "City, state"
            : "Event city, state"
        }
        value={form.location}
        onChange={handleChange("location")}
        required
        autoComplete="address-level2"
      />

      {/* Events-only tier picker */}
      {mode === "events" && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-stone-700">
            Which activation are you interested in?
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
          <TierRadio
            value="undecided"
            current={tier}
            onChange={setTier}
            label="Not sure yet"
            desc="Tell us your event and we&apos;ll recommend a tier"
          />
        </fieldset>
      )}

      <Field
        label="Anything else? (optional)"
        value={form.notes}
        onChange={handleChange("notes")}
        textarea
      />

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
        {submitting ? "Submitting…" : "Get on the waitlist →"}
      </button>
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
  value: EventsTier;
  current: EventsTier;
  onChange: (v: EventsTier) => void;
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
        <span className="block text-sm font-medium text-stone-900">
          {label}
        </span>
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
