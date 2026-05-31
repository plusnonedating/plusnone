"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FORM_URL } from "@/lib/form";
import type { FeedVenueData } from "./VenueFeedView";

interface Props {
  venue: FeedVenueData;
  /** When set, skips the `/api/submissions?count_only=1` fetch and uses
   * this value as the count directly. Used by /preview/blur to render
   * the multi-card state without needing real submissions. Should never
   * be passed in real usage. */
  overrideCount?: number;
}

/**
 * Locked-state view rendered on /scan when the visitor is at a venue
 * but hasn't submitted yet.
 *
 * Shows the same header chrome as VenueFeedView (logo, "who else is
 * here", venue name), then a row of CSS-blurred placeholder cards
 * representing the real profiles, capped by a big cobalt CTA pointing
 * at the WPForm.
 *
 * Privacy: this component only ever fetches `/api/submissions?count_only=1`.
 * It never receives the real profile data — video URLs, names, pitches
 * stay server-side until the visitor commits via the form. The N
 * placeholders shown here are stand-ins, not blurred real cards.
 */
export default function BlurredFeedView({ venue, overrideCount }: Props) {
  const [count, setCount] = useState<number | null>(
    overrideCount ?? null,
  );

  useEffect(() => {
    if (overrideCount !== undefined) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/submissions?label=${encodeURIComponent(venue.label)}&count_only=1`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { count?: number };
        if (cancelled) return;
        setCount(typeof data.count === "number" ? data.count : 0);
      } catch {
        if (!cancelled) setCount(0);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [venue.label, overrideCount]);

  const addYourselfUrl = `${FORM_URL}?venue=${venue.wordpressVenueParam}`;

  // Render a small grid of placeholder cards. Cap at 4 so the page
  // doesn't get visually crowded — the headline count is the source of
  // truth for "how many are here", not the card grid.
  const placeholderCount = Math.min(count ?? 3, 4);
  const placeholderCards = Array.from(
    { length: placeholderCount },
    (_, i) => i,
  );

  return (
    <>
      <div className="pt-6 pb-2 flex items-center justify-center">
        <Image
          src="/plus-none-logo.png"
          alt="Plus None"
          width={660}
          height={660}
          priority
          className="w-[330px] max-w-full h-auto"
        />
      </div>
      <div className="px-5 pt-1 pb-2 text-center">
        <p className="font-display text-[36px] tracking-[0.01em] text-ink leading-none">
          {count === null
            ? "who else is here?"
            : count === 0
              ? "be the first one"
              : count === 1
                ? "1 person is here."
                : `${count} people are here.`}
        </p>
        <p className="mt-[10px] text-[11px] tracking-[0.08em] uppercase text-muted">
          {venue.name}
        </p>
      </div>

      <div className="px-4 pt-4 pb-2 flex justify-center">
        <a
          href={addYourselfUrl}
          className="w-full max-w-md text-center rounded-full bg-cobalt hover:bg-cobalt-hover transition-colors px-7 py-[18px] font-display text-[23px] uppercase tracking-[0.06em] text-white"
        >
          {count && count > 0 ? "Add yourself to see them" : "Add yourself"}
        </a>
      </div>
      <p className="px-5 pt-3 pb-4 text-center text-[13px] leading-[1.5] text-muted">
        Plus None&apos;s private. Drop a quick selfie video and you&apos;ll see
        everyone else who&apos;s in here right now.
      </p>

      {/* Blurred placeholder cards — pure visual stand-ins, never
          hydrated with real profile data. Sit below the CTA as a tease
          of what they unlock by submitting. */}
      <div className="px-4 pt-2 pb-8">
        <div className="mx-auto max-w-md space-y-4">
          {placeholderCards.map((i) => (
            <div
              key={i}
              aria-hidden
              className="w-full aspect-[9/16] rounded-2xl bg-gradient-to-br from-stone-300 via-stone-200 to-stone-300 blur-sm"
              style={{ opacity: 0.75 - i * 0.12 }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
