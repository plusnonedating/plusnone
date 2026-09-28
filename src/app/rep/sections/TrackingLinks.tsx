"use client";

import { useState } from "react";

/**
 * Sydney's attribution links. Every pitch she sends should use one of
 * these — the `?rep=` query param on the URL is what tags the Airtable
 * row with her name when a Client checks out, which is what makes the
 * row show up on her dashboard + pay her commission.
 */
export default function TrackingLinks({ rep }: { rep: string }) {
  const businessLink = `https://plusnone.fetewell.com/business?rep=${rep}`;
  const eventsLink = `https://plusnone.fetewell.com/events?rep=${rep}`;
  return (
    <section className="mb-10 rounded-xl border border-stone-300 bg-white/50 p-5 md:p-6">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
        Your tracking links
      </p>
      <h2 className="font-serif text-xl leading-tight tracking-tight text-stone-900 md:text-2xl">
        Send these in every pitch.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-700">
        The <code className="rounded bg-stone-200 px-1 text-xs">?rep={rep}</code>{" "}
        on the end is what credits the sale to you. If a Client uses the
        plain URL, the sale isn&apos;t attributed and no commission fires.
      </p>
      <div className="mt-4 space-y-2">
        <LinkRow label="Business" url={businessLink} />
        <LinkRow label="Events" url={eventsLink} />
      </div>
    </section>
  );
}

function LinkRow({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-3 rounded border border-stone-300 bg-white px-3 py-2">
      <span className="w-20 flex-shrink-0 text-xs font-medium uppercase tracking-wider text-stone-500">
        {label}
      </span>
      <code className="flex-1 truncate font-mono text-xs text-stone-800">
        {url}
      </code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="flex-shrink-0 rounded bg-stone-900 px-3 py-1.5 text-xs text-[#f4ede4]"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
