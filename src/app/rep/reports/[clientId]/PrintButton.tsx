"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded bg-stone-900 px-4 py-2 text-sm text-[#f4ede4]"
    >
      Print / Save PDF
    </button>
  );
}
