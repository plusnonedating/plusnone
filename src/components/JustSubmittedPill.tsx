"use client";

import { useEffect, useState } from "react";

const VISIBLE_MS = 4000;
const FADE_MS = 300;

/**
 * Confirmation pill shown on /ig when the user just submitted via the
 * IG-only path. Detects ?just_submitted=1 (set by LandingShell after an
 * IG submission), strips it, shows the pill for ~4s, then fades out.
 */
export default function JustSubmittedPill() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("just_submitted") !== "1") return;

    url.searchParams.delete("just_submitted");
    const cleanPath =
      url.pathname +
      (url.searchParams.toString() ? `?${url.searchParams}` : "") +
      url.hash;
    window.history.replaceState({}, "", cleanPath);

    setVisible(true);

    const fadeTimer = setTimeout(
      () => setFading(true),
      VISIBLE_MS - FADE_MS,
    );
    const hideTimer = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] bg-cobalt text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-lg transition-opacity duration-300"
      style={{ opacity: fading ? 0 : 1 }}
    >
      ✓ you&apos;re in — we&apos;ll post you to @plusnonedating soon
    </div>
  );
}
