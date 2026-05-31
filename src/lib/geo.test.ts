import { describe, expect, it } from "vitest";
import { haversineMeters, findNearestInList } from "./geo";

interface TestPoint {
  slug: string;
  lat: number;
  lng: number;
  radiusMeters: number;
}

// Lat/lng values borrowed from the seeded venues so the math is rooted
// in real-world distances rather than abstract decimals.
const CITIZENS_BALLROOM: TestPoint = {
  slug: "cb",
  lat: 39.4143,
  lng: -77.4105,
  radiusMeters: 50,
};
const MAIN_ST_BALLROOM: TestPoint = {
  slug: "msb",
  lat: 39.2658,
  lng: -76.7973,
  radiusMeters: 50,
};
const CONTINENTAL_SQUARE: TestPoint = {
  slug: "csq",
  lat: 39.9626,
  lng: -76.7277,
  radiusMeters: 50,
};

describe("haversineMeters", () => {
  it("returns 0 for identical coordinates", () => {
    expect(
      haversineMeters(39.4143, -77.4105, 39.4143, -77.4105),
    ).toBeCloseTo(0, 6);
  });

  it("matches a known distance between two cities (Frederick → Ellicott City ≈ 53 km)", () => {
    // Frederick MD to Ellicott City MD — straight-line, ~53–55 km.
    const meters = haversineMeters(
      CITIZENS_BALLROOM.lat,
      CITIZENS_BALLROOM.lng,
      MAIN_ST_BALLROOM.lat,
      MAIN_ST_BALLROOM.lng,
    );
    expect(meters / 1000).toBeGreaterThan(52);
    expect(meters / 1000).toBeLessThan(56);
  });

  it("is symmetric (A→B == B→A)", () => {
    const ab = haversineMeters(39.4143, -77.4105, 39.2658, -76.7973);
    const ba = haversineMeters(39.2658, -76.7973, 39.4143, -77.4105);
    expect(ab).toBeCloseTo(ba, 6);
  });

  it("handles a small distance accurately (~10m via lat shift)", () => {
    // 1° of latitude ≈ 111 km at the equator, ≈ 110.6 km at 40° N.
    // Shifting ~0.00009° should give ~10 meters.
    const meters = haversineMeters(39.4143, -77.4105, 39.41439, -77.4105);
    expect(meters).toBeGreaterThan(9);
    expect(meters).toBeLessThan(11);
  });
});

describe("findNearestInList", () => {
  const venues = [CITIZENS_BALLROOM, MAIN_ST_BALLROOM, CONTINENTAL_SQUARE];

  it("returns the venue when visitor is exactly at its center", () => {
    const match = findNearestInList(
      CITIZENS_BALLROOM.lat,
      CITIZENS_BALLROOM.lng,
      venues,
    );
    expect(match?.slug).toBe("cb");
  });

  it("returns the venue when visitor is inside its radius (within ~20m)", () => {
    // Shift ~10m north — still well inside the 50m radius.
    const match = findNearestInList(
      CITIZENS_BALLROOM.lat + 0.00009,
      CITIZENS_BALLROOM.lng,
      venues,
    );
    expect(match?.slug).toBe("cb");
  });

  it("returns null when visitor is outside every venue's radius", () => {
    // ~500m north of Citizens Ballroom — well outside its 50m radius and
    // hundreds of kilometers from the others.
    const match = findNearestInList(
      CITIZENS_BALLROOM.lat + 0.0045,
      CITIZENS_BALLROOM.lng,
      venues,
    );
    expect(match).toBeNull();
  });

  it("returns null when given an empty venue list (Airtable returned no Active rows)", () => {
    const match = findNearestInList(39.4143, -77.4105, []);
    expect(match).toBeNull();
  });

  it("picks the closer venue when two geofences both cover the visitor", () => {
    // Construct two overlapping fake geofences:
    //   A at (0, 0) with 200m radius
    //   B at ~50m east of A with 200m radius (same lat, 0.00045° lng east)
    // Visitor sits at (0.00009, 0) — ~10m north of A, ~50m from B.
    const a = { slug: "a", lat: 0, lng: 0, radiusMeters: 200 };
    const b = { slug: "b", lat: 0, lng: 0.00045, radiusMeters: 200 };
    const match = findNearestInList(0.00009, 0, [a, b]);
    expect(match?.slug).toBe("a");
  });

  it("respects each point's own radius (covers visitor by point's radius, not a global value)", () => {
    // Same A and B as above, but A's radius is 5m so the visitor (~10m
    // away) is NOT inside A; B's radius is 200m so visitor IS inside B.
    const a = { slug: "a", lat: 0, lng: 0, radiusMeters: 5 };
    const b = { slug: "b", lat: 0, lng: 0.00045, radiusMeters: 200 };
    const match = findNearestInList(0.00009, 0, [a, b]);
    expect(match?.slug).toBe("b");
  });

  it("returns null when visitor is on the wrong continent", () => {
    // Visitor in Paris; venues all in the US.
    const match = findNearestInList(48.8566, 2.3522, venues);
    expect(match).toBeNull();
  });
});
