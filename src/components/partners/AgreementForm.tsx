"use client";

import { useState } from "react";

interface FormState {
  venueName: string;
  contactName: string;
  email: string;
  phone: string;
  venueAddress: string;
}

const initialState: FormState = {
  venueName: "",
  contactName: "",
  email: "",
  phone: "",
  venueAddress: "",
};

/**
 * Client-side form on /founding-partner/agreement.
 *
 * On submit:
 * - Posts to /api/founding-partner-agreement
 * - On 200: swaps the form view for a "you're locked in" success
 *   panel with a playbook download
 * - On error: surfaces the API error message inline; user can retry
 *   without losing their typed-in data
 */
export default function AgreementForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [agreed, setAgreed] = useState(false);
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
    if (!agreed) {
      setError("Please check the agreement box to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/founding-partner-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, agreedToTerms: true }),
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
          Confirmed
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-tight text-stone-900 md:text-3xl">
          You&apos;re locked in.
        </h3>
        <p className="mt-4 text-stone-700">
          Can&apos;t wait to see how this goes with you. Here&apos;s the
          playbook to maximize your success:
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
        label="Business name"
        value={form.venueName}
        onChange={handleChange("venueName")}
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
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={handleChange("phone")}
        required
        autoComplete="tel"
      />
      <Field
        label="Business address (for geotagging)"
        value={form.venueAddress}
        onChange={handleChange("venueAddress")}
        required
        textarea
        autoComplete="street-address"
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
          </a>{" "}
          and the Founding Partner offer described above.
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
        {submitting ? "Submitting…" : "Confirm Founding Partner Agreement"}
      </button>
    </form>
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
