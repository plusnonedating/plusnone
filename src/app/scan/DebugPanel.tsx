"use client";

interface DebugInfo {
  received: { lat: number; lng: number };
  activeVenueCount: number;
  error?: "airtable-fetch-failed";
  venues: Array<{
    slug: string;
    label: string;
    lat: number;
    lng: number;
    radiusMeters: number;
    distanceMeters: number;
    withinRadius: boolean;
  }>;
}

interface Props {
  matchedSlug: string | null;
  debug: DebugInfo;
}

/**
 * Field-diagnostic readout rendered when /scan is loaded with `?debug=1`.
 *
 * Shows the raw lat/lng we received from the browser, then a sorted
 * table of every Active Business venue with the haversine distance and
 * whether the visitor's coords fall inside that venue's radius. A tester
 * standing inside a venue can read this aloud — "got 39.41, -77.41 →
 * nearest cb at 47m, inside 500m → matched cb" — and we can tell at a
 * glance whether the bug is GPS accuracy, the geofence center, the
 * radius, or the Status filter (activeVenueCount drops to 0).
 *
 * Visual is intentionally plain — this is a developer tool, not a
 * customer-facing screen.
 */
export default function DebugPanel({ matchedSlug, debug }: Props) {
  return (
    <div className="min-h-screen bg-white px-4 py-6 text-sm text-stone-900">
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            /scan debug mode
          </p>
          <p className="mt-1 font-mono text-base">
            decision:{" "}
            <span className="font-semibold">
              {matchedSlug
                ? `matched ${matchedSlug}`
                : debug.error
                  ? `no-match (${debug.error})`
                  : "no-match"}
            </span>
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Got from browser
          </p>
          <p className="mt-1 font-mono">
            lat = {debug.received.lat.toFixed(6)}
          </p>
          <p className="font-mono">lng = {debug.received.lng.toFixed(6)}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Active venues ({debug.activeVenueCount})
          </p>
          {debug.activeVenueCount === 0 ? (
            <p className="mt-1 font-mono text-stone-700">
              {debug.error === "airtable-fetch-failed"
                ? "Airtable fetch failed — check API key / base ID / table name."
                : "Zero active rows returned. Check the Status filter or the Business table itself."}
            </p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead className="text-stone-500">
                  <tr className="border-b border-stone-200 text-left">
                    <th className="py-2 pr-3 font-medium">slug</th>
                    <th className="py-2 pr-3 font-medium">distance</th>
                    <th className="py-2 pr-3 font-medium">radius</th>
                    <th className="py-2 pr-3 font-medium">inside?</th>
                    <th className="py-2 font-medium">center (lat, lng)</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {debug.venues.map((v) => (
                    <tr
                      key={v.slug}
                      className={
                        v.withinRadius
                          ? "border-b border-stone-100 bg-emerald-50"
                          : "border-b border-stone-100"
                      }
                    >
                      <td className="py-2 pr-3">{v.slug}</td>
                      <td className="py-2 pr-3">{v.distanceMeters}m</td>
                      <td className="py-2 pr-3">{v.radiusMeters}m</td>
                      <td className="py-2 pr-3">
                        {v.withinRadius ? "yes" : "no"}
                      </td>
                      <td className="py-2 text-stone-600">
                        {v.lat.toFixed(6)}, {v.lng.toFixed(6)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-xs leading-relaxed text-stone-500">
          Sorted nearest → farthest. A row is green when the visitor&apos;s
          coords are within that venue&apos;s geofence radius. If the
          intended venue shows distance &gt; radius, GPS landed off-center
          or the venue radius is too small. If activeVenueCount = 0, the
          Airtable filter didn&apos;t return that venue — check Status =
          &quot;Active&quot; on the row.
        </div>
      </div>
    </div>
  );
}
