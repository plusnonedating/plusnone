"use client";

import { useEffect, useState } from "react";
import { feedVenueBySlug, type FeedVenue } from "@/lib/venues";

const VISIBLE_MS = 4000;
const FADE_MS = 300;

interface Props {
  currentVenue: FeedVenue;
}

/**
 * Pill toast shown at the top of /[slug] when the user landed here via the
 * cross-venue redirect from GeoVerify (URL has ?moved_from=<other-slug>).
 *
 * Strips the URL param on mount, displays for ~4s, fades out and unmounts.
 */
export default function CrossVenueToast({ currentVenue }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const movedFrom = url.searchParams.get("moved_from");
    if (!movedFrom) return;

    // strip the param immediately so refresh doesn't re-trigger.
    url.searchParams.delete("moved_from");
    const cleanPath =
      url.pathname +
      (url.searchParams.toString() ? `?${url.searchParams}` : "") +
      url.hash;
    window.history.replaceState({}, "", cleanPath);

    const from = feedVenueBySlug(movedFrom);
    if (!from) return;

    setMessage(
      `you're at ${currentVenue.name}, not ${from.name} — moved you here`,
    );

    const fadeTimer = setTimeout(
      () => setFading(true),
      VISIBLE_MS - FADE_MS,
    );
    const removeTimer = setTimeout(() => setMessage(null), VISIBLE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [currentVenue]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] bg-ink/95 text-cream text-[13px] leading-snug px-4 py-2.5 rounded-full shadow-lg transition-opacity duration-300"
      style={{ opacity: fading ? 0 : 1 }}
    >
      {message}
    </div>
  );
}
