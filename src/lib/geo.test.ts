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

describe("findNearestInList — downtown Frederick CB ↔ FNO overlap", () => {
  // Real coords from the production Airtable Business table.
  // CB and FNO centers sit ~176m apart, both with 150m radii — their
  // geofences overlap in a lens ~124m across in downtown Frederick.
  // The algorithm must pick the closer of the two, never first-wins.
  const CB = {
    slug: "cb",
    lat: 39.414006,
    lng: -77.410794,
    radiusMeters: 150,
  };
  const FNO = {
    slug: "fno",
    lat: 39.415586,
    lng: -77.411032,
    radiusMeters: 150,
  };
  const overlapping = [CB, FNO];
  const reverseOrder = [FNO, CB];

  it("visitor closer to CB but inside both → matches CB", () => {
    // ~45m from CB, ~132m from FNO — both within their 150m radii.
    const visitor = { lat: 39.4144, lng: -77.4109 };
    expect(findNearestInList(visitor.lat, visitor.lng, overlapping)?.slug).toBe(
      "cb",
    );
    // Same result regardless of array order — proves it's not first-wins.
    expect(
      findNearestInList(visitor.lat, visitor.lng, reverseOrder)?.slug,
    ).toBe("cb");
  });

  it("visitor closer to FNO but inside both → matches FNO", () => {
    // ~120m from CB, ~50m from FNO — both within their 150m radii.
    const visitor = { lat: 39.41515, lng: -77.41095 };
    expect(findNearestInList(visitor.lat, visitor.lng, overlapping)?.slug).toBe(
      "fno",
    );
    expect(
      findNearestInList(visitor.lat, visitor.lng, reverseOrder)?.slug,
    ).toBe("fno");
  });

  it("visitor at FNO center → matches FNO (only FNO covers them)", () => {
    // FNO center is ~176m from CB center — beyond CB's 150m radius —
    // so a visitor at FNO's exact center is NOT inside CB.
    const match = findNearestInList(FNO.lat, FNO.lng, overlapping);
    expect(match?.slug).toBe("fno");
  });

  it("visitor at CB center → matches CB (only CB covers them)", () => {
    const match = findNearestInList(CB.lat, CB.lng, overlapping);
    expect(match?.slug).toBe("cb");
  });
});
