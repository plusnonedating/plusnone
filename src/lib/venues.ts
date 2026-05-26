export type FeedSlug = "cb" | "msb" | "csq" | "sbw";
export type Slug = FeedSlug | "ig";

export interface FeedVenue {
  slug: FeedSlug;
  label: string;
  name: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  hasFeed: true;
}

export interface IgVenue {
  slug: "ig";
  label: string;
  hasFeed: false;
}

export type Venue = FeedVenue | IgVenue;

export const FEED_VENUES: FeedVenue[] = [
  {
    slug: "cb",
    label: "Citizens Ballroom (Frederick, MD)",
    name: "Citizens Ballroom",
    city: "Frederick",
    state: "MD",
    address: "2 E Patrick St, Frederick, MD",
    lat: 39.4143,
    lng: -77.4105,
    hasFeed: true,
  },
  {
    slug: "msb",
    label: "Main Street Ballroom (Ellicott City, MD)",
    name: "Main Street Ballroom",
    city: "Ellicott City",
    state: "MD",
    address: "8307 Main St, Ellicott City, MD",
    lat: 39.2658,
    lng: -76.7973,
    hasFeed: true,
  },
  {
    slug: "csq",
    label: "Continental Square Ballroom (York, PA)",
    name: "Continental Square Ballroom",
    city: "York",
    state: "PA",
    address: "1 N George St, York, PA",
    lat: 39.9626,
    lng: -76.7277,
    hasFeed: true,
  },
  {
    slug: "sbw",
    label: "Savannah Bottle Works (Savannah, GA)",
    name: "Savannah Bottle Works",
    city: "Savannah",
    state: "GA",
    address: "411 W Charlton St, Savannah, GA",
    lat: 32.0726,
    lng: -81.0958,
    hasFeed: true,
  },
];

export const IG_VENUE: IgVenue = {
  slug: "ig",
  label: "Not at a Fêtewell event right now",
  hasFeed: false,
};

export const ALL_VENUES: Venue[] = [...FEED_VENUES, IG_VENUE];

const SLUG_TO_VENUE: Record<Slug, Venue> = Object.fromEntries(
  ALL_VENUES.map((v) => [v.slug, v]),
) as Record<Slug, Venue>;

export function venueBySlug(slug: string): Venue | null {
  return (SLUG_TO_VENUE as Record<string, Venue>)[slug] ?? null;
}

export function feedVenueBySlug(slug: string): FeedVenue | null {
  const venue = venueBySlug(slug);
  return venue && venue.hasFeed ? venue : null;
}

export function slugFromLabel(label: string | null | undefined): Slug {
  if (!label) return "ig";
  const trimmed = label.trim();
  if (!trimmed) return "ig";
  const match = ALL_VENUES.find((v) => v.label === trimmed);
  return match?.slug ?? "ig";
}

export function venueSubtitle(v: FeedVenue): string {
  return `${v.name} · ${v.city}, ${v.state}`;
}
