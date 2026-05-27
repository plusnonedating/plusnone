"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FeedVenue } from "@/lib/venues";
import { IG_VENUE, venueSubtitle } from "@/lib/venues";
import { formUrlForVenue } from "@/lib/form";
import { getDeviceId } from "@/lib/deviceId";
import GeoVerify from "./GeoVerify";

interface Props {
  venue: FeedVenue;
}

export default function Gate({ venue }: Props) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  useEffect(() => setDeviceId(getDeviceId()), []);

  const igFallbackUrl = formUrlForVenue(IG_VENUE.label, deviceId);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-pattern opacity-30 pointer-events-none"
      />
      <section className="relative z-10 flex flex-col items-center px-5 pt-6 pb-10">
        <Image
          src="/plus-none-logo.png"
          alt="Plus None"
          width={330}
          height={330}
          priority
          className="w-[165px] h-auto mb-3.5"
        />
        <p className="text-[11px] tracking-[0.08em] uppercase text-muted mb-[18px]">
          {venueSubtitle(venue)}
        </p>
        <div className="w-full max-w-md bg-cream rounded-[18px] px-[22px] pt-7 pb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h1 className="font-display text-[38px] leading-none tracking-[0.01em] text-ink mb-3.5">
            who else here is single?
            <br />
            <span className="text-cobalt">we&apos;ll show you.</span>
          </h1>
          <p className="text-sm leading-[1.55] text-ink/85 mb-[22px]">
            Plus None is a private dating pool for the people here right now.
            Location confirms you&apos;re in the room. Resets overnight. Your ex
            isn&apos;t getting in.
          </p>
          <GeoVerify venue={venue} />
        </div>
        <a
          href={igFallbackUrl}
          className="mt-[18px] text-[13px] text-muted hover:text-cobalt"
        >
          Not at a Plus None location?{" "}
          <u className="decoration-1 underline-offset-[3px]">
            Just post me to IG &rarr;
          </u>
        </a>
      </section>
    </div>
  );
}
