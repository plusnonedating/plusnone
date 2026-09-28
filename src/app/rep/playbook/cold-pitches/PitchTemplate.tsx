"use client";

import { useState } from "react";

interface Props {
  kind: string;
  subject: string;
  body: string;
}

export default function PitchTemplate({ kind, subject, body }: Props) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  return (
    <article className="mb-8 overflow-hidden rounded-lg border border-stone-300 bg-white">
      <header className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-4 py-2.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-stone-600">
          {kind}
        </span>
      </header>
      <div className="p-4">
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500">
              Subject
            </span>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(subject);
                setCopiedSubject(true);
                setTimeout(() => setCopiedSubject(false), 1500);
              }}
              className="text-[11px] text-stone-600 underline underline-offset-2 hover:text-stone-900"
            >
              {copiedSubject ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div className="rounded border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-sm text-stone-900">
            {subject}
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500">
              Body
            </span>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(body);
                setCopiedBody(true);
                setTimeout(() => setCopiedBody(false), 1500);
              }}
              className="text-[11px] text-stone-600 underline underline-offset-2 hover:text-stone-900"
            >
              {copiedBody ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap rounded border border-stone-200 bg-stone-50 px-3 py-3 font-sans text-sm leading-relaxed text-stone-800">
            {body}
          </pre>
        </div>
      </div>
    </article>
  );
}
