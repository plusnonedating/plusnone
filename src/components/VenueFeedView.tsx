"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Submission } from "@/lib/types";
import { FORM_URL } from "@/lib/form";
import { shuffle } from "@/lib/shuffle";
import Feed from "./Feed";
import EmptyState from "./EmptyState";

const POLL_INTERVAL_MS = 30_000;

export interface FeedVenueData {
  /** Internal slug — used as a stable key for the polling effect. */
  slug: string;
  /** Display name for the venue subtitle. */
  name: string;
  /** Full venue label used as the filter key for `/api/submissions?label=…`. */
  label: string;
  /** Pre-encoded value to drop straight into the WordPress form URL's
   * `?venue=…` query param. Used by the "Add yourself" CTA. */
  wordpressVenueParam: string;
}

interface Props {
  venue: FeedVenueData;
  initialSubmissions: Submission[];
}

/**
 * Renders the venue feed: logo, "who else is here" header, the profile
 * cards, the "Add yourself" CTA pointing at the WPForms submission form,
 * the existing B2B "Add Plus None to your bar" CTA, and the dotted
 * "clear access" hint.
 *
 * This component is rendered inline on /scan once /api/locate resolves
 * a venue — it doesn't own the gate or the geolocation flow, only the
 * post-match display + polling.
 */
export default function VenueFeedView({ venue, initialSubmissions }: Props) {
  const [ordered, setOrdered] = useState<Submission[] | null>(null);
  const initialAppliedRef = useRef(false);

  useEffect(() => {
    if (initialAppliedRef.current) return;
    initialAppliedRef.current = true;
    setOrdered(shuffle(initialSubmissions));
  }, [initialSubmissions]);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const res = await fetch(
          `/api/submissions?label=${encodeURIComponent(venue.label)}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { submissions?: Submission[] };
        const fresh = data.submissions ?? [];
        if (cancelled) return;

        setOrdered((current) => {
          if (current === null) return shuffle(fresh);
          const freshById = new Map(fresh.map((s) => [s.id, s]));
          const kept: Submission[] = [];
          for (const existing of current) {
            const updated = freshById.get(existing.id);
            if (updated) kept.push(updated);
          }
          const keptIds = new Set(kept.map((s) => s.id));
          const newcomers = fresh.filter((s) => !keptIds.has(s.id));
          return [...kept, ...shuffle(newcomers)];
        });
      } catch {
        // Silent; next interval will retry.
      }
    };

    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [venue.label]);

  const addYourselfUrl = `${FORM_URL}?venue=${venue.wordpressVenueParam}`;

  if (ordered === null) {
    return (
      <div className="flex-1 px-4 py-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-full aspect-[9/16] rounded-2xl bg-ink/5 animate-pulse" />
        </div>
      </div>
    );
  }

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
          here&apos;s who else is here. go say hi.
        </p>
        <p className="mt-[10px] text-[11px] tracking-[0.08em] uppercase text-muted">
          {venue.name}
        </p>
      </div>
      {ordered.length === 0 ? <EmptyState /> : <Feed submissions={ordered} />}
      <div className="px-5 pt-2 pb-4 flex justify-center">
        <a
          href={addYourselfUrl}
          className="w-full max-w-md text-center rounded-full bg-cobalt hover:bg-cobalt-hover transition-colors px-7 py-[16px] font-display text-[20px] uppercase tracking-[0.06em] text-white"
        >
          Add yourself
        </a>
      </div>
      <div className="pb-8 pt-2 flex flex-col items-center gap-3 text-center">
        <a
          href="https://plusnone.fetewell.com/business"
          className="inline-block border-b border-ink pb-0.5 text-sm font-medium text-ink"
        >
          Add Plus None to your bar, restaurant, or event →
        </a>
      </div>
    </>
  );
}
