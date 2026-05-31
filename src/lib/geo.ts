import { FEED_VENUES, type FeedVenue } from "./venues";

const EARTH_RADIUS_M = 6_371_000;

export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

export function findNearestVenue(
  lat: number,
  lng: number,
  maxMeters: number,
): FeedVenue | null {
  let best: { venue: FeedVenue; meters: number } | null = null;
  for (const v of FEED_VENUES) {
    const d = haversineMeters(lat, lng, v.lat, v.lng);
    if (d <= maxMeters && (!best || d < best.meters)) {
      best = { venue: v, meters: d };
    }
  }
  return best?.venue ?? null;
}

/**
 * Generic version of {@link findNearestVenue} that accepts any list of
 * geofenced points with per-point radii. Used by /api/locate, where the
 * venue list and radii are fetched live from Airtable rather than
 * hardcoded.
 *
 * Returns the closest point whose own radius covers the visitor (i.e.
 * `distance ≤ point.radiusMeters`). Returns null if no point covers the
 * visitor.
 */
export function findNearestInList<
  T extends { lat: number; lng: number; radiusMeters: number },
>(lat: number, lng: number, points: T[]): T | null {
  let best: { point: T; meters: number } | null = null;
  for (const p of points) {
    const d = haversineMeters(lat, lng, p.lat, p.lng);
    if (d <= p.radiusMeters && (!best || d < best.meters)) {
      best = { point: p, meters: d };
    }
  }
  return best?.point ?? null;
}
