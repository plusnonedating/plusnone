"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { FeedVenue } from "@/lib/venues";
import { isUnlocked, unlock } from "@/lib/storage";
import Gate from "./Gate";

type GateState = "checking" | "locked" | "unlocked";

interface Props {
  venue: FeedVenue;
  children: ReactNode;
}

export default function GateGuard({ venue, children }: Props) {
  const [state, setState] = useState<GateState>("checking");

  useEffect(() => {
    if (isUnlocked(venue.slug)) {
      unlock(venue.slug);
      setState("unlocked");
    } else {
      setState("locked");
    }
  }, [venue.slug]);

  if (state === "checking") {
    return <div className="flex-1" />;
  }

  if (state === "locked") {
    return <Gate venue={venue} />;
  }

  return <>{children}</>;
}
