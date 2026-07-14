"use client";

import { useState } from "react";
import { CheckoutIframe } from "./CheckoutIframe";

interface FormState {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  geotagAddress: string;
  shippingAddress: string;
}

interface CheckoutState {
  formUrl: string;
  token: string;
  rowId: string;
}

const initialState: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  geotagAddress: "",
  shippingAddress: "",
};

/**
 * Client-side signup form on /business/signup.
 *
 * On submit:
 *   1. POSTs to /api/business/signup with the form fields.
 *   2. Receives { formUrl, token } from the server.
 *   3. Builds a hidden auto-submitting form that POSTs to Auth.net's
 *      hosted CIM URL with the token. The user is bounced to Auth.net
 *      to enter their card. Card data never touches our origin.
 *
 * The "same as geotag" checkbox toggles a mirror mode where the
 * shipping field is hidden and its value is copied from the geotag
 * field at submit time.
 */
export default function BusinessSignupForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [shippingSameAsGeotag, setShippingSameAsGeotag] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<CheckoutState | null>(null);

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
    setSubmitting(true);

    const shipping = shippingSameAsGeotag ? form.geotagAddress : form.shippingAddress;

    try {
      const res = await fetch("/api/business/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          shippingAddress: shipping,
          agreedToTerms: true,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(
          data.error ?? "Something went wrong. Try again in a moment.",
        );
      }
      const { formUrl, token, rowId } = (await res.json()) as {
        formUrl: string;
        token: string;
        rowId: string;
      };

      // Swap the form for a Plus None-branded checkout view that
      // embeds the Auth.net hosted card entry as an iframe. URL bar
      // stays on plusnone.fetewell.com; cards enter on the iframe,
      // which is served from accept.authorize.net. PCI SAQ A holds.
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
          <p className="font-medium text-stone-900">Secure card entry</p>
          <p className="mt-0.5 text-xs text-stone-600">
            Card is entered on our processor&apos;s secure page (embedded
            below). Plus None never sees or stores your card number.
          </p>
        </div>
        <CheckoutIframe
          formUrl={checkout.formUrl}
          token={checkout.token}
          onSuccess={() => {
            window.location.href = `/business/signup/callback?rowId=${encodeURIComponent(
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
      <Field
        label="Business name"
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
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={handleChange("phone")}
        required
        autoComplete="tel"
      />
      <Field
        label="Business address (where guests scan the QR code)"
        value={form.geotagAddress}
        onChange={handleChange("geotagAddress")}
        required
        textarea
        autoComplete="street-address"
      />

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={shippingSameAsGeotag}
          onChange={(e) => setShippingSameAsGeotag(e.target.checked)}
          className="mt-1 h-5 w-5 flex-shrink-0 cursor-pointer accent-[#2647e8]"
        />
        <span className="text-sm text-stone-700">
          Ship signage to the same address.
        </span>
      </label>

      {!shippingSameAsGeotag && (
        <Field
          label="Shipping address for signage"
          value={form.shippingAddress}
          onChange={handleChange("shippingAddress")}
          required
          textarea
          autoComplete="shipping street-address"
        />
      )}

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
          . First 30 days are free; my card is charged $99/month starting
          day 31 unless I cancel.
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
        {submitting ? "Redirecting to checkout…" : "Continue to checkout →"}
      </button>

      <p className="text-xs leading-snug text-stone-500">
        Card entry happens on our processor&apos;s secure page. Plus None
        never sees or stores your card number.
      </p>
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
