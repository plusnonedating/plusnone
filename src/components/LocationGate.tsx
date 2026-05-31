"use client";

import Image from "next/image";

type Phase = "idle" | "locating" | "denied";

interface Props {
  phase: Phase;
  /** Called when the user taps the primary "Allow location" button. */
  onAllow: () => void;
  /** URL to the IG fallback — the "Just post me to IG" escape hatch. */
  igFallbackUrl: string;
}

/**
 * Location-permission intro screen rendered at the top of /scan.
 *
 * Visual is the same brand treatment as the previous per-venue Gate
 * (cream card on patterned background, big serif-display heading,
 * cobalt CTA, IG escape hatch below). What's different here:
 *
 *   1. There is no venue-specific subtitle. /scan doesn't know which
 *      venue you're at until after the geolocation request resolves.
 *   2. The button stays on this screen during the "locating" phase
 *      instead of jumping to a separate panel — when the API resolves,
 *      ScanClient unmounts this gate and renders the feed (or redirects
 *      to /ig).
 *   3. Permission-denied is also handled by ScanClient via redirect,
 *      so the `denied` phase only briefly flashes before the navigation
 *      lands — it's wired here for completeness.
 */
export default function LocationGate({
  phase,
  onAllow,
  igFallbackUrl,
}: Props) {
  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-pattern opacity-30 pointer-events-none"
      />
      <section className="relative z-10 flex flex-col items-center px-5 pt-6 pb-10 text-center">
        <div className="bg-cream rounded-[18px] p-4 mb-4 w-fit shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <Image
            src="/plus-none-logo.png"
            alt="Plus None"
            width={660}
            height={660}
            priority
            className="w-[210px] h-auto block"
          />
        </div>
        <div className="w-full max-w-md bg-cream rounded-[18px] px-[28px] pt-9 pb-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h1 className="font-display text-[48px] leading-none tracking-[0.01em] text-ink mb-[18px]">
            who else here is single?
            <br />
            <span className="text-cobalt">we&apos;ll show you.</span>
          </h1>
          <p className="text-[18px] leading-[1.55] text-ink/85 mb-7">
            Plus None is a private dating pool for the people in the room with
            you right now. Location confirms you&apos;re here. Resets
            overnight. Your ex isn&apos;t getting in.
          </p>
          <button
            type="button"
            onClick={onAllow}
            disabled={phase !== "idle"}
            className="w-full rounded-full bg-cobalt hover:bg-cobalt-hover transition-colors px-7 py-[18px] font-display text-[23px] uppercase tracking-[0.06em] text-white disabled:opacity-70"
          >
            {phase === "locating" ? "Finding you…" : "Allow location"}
          </button>
        </div>
        <a
          href={igFallbackUrl}
          className="mt-[22px] text-[16px] text-muted hover:text-cobalt"
        >
          Not at a Plus None location?{" "}
          <u className="decoration-1 underline-offset-[3px]">
            Just post me to IG &rarr;
          </u>
        </a>
      </section>
    </div>
  );
}
