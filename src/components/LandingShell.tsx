"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { unlock } from "@/lib/storage";
import { slugFromLabel, IG_VENUE } from "@/lib/venues";
import { findNearestVenue } from "@/lib/geo";
import { getDeviceId } from "@/lib/deviceId";
import { formUrlForVenue } from "@/lib/form";
import LandingHero from "./LandingHero";

type Phase =
  | "checking"
  | "hero"
  | "locating"
  | "redirecting"
  | "location-needed";

const GEO_TIMEOUT_MS = 8000;
const VENUE_RADIUS_M = 500;

export default function LandingShell() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("checking");
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const attemptGeolocation = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setPhase("location-needed");
      return;
    }

    setPhase("locating");

    let resolved = false;
    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      setPhase("location-needed");
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
        const venueLabel = nearest ? nearest.label : IG_VENUE.label;
        setPhase("redirecting");
        // Pull the latest device_id at click-time in case it was created
        // between hero mount and button tap.
        window.location.href = formUrlForVenue(venueLabel, getDeviceId());
      },
      () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        setPhase("location-needed");
      },
      {
        timeout: GEO_TIMEOUT_MS,
        enableHighAccuracy: false,
        maximumAge: 60_000,
      },
    );
  }, []);

  useEffect(() => {
    // Ensure an anonymous device_id exists on every landing-page load
    // (functional analytics; see lib/deviceId.ts for scope).
    setDeviceId(getDeviceId());

    const url = new URL(window.location.href);
    const fromSubmission = url.searchParams.get("from") === "submission";
    const venueParam = url.searchParams.get("venue");

    if (fromSubmission) {
      const slug = slugFromLabel(venueParam);
      unlock(slug);
      router.replace(`/${slug}`);
      return;
    }

    setPhase("hero");
  }, [router]);

  if (phase === "hero") {
    return (
      <LandingHero
        onAllowLocation={attemptGeolocation}
        deviceId={deviceId}
      />
    );
  }

  if (phase === "location-needed") {
    // Transitional fallback — full IG-only landing replaces this in a later
    // commit on this branch. Keeps the build green.
    return (
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <p className="font-display text-5xl tracking-wide text-ink">we can&apos;t find you</p>
        <button
          type="button"
          onClick={attemptGeolocation}
          className="mt-8 rounded-full bg-cobalt px-8 py-4 text-white font-display tracking-wider uppercase"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 text-sm tracking-wide text-muted">
      {phase === "locating"
        ? "finding your venue…"
        : phase === "redirecting"
          ? "redirecting…"
          : ""}
    </div>
  );
}
