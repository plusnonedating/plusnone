"use client";

import { useEffect, useState } from "react";
import VenueFeedView, {
  type FeedVenueData,
} from "@/components/VenueFeedView";
import BlurredFeedView from "@/components/BlurredFeedView";
import {
  clearJustSubmitted,
  isAdmin,
  isUnlocked,
  setAdmin,
  unlock,
  wasJustSubmitted,
} from "@/lib/storage";
import type { Submission } from "@/lib/types";

interface Props {
  venue: FeedVenueData;
  initialSubmissions: Submission[];
  /** True iff the server validated `?admin=<token>` against ADMIN_TOKEN. */
  adminGranted: boolean;
}

/**
 * Client-side gate for /[slug]. Renders the same blur-vs-feed switch
 * that ScanClient does after a geo match, minus the geolocation step.
 *
 * First paint is always blurred — SSR can't read localStorage, and we
 * don't want to flash the unlocked feed to non-submitted viewers. The
 * effect promotes to unlocked if any of these is true:
 *   - adminGranted (server passed the ?admin=<token> check): persist
 *     the founder admin flag for 30d so subsequent visits skip the
 *     gate even without the token.
 *   - isAdmin() (previously-stamped founder flag): straight to feed.
 *   - wasJustSubmitted(): the WPForms confirmation just redirected
 *     them via LandingShell. Promote them and also stamp a 24h
 *     per-slug unlock so refreshes inside the window stay unlocked.
 *   - isUnlocked(slug): a previous submission for this slug within
 *     the 24h TTL.
 */
export default function VenuePageClient({
  venue,
  initialSubmissions,
  adminGranted,
}: Props) {
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    if (adminGranted) {
      // Server already validated the token. Stamp the flag so future
      // visits without the query still bypass the gate.
      setAdmin();
      setLocked(false);
      return;
    }
    if (isAdmin()) {
      setLocked(false);
      return;
    }
    if (wasJustSubmitted()) {
      unlock(venue.slug);
      clearJustSubmitted();
      setLocked(false);
      return;
    }
    if (isUnlocked(venue.slug)) {
      setLocked(false);
    }
  }, [venue.slug, adminGranted]);

  if (locked) {
    return <BlurredFeedView venue={venue} />;
  }
  return (
    <VenueFeedView venue={venue} initialSubmissions={initialSubmissions} />
  );
}
