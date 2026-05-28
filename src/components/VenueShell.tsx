"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Submission } from "@/lib/types";
import type { FeedVenue } from "@/lib/venues";
import { venueSubtitle } from "@/lib/venues";
import { shuffle } from "@/lib/shuffle";
import { lock } from "@/lib/storage";
import GateGuard from "./GateGuard";
import Feed from "./Feed";
import EmptyState from "./EmptyState";
import CrossVenueToast from "./CrossVenueToast";

const POLL_INTERVAL_MS = 30_000;

interface Props {
  venue: FeedVenue;
  initialSubmissions: Submission[];
}

export default function VenueShell({ venue, initialSubmissions }: Props) {
  return (
    <>
      <CrossVenueToast currentVenue={venue} />
      <GateGuard venue={venue}>
        <VenueFeed venue={venue} initialSubmissions={initialSubmissions} />
      </GateGuard>
    </>
  );
}

function VenueFeed({ venue, initialSubmissions }: Props) {
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
          `/api/submissions?slug=${encodeURIComponent(venue.slug)}`,
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
  }, [venue.slug]);

  const handleClearAccess = () => {
    lock(venue.slug);
    window.location.href = "/";
  };

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
          width={330}
          height={330}
          priority
          className="w-[165px] h-auto"
        />
      </div>
      <div className="px-5 pt-1 pb-2 text-center">
        <p className="font-display text-[36px] tracking-[0.01em] text-ink leading-none">
          here&apos;s who else is here. go say hi.
        </p>
        <p className="mt-[10px] text-[11px] tracking-[0.08em] uppercase text-muted">
          {venueSubtitle(venue)}
        </p>
      </div>
      {ordered.length === 0 ? (
        <EmptyState />
      ) : (
        <Feed submissions={ordered} />
      )}
      <div className="pb-8 pt-4 text-center">
        <button
          type="button"
          onClick={handleClearAccess}
          className="text-xs text-muted underline decoration-dotted hover:text-cobalt"
        >
          submitted by mistake? clear your access
        </button>
      </div>
    </>
  );
}
