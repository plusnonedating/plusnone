"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { unlock } from "@/lib/storage";
import { slugFromLabel } from "@/lib/venues";
import { getDeviceId } from "@/lib/deviceId";
import IgLanding from "./IgLanding";

/**
 * The / route shell.
 *
 * - Ensures a device_id exists on every landing visit (functional analytics).
 * - If the URL has `?from=submission&venue=…`, unlocks the matching slug and
 *   redirects to that page (so post-submission flow ends up at the venue feed
 *   or the IG landing).
 * - Otherwise renders Screen 3 (the public IG-only landing).
 *
 * Geo verification no longer happens here — that moved to GeoVerify on /[slug].
 */
export default function LandingShell() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getDeviceId();

    const url = new URL(window.location.href);
    const fromSubmission = url.searchParams.get("from") === "submission";
    const venueParam = url.searchParams.get("venue");

    if (fromSubmission) {
      const slug = slugFromLabel(venueParam);
      unlock(slug);
      // For the IG label, pass a flag so the destination shows the
      // "✓ you're in" confirmation pill. For feed venues the unlocked
      // VenueShell is enough acknowledgement.
      const dest = slug === "ig" ? "/ig?just_submitted=1" : `/${slug}`;
      router.replace(dest);
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="flex-1" />;
  }

  return <IgLanding />;
}
