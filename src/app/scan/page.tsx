import type { Metadata } from "next";
import ScanClient from "./ScanClient";

export const metadata: Metadata = {
  title: "Plus None",
  description:
    "Single? Allow location to see who else is here right now. No app, no download, no messaging — just IRL connections.",
};

/**
 * Single QR-code destination for all Plus None venues.
 *
 * Replaces the previous one-route-per-venue setup (/cb, /msb, /csq,
 * /sbw — each with a hardcoded geofence). Now: visitor scans a QR
 * code → lands here → allows location → POST /api/locate → if a venue's
 * geofence covers them, the feed for that venue renders inline. If no
 * geofence covers them (or geo fails / is denied), they get pushed to
 * /ig as a fallback.
 *
 * Venue geofences are sourced live from the Airtable Partners table —
 * adding a new venue is a row in Airtable, not a code deploy.
 *
 * QR codes are an operational concern (Kate updates the printed signage
 * to point here); the previous /cb /msb /csq /sbw URLs are 308'd in
 * next.config so old printed QRs still work.
 */
export default function ScanPage() {
  return <ScanClient />;
}
