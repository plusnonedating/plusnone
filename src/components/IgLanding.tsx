"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/deviceId";
import { formUrlForVenue } from "@/lib/form";
import { IG_VENUE } from "@/lib/venues";

/**
 * Screen 3 — IG-only landing.
 * Public, ungated. Rendered at / (for visitors with no venue context) and at
 * /ig (after an IG-only submission, or as a direct entry).
 */
export default function IgLanding() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  useEffect(() => setDeviceId(getDeviceId()), []);

  const formUrl = formUrlForVenue(IG_VENUE.label, deviceId);

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
          width={180}
          height={180}
          priority
          className="w-[90px] h-auto mb-3"
        />
        <div className="w-full max-w-md bg-cream rounded-[18px] px-[22px] pt-7 pb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-ink leading-[1.45] mb-3.5">
            A dating account where strangers shoot their shot in your comments.
          </p>
          <h1 className="font-display text-[30px] leading-none tracking-[0.01em] text-ink mb-3.5">
            Get matched in our comment section.
          </h1>
          <p className="text-sm leading-[1.55] text-ink/85 mb-4">
            Drop a 15-sec selfie. Tell us what someone should ask you about.
            We&apos;ll post it to @plusnonedating.
          </p>
          <div className="relative z-[1] flex justify-center -mb-3.5">
            <Image
              src="/cat-cool.svg"
              alt=""
              width={86}
              height={86}
              priority
              className="block"
            />
          </div>
          <a
            href={formUrl}
            className="block w-full rounded-full bg-cobalt hover:bg-cobalt-hover transition-colors px-6 py-3.5 font-display text-lg uppercase tracking-[0.06em] text-white text-center"
          >
            Shoot your shot
          </a>
        </div>
        <div className="w-full max-w-md bg-cream rounded-[14px] px-[18px] py-3.5 mt-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-[13px] leading-[1.4] text-ink">
            Not at a Plus None location? You&apos;re in the right place.
          </p>
          <p className="text-[13px] leading-[1.4] text-ink mt-[10px] pt-[10px] border-t border-ink/10">
            Run a bar, restaurant, or venue?{" "}
            <a
              href="mailto:hello@fetewell.com"
              className="text-cobalt font-medium underline underline-offset-[2px]"
            >
              Add yours &rarr;
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
