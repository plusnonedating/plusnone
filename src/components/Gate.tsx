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
      <section className="relative z-10 flex flex-col items-center px-5 pt-6 pb-10 text-center">
        <Image
          src="/plus-none-logo.png"
          alt="Plus None"
          width={660}
          height={660}
          priority
          className="w-[330px] max-w-full h-auto mb-4"
        />
        <p className="text-[14px] tracking-[0.08em] uppercase text-muted mb-[22px]">
          {venueSubtitle(venue)}
        </p>
        <div className="w-full max-w-md bg-cream rounded-[18px] px-[28px] pt-9 pb-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h1 className="font-display text-[48px] leading-none tracking-[0.01em] text-ink mb-[18px]">
            who else here is single?
            <br />
            <span className="text-cobalt">we&apos;ll show you.</span>
          </h1>
          <p className="text-[18px] leading-[1.55] text-ink/85 mb-7">
            Plus None is a private dating pool for the people here right now.
            Location confirms you&apos;re in the room. Resets overnight. Your ex
            isn&apos;t getting in.
          </p>
          <GeoVerify venue={venue} />
        </div>
        <a
          href={igFallbackUrl}
          className="mt-[22px] text-[16px] text-muted hover:text-cobalt"
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
