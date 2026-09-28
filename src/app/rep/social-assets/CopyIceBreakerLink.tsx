"use client";

import { useState } from "react";

/**
 * Tiny copy-to-clipboard chip for a dater's ice breaker. Sydney uses
 * these as caption seed material. Kept as its own client file so the
 * social-assets page can stay a server component.
 */
export default function CopyIceBreakerLink({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silent — clipboard fail rate is low and Sydney can still see
      // the text on screen to select manually.
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-stone-300 px-2 py-1 text-[11px] text-stone-700 hover:border-stone-500"
    >
      {copied ? "Copied" : "Copy ice breaker"}
    </button>
  );
}
