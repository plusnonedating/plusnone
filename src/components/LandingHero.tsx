"use client";

import { IG_VENUE } from "@/lib/venues";
import { formUrlForVenue } from "@/lib/form";

interface Props {
  onAllowLocation: () => void;
  deviceId: string | null;
}

export default function LandingHero({ onAllowLocation, deviceId }: Props) {
  const igFormUrl = formUrlForVenue(IG_VENUE.label, deviceId);

  return (
    <section className="flex-1 flex flex-col items-center px-6 pt-2 pb-12 text-center">
      <p className="font-display text-4xl sm:text-5xl tracking-wide text-ink leading-[1.05] max-w-md">
        who else here is single? we&apos;ll show you.
      </p>
      <p className="mt-6 max-w-sm text-base text-muted leading-relaxed">
        Plus None is a private dating pool for the people here right now. Location confirms you&apos;re in the room. Resets overnight. Your ex isn&apos;t getting in.
      </p>
      <button
        type="button"
        onClick={onAllowLocation}
        className="mt-10 inline-flex items-center justify-center rounded-full bg-cobalt px-10 py-4 text-cream text-sm font-semibold uppercase tracking-wider hover:bg-cobalt-hover transition-colors"
      >
        Allow location
      </button>
      <p className="mt-6 text-sm text-muted">
        Not at a venue?{" "}
        <a
          href={igFormUrl}
          className="text-cobalt hover:text-cobalt-hover underline decoration-dotted"
        >
          Just post me to IG &rarr;
        </a>
      </p>
    </section>
  );
}
