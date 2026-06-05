"use client";

import { useEffect, useState } from "react";
import VenueFeedView, {
  type FeedVenueData,
} from "@/components/VenueFeedView";
import BlurredFeedView from "@/components/BlurredFeedView";
import {
  clearJustSubmitted,
  isUnlocked,
  unlock,
  wasJustSubmitted,
} from "@/lib/storage";
import type { Submission } from "@/lib/types";

interface Props {
  venue: FeedVenueData;
  initialSubmissions: Submission[];
}

/**
 * Client-side gate for /[slug]. Renders the same blur-vs-feed switch
 * that ScanClient does after a geo match, minus the geolocation step.
 *
 * First paint is always blurred — SSR can't read localStorage, and we
 * don't want to flash the unlocked feed to non-submitted viewers. The
 * effect promotes to unlocked if either flag is present:
 *   - wasJustSubmitted(): the WPForms confirmation just redirected
 *     them via LandingShell. Promote them and also stamp a 24h
 *     per-slug unlock so refreshes inside the window stay unlocked.
 *   - isUnlocked(slug): a previous submission for this slug within
 *     the 24h TTL.
 */
export default function VenuePageClient({
  venue,
  initialSubmissions,
}: Props) {
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    if (wasJustSubmitted()) {
      unlock(venue.slug);
      clearJustSubmitted();
      setLocked(false);
    } else if (isUnlocked(venue.slug)) {
      setLocked(false);
    }
  }, [venue.slug]);

  if (locked) {
    return <BlurredFeedView venue={venue} />;
  }
  return (
    <VenueFeedView venue={venue} initialSubmissions={initialSubmissions} />
  );
}
