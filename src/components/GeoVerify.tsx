"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { FeedVenue } from "@/lib/venues";
import { IG_VENUE } from "@/lib/venues";
import { findNearestVenue } from "@/lib/geo";
import { getDeviceId } from "@/lib/deviceId";
import { formUrlForVenue } from "@/lib/form";

const GEO_TIMEOUT_MS = 8000;
const VENUE_RADIUS_M = 500;

type Phase = "idle" | "locating" | "wrong-location";

interface Props {
  venue: FeedVenue;
}

/**
 * Inline geolocation prompt rendered inside the venue gate.
 * Behaviour:
 * - matches current slug's venue → redirect to form prefilled with venue + device_id
 * - matches a DIFFERENT feed venue → router.replace to that slug with ?moved_from=<current>
 *   so the destination page can show a "moved you here" toast.
 * - no match or geo denied/timeout → swap to a "we can't find you" panel with retry +
 *   "Submit for IG only" escape hatch.
 */
export default function GeoVerify({ venue }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");

  const attempt = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setPhase("wrong-location");
      return;
    }
    setPhase("locating");

    let resolved = false;
    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      setPhase("wrong-location");
    }, GEO_TIMEOUT_MS + 500);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        const nearest = findNearestVenue(
          pos.coords.latitude,
          pos.coords.longitude,
          VENUE_RADIUS_M,
        );
        if (!nearest) {
          setPhase("wrong-location");
          return;
        }
        if (nearest.slug === venue.slug) {
          window.location.href = formUrlForVenue(venue.label, getDeviceId());
        } else {
          router.replace(`/${nearest.slug}?moved_from=${venue.slug}`);
        }
      },
      () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        setPhase("wrong-location");
      },
      {
        timeout: GEO_TIMEOUT_MS,
        enableHighAccuracy: false,
        maximumAge: 60_000,
      },
    );
  }, [router, venue]);

  if (phase === "wrong-location") {
    const igFallback = formUrlForVenue(IG_VENUE.label, getDeviceId());
    return (
      <div className="text-center">
        <p className="text-sm text-ink/85 leading-snug mb-4">
          We can&apos;t confirm you&apos;re at {venue.name}. Make sure location is on,
          or skip ahead to IG.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={attempt}
            className="w-full rounded-full bg-cobalt hover:bg-cobalt-hover transition-colors px-6 py-3.5 font-display text-lg uppercase tracking-[0.06em] text-white"
          >
            Try again
          </button>
          <a
            href={igFallback}
            className="w-full text-center rounded-full border border-ink/15 px-6 py-3.5 text-ink text-sm font-medium hover:bg-ink/5 transition-colors"
          >
            Submit for IG only
          </a>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={attempt}
      disabled={phase === "locating"}
      className="w-full rounded-full bg-cobalt hover:bg-cobalt-hover transition-colors px-6 py-3.5 font-display text-lg uppercase tracking-[0.06em] text-white disabled:opacity-70"
    >
      {phase === "locating" ? "Finding you…" : "Allow location"}
    </button>
  );
}
