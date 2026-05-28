"use client";

import { useEffect, useRef } from "react";
import type { Submission } from "@/lib/types";

interface Props {
  submission: Submission;
  isAudible: boolean;
  onRequestAudible: () => void;
  onLeftView: () => void;
}

export default function ProfileCard({
  submission,
  isAudible,
  onRequestAudible,
  onLeftView,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isAudible;
    if (isAudible) {
      void video.play().catch(() => {});
    }
  }, [isAudible]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.5 && isAudible) {
            onLeftView();
          }
        }
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isAudible, onLeftView]);

  const handleTap = () => {
    onRequestAudible();
  };

  // "active" within 30 min of the most recent /[slug] visit by this device.
  // Computed at render time — Feed re-renders on every poll (every 30s), so
  // the indicator decays without needing its own timer.
  const isActive = Boolean(
    submission.lastSeen &&
      Date.now() - new Date(submission.lastSeen).getTime() <
        30 * 60 * 1000,
  );

  return (
    <article
      ref={containerRef}
      className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-ink shadow-sm"
    >
      <button
        type="button"
        onClick={handleTap}
        className="relative block w-full aspect-[9/16] bg-ink focus:outline-none"
        aria-label={isAudible ? "Mute video" : "Unmute video"}
      >
        <video
          ref={videoRef}
          src={submission.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={!isAudible}
          playsInline
          preload="metadata"
        />
        <span
          aria-hidden
          className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-cream font-medium tracking-wide"
        >
          {isAudible ? "TAP TO MUTE" : "TAP FOR SOUND"}
        </span>
        {isActive ? (
          <span
            role="status"
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] text-cream font-medium tracking-wide"
          >
            <span
              aria-hidden
              className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot"
            />
            active
          </span>
        ) : null}
      </button>
      <div className="bg-cream text-ink px-4 py-4">
        <div className="flex items-baseline gap-2">
          <h2 className="font-display text-3xl tracking-wide leading-none">
            {submission.firstName}
          </h2>
          <span className="font-display text-3xl tracking-wide leading-none text-cobalt">
            {submission.age}
          </span>
        </div>
        <dl className="mt-3 space-y-1.5 text-sm">
          <Row label="Gender" value={submission.gender} />
          {submission.interestedIn ? (
            <Row label="Interested in" value={submission.interestedIn} />
          ) : null}
          {submission.lookingFor ? (
            <Row label="Looking for" value={submission.lookingFor} />
          ) : null}
          {submission.pitch ? (
            <Row label="Ask me about" value={submission.pitch} />
          ) : null}
        </dl>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted uppercase tracking-wider text-[11px] font-semibold w-24 shrink-0 pt-0.5">
        {label}
      </dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
