"use client";

import { IG_VENUE } from "@/lib/venues";
import { formUrlForVenue } from "@/lib/form";

interface Props {
  onTryAgain: () => void;
  deviceId: string | null;
}

export default function LocationNeeded({ onTryAgain, deviceId }: Props) {
  const igFormUrl = formUrlForVenue(IG_VENUE.label, deviceId);

  return (
    <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <p className="font-display text-5xl sm:text-6xl tracking-wide text-ink leading-none">
        we can&apos;t find you
      </p>
      <p className="mt-5 max-w-sm text-base text-muted leading-relaxed">
        turn on location to see who&apos;s here, or submit for IG only
      </p>
      <div className="mt-10 flex flex-col gap-3 w-full max-w-xs">
        <button
          type="button"
          onClick={onTryAgain}
          className="rounded-full bg-cobalt px-8 py-4 text-cream text-base font-medium hover:bg-cobalt-hover transition-colors"
        >
          Try again
        </button>
        <a
          href={igFormUrl}
          className="rounded-full border border-ink/15 px-8 py-4 text-ink text-base font-medium hover:bg-ink/5 transition-colors"
        >
          Submit for IG only
        </a>
      </div>
    </section>
  );
}
