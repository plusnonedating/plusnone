"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LocationGate from "@/components/LocationGate";
import VenueFeedView, {
  type FeedVenueData,
} from "@/components/VenueFeedView";
import { FORM_URL } from "@/lib/form";
import type { Submission } from "@/lib/types";
import DebugPanel from "./DebugPanel";

const GEO_TIMEOUT_MS = 8000;

type Phase = "idle" | "locating" | "denied";

interface LocateResponse {
  slug: string | null;
  venue?: {
    slug: string;
    name: string;
    label: string;
    wordpressVenueParam: string;
  };
  _debug?: {
    received: { lat: number; lng: number };
    activeVenueCount: number;
    error?: "airtable-fetch-failed";
    errorMessage?: string;
    venues: Array<{
      slug: string;
      label: string;
      lat: number;
      lng: number;
      radiusMeters: number;
      distanceMeters: number;
      withinRadius: boolean;
    }>;
  };
}

/**
 * Drives the /scan flow:
 *
 *   1. Renders <LocationGate> with an "Allow location" button.
 *   2. On tap, requests navigator.geolocation. If denied / timed out /
 *      unavailable, router.push('/ig').
 *   3. If geo resolves, POSTs { lat, lng } to /api/locate. If the
 *      response carries a venue, fetches that venue's submissions via
 *      /api/submissions?label=… and renders <VenueFeedView> inline.
 *      The URL stays /scan throughout — we never push a venue slug
 *      into the URL.
 *   4. If /api/locate returns slug=null (visitor outside every active
 *      venue's geofence, OR Airtable failed and the server bailed
 *      gracefully), router.push('/ig').
 *
 * Submissions are intentionally fetched client-side rather than as
 * part of the /api/locate response — keeps each endpoint's
 * responsibility narrow, and the existing /api/submissions polling in
 * VenueFeedView reuses the same fetch path for refreshes.
 */
export default function ScanClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debug = searchParams?.get("debug") === "1";
  const [phase, setPhase] = useState<Phase>("idle");
  const [venue, setVenue] = useState<FeedVenueData | null>(null);
  const [initialSubmissions, setInitialSubmissions] = useState<Submission[]>(
    [],
  );
  const [debugResult, setDebugResult] = useState<{
    matchedSlug: string | null;
    info: NonNullable<LocateResponse["_debug"]>;
  } | null>(null);

  // The IG fallback link gets the page-level IG venue param so the
  // WPForm still knows it came from a scan attempt rather than an
  // organic IG landing.
  const igFallbackUrl = `${FORM_URL}?venue=${encodeURIComponent("Not at a Fêtewell event right now")}`;

  const redirectToIg = useCallback(() => {
    router.push("/ig");
  }, [router]);

  const onAllow = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      redirectToIg();
      return;
    }
    setPhase("locating");

    let resolved = false;
    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      setPhase("denied");
      redirectToIg();
    }, GEO_TIMEOUT_MS + 500);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);

        try {
          const locateRes = await fetch(
            `/api/locate${debug ? "?debug=1" : ""}`,
            {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              }),
            },
          );

          if (!locateRes.ok) {
            if (debug) {
              // In debug mode, show whatever we got back even if the API
              // errored — the tester can read the status code back.
              setDebugResult({
                matchedSlug: null,
                info: {
                  received: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  },
                  activeVenueCount: 0,
                  error: "airtable-fetch-failed",
                  venues: [],
                },
              });
              return;
            }
            redirectToIg();
            return;
          }

          const data = (await locateRes.json()) as LocateResponse;

          // Debug mode short-circuits the normal flow — render the
          // DebugPanel with the full diagnostic instead of redirecting
          // or showing the feed.
          if (debug && data._debug) {
            setDebugResult({
              matchedSlug: data.slug,
              info: data._debug,
            });
            return;
          }

          if (!data.slug || !data.venue) {
            redirectToIg();
            return;
          }

          // Fetch initial submissions for the matched venue. If this
          // fails, we still render the feed empty rather than redirecting
          // — the 30s poll in VenueFeedView will retry.
          let submissions: Submission[] = [];
          try {
            const subsRes = await fetch(
              `/api/submissions?label=${encodeURIComponent(data.venue.label)}`,
              { cache: "no-store" },
            );
            if (subsRes.ok) {
              const subsJson = (await subsRes.json()) as {
                submissions?: Submission[];
              };
              submissions = subsJson.submissions ?? [];
            }
          } catch {
            // Soft-fail; the feed renders empty and polls.
          }

          setVenue({
            slug: data.venue.slug,
            name: data.venue.name,
            label: data.venue.label,
            wordpressVenueParam: data.venue.wordpressVenueParam,
          });
          setInitialSubmissions(submissions);
        } catch {
          redirectToIg();
        }
      },
      () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        setPhase("denied");
        redirectToIg();
      },
      {
        timeout: GEO_TIMEOUT_MS,
        enableHighAccuracy: false,
        maximumAge: 60_000,
      },
    );
  }, [redirectToIg]);

  if (debugResult) {
    return (
      <DebugPanel
        matchedSlug={debugResult.matchedSlug}
        debug={debugResult.info}
      />
    );
  }

  if (venue) {
    return (
      <VenueFeedView venue={venue} initialSubmissions={initialSubmissions} />
    );
  }

  return (
    <LocationGate
      phase={phase}
      onAllow={onAllow}
      igFallbackUrl={igFallbackUrl}
    />
  );
}
