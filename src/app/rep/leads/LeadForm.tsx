"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export interface LeadInitial {
  id?: string;
  name: string;
  type: string;
  category: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  seasonDates: string;
  attendance: string;
  whyItsAFit: string;
  priority: string;
  status: string;
  notes: string;
  pitchSent: boolean;
  dateLastContact: string;
}

export const EMPTY_LEAD: LeadInitial = {
  name: "",
  type: "",
  category: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  location: "",
  seasonDates: "",
  attendance: "",
  whyItsAFit: "",
  priority: "",
  status: "",
  notes: "",
  pitchSent: false,
  dateLastContact: "",
};

const TYPE_CHOICES = [
  "",
  "Business (monthly)",
  "Event — Single Day",
  "Event — Multi-Day",
];
const PRIORITY_CHOICES = ["", "High", "Medium", "Low"];
const STATUS_CHOICES = [
  "",
  "Not Started",
  "Contacted",
  "Meeting Scheduled",
  "Proposal Sent",
  "Won",
  "Lost",
];

/**
 * Shared client form used by /rep/leads/new (create) and
 * /rep/leads/[id]/edit (update). Save posts to the right endpoint
 * based on whether `initial.id` is set. On success, bounces back to
 * the dashboard so the pipeline list picks up the change.
 */
export default function LeadForm({ initial }: { initial: LeadInitial }) {
  const router = useRouter();
  const [form, setForm] = useState<LeadInitial>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (field: keyof LeadInitial) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      const target = e.target;
      const value =
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    try {
      const url = initial.id
        ? `/api/rep/leads/${encodeURIComponent(initial.id)}`
        : "/api/rep/leads";
      const method = initial.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          category: form.category,
          contactName: form.contactName,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          location: form.location,
          seasonDates: form.seasonDates,
          attendance: form.attendance,
          whyItsAFit: form.whyItsAFit,
          priority: form.priority,
          status: form.status,
          notes: form.notes,
          pitchSent: form.pitchSent,
          dateLastContact: form.dateLastContact,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Something went wrong.");
      }
      router.push("/rep");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initial.id) return;
    if (!confirm("Delete this lead? This can't be undone.")) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/rep/leads/${encodeURIComponent(initial.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Couldn't delete.");
      }
      router.push("/rep");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field
        label="Business or event name"
        value={form.name}
        onChange={set("name")}
        required
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Type"
          value={form.type}
          onChange={set("type")}
          options={TYPE_CHOICES}
        />
        <Field
          label="Category"
          value={form.category}
          onChange={set("category")}
          placeholder="Bar, wedding venue, festival, hotel…"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Priority"
          value={form.priority}
          onChange={set("priority")}
          options={PRIORITY_CHOICES}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={set("status")}
          options={STATUS_CHOICES}
        />
      </div>
      <Field
        label="Contact name"
        value={form.contactName}
        onChange={set("contactName")}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Contact email"
          type="email"
          value={form.contactEmail}
          onChange={set("contactEmail")}
        />
        <Field
          label="Contact phone"
          type="tel"
          value={form.contactPhone}
          onChange={set("contactPhone")}
        />
      </div>
      <Field
        label="Location"
        value={form.location}
        onChange={set("location")}
        placeholder="City, state"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Season / dates"
          value={form.seasonDates}
          onChange={set("seasonDates")}
          placeholder="e.g. Summer 2027, Sept 12"
        />
        <Field
          label="Attendance / capacity"
          value={form.attendance}
          onChange={set("attendance")}
        />
      </div>
      <Field
        label="Why it's a fit"
        value={form.whyItsAFit}
        onChange={set("whyItsAFit")}
        textarea
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Last contact"
          type="date"
          value={form.dateLastContact}
          onChange={set("dateLastContact")}
        />
        <label className="flex cursor-pointer items-center gap-3 pt-6">
          <input
            type="checkbox"
            checked={form.pitchSent}
            onChange={set("pitchSent")}
            className="h-5 w-5 cursor-pointer accent-[#2647e8]"
          />
          <span className="text-sm text-stone-700">Pitch sent</span>
        </label>
      </div>
      <Field
        label="Notes"
        value={form.notes}
        onChange={set("notes")}
        textarea
      />

      {error && (
        <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-5 py-2.5 text-sm font-medium text-[#f4ede4] disabled:opacity-50"
        >
          {submitting ? "Saving…" : initial.id ? "Save changes" : "Add lead"}
        </button>
        {initial.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="text-xs text-red-800 underline underline-offset-2 hover:text-red-900 disabled:opacity-50"
          >
            Delete lead
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  textarea = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
}) {
  const cls =
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
          placeholder={placeholder}
          className={cls}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="mt-1.5 block w-full rounded border border-stone-300 bg-white px-3 py-2 text-base text-stone-900 focus:border-stone-900 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "—"}
          </option>
        ))}
      </select>
    </label>
  );
}
