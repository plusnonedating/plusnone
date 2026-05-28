"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/deviceId";
import { formUrlForVenue } from "@/lib/form";
import { IG_VENUE } from "@/lib/venues";
import JustSubmittedPill from "./JustSubmittedPill";

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
      <JustSubmittedPill />
      <div
        aria-hidden
        className="absolute inset-0 bg-pattern opacity-30 pointer-events-none"
      />
      <section className="relative z-10 flex flex-col items-center px-5 pt-6 pb-10 text-center">
        <div className="bg-cream rounded-[18px] p-4 mb-4 w-fit shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <Image
            src="/plus-none-logo.png"
            alt="Plus None"
            width={360}
            height={360}
            priority
            className="w-[210px] h-auto block"
          />
        </div>
        <div className="w-full max-w-md bg-cream rounded-[18px] px-[28px] pt-9 pb-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-[16px] font-medium uppercase tracking-[0.06em] text-ink leading-[1.45] mb-[18px]">
            A dating account where strangers shoot their shot in your comments.
          </p>
          <h1 className="font-display text-[38px] leading-none tracking-[0.01em] text-ink mb-[18px]">
            Get matched in our comment section.
          </h1>
          <p className="text-[18px] leading-[1.55] text-ink/85 mb-5">
            Drop a 15-sec selfie. Tell us what someone should ask you about.
            We&apos;ll post it to @plusnonedating.
          </p>
          <div className="relative z-[1] flex justify-center -mb-4">
            <Image
              src="/cat-cool.svg"
              alt=""
              width={108}
              height={108}
              priority
              className="block"
            />
          </div>
          <a
            href={formUrl}
            className="block w-full rounded-full bg-cobalt hover:bg-cobalt-hover transition-colors px-7 py-[18px] font-display text-[23px] uppercase tracking-[0.06em] text-white text-center"
          >
            Shoot your shot
          </a>
        </div>
        <div className="w-full max-w-md bg-cream rounded-[14px] px-[22px] py-[18px] mt-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-[16px] leading-[1.4] text-ink">
            Not at a Plus None location? You&apos;re in the right place.
          </p>
          <p className="text-[16px] leading-[1.4] text-ink mt-[12px] pt-[12px] border-t border-ink/10">
            Run a bar, restaurant, or venue?{" "}
            <a
              href="mailto:plusnone@fetewell.com"
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
