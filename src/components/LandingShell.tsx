"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { markJustSubmitted } from "@/lib/storage";
import { getDeviceId } from "@/lib/deviceId";
import IgLanding from "./IgLanding";

/**
 * The `/` route shell.
 *
 * - Ensures a device_id exists on every landing visit (functional analytics).
 * - If the URL has `?from=submission`, marks the device as having just
 *   submitted (5-minute TTL) and forwards to /scan. The fresh geo check
 *   on /scan resolves whichever venue the visitor is currently at; the
 *   just-submitted flag tells /scan to skip the blurred-preview gate.
 *
 *   This stays compatible with the existing WPForms thank-you URL
 *   (`https://plusnone.fetewell.com/?from=submission&venue=…`) — no
 *   WordPress config change needed when new Airtable venues come online.
 * - Otherwise renders Screen 3 (the public IG-only landing).
 */
export default function LandingShell() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getDeviceId();

    const url = new URL(window.location.href);
    const fromSubmission = url.searchParams.get("from") === "submission";

    if (fromSubmission) {
      markJustSubmitted();
      router.replace("/scan");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="flex-1" />;
  }

  return <IgLanding />;
}
