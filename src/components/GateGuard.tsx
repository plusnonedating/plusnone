"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Slug } from "@/lib/venues";
import { isUnlocked, unlock } from "@/lib/storage";
import Gate from "./Gate";

type GateState = "checking" | "locked" | "unlocked";

interface Props {
  slug: Slug;
  children: ReactNode;
}

export default function GateGuard({ slug, children }: Props) {
  const [state, setState] = useState<GateState>("checking");

  useEffect(() => {
    if (isUnlocked(slug)) {
      unlock(slug);
      setState("unlocked");
    } else {
      setState("locked");
    }
  }, [slug]);

  if (state === "checking") {
    return <div className="flex-1" />;
  }

  if (state === "locked") {
    return <Gate />;
  }

  return <>{children}</>;
}
