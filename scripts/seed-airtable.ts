/**
 * Push demo records into Airtable so the venue feeds have something to render.
 * Run with: npm run seed
 *
 * Records are retained permanently in Airtable; they drop off the public feed
 * after 12h via the visibility filter. Wipe with `CONFIRM=yes npm run flush`.
 *
 * Sample videos courtesy of Google's public gtv-videos-bucket.
 *
 * Distribution: 2 records each at cb and msb, 1 each at csq and sbw.
 */
import { randomUUID } from "node:crypto";
import { getBase, SUBMISSIONS_TABLE } from "../src/lib/airtable";
import { FEED_VENUES } from "../src/lib/venues";

const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
];

const venueLabel = (slug: string): string => {
  const venue = FEED_VENUES.find((v) => v.slug === slug);
  if (!venue) throw new Error(`Unknown venue slug: ${slug}`);
  return venue.label;
};

const SEED = [
  {
    "Submitter Name": "Mary Anne Smith",
    Email: "maryanne@example.com",
    Handle: "@maryanne",
    Gender: "Woman",
    Age: 29,
    "Interested In": "Men",
    "Looking For": "Something serious",
    "Ice Breaker":
      "I will out-dance you at the reception and out-talk you over brunch.",
    "Video URL": SAMPLE_VIDEOS[0],
    "Consent Acknowledged": true,
    "Device ID": randomUUID(),
    Venue: venueLabel("cb"),
  },
  {
    "Submitter Name": "Madonna",
    Email: "m@example.com",
    Handle: "@m",
    Gender: "Woman",
    Age: 34,
    "Interested In": "Everyone",
    "Looking For": "A really good story",
    "Ice Breaker": "",
    "Video URL": SAMPLE_VIDEOS[1],
    "Consent Acknowledged": true,
    "Device ID": randomUUID(),
    Venue: venueLabel("cb"),
  },
  {
    "Submitter Name": "Kate Dear",
    Email: "kate@example.com",
    Handle: "@katedear",
    Gender: "Woman",
    Age: 31,
    "Interested In": "Men",
    "Looking For": "",
    "Ice Breaker": "I host weddings for a living. Ask me anything.",
    "Video URL": SAMPLE_VIDEOS[2],
    "Consent Acknowledged": true,
    "Device ID": randomUUID(),
    Venue: venueLabel("msb"),
  },
  {
    "Submitter Name": "James Patrick OConnell",
    Email: "james@example.com",
    Handle: "@jpoc",
    Gender: "Man",
    Age: 33,
    "Interested In": "Women",
    "Looking For": "Dance partner for the rest of the night",
    "Ice Breaker": "Bourbon, ballroom, bad jokes. In that order.",
    "Video URL": SAMPLE_VIDEOS[3],
    "Consent Acknowledged": true,
    "Device ID": randomUUID(),
    Venue: venueLabel("msb"),
  },
  {
    "Submitter Name": "Alex",
    Email: "alex@example.com",
    Handle: "@alex",
    Gender: "Nonbinary",
    Age: 27,
    "Interested In": "",
    "Looking For": "Friends and chaos",
    "Ice Breaker": "",
    "Video URL": SAMPLE_VIDEOS[4],
    "Consent Acknowledged": true,
    "Device ID": randomUUID(),
    Venue: venueLabel("csq"),
  },
  {
    "Submitter Name": "Devon Walker",
    Email: "devon@example.com",
    Handle: "@dwalk",
    Gender: "Man",
    Age: 30,
    "Interested In": "Women",
    "Looking For": "Someone who can keep up at trivia night",
    "Ice Breaker":
      "I once won a karaoke contest with Total Eclipse of the Heart.",
    "Video URL": SAMPLE_VIDEOS[5],
    "Consent Acknowledged": true,
    "Device ID": randomUUID(),
    Venue: venueLabel("sbw"),
  },
];

async function main() {
  const base = getBase();
  const table = base(SUBMISSIONS_TABLE);

  console.log(`Seeding ${SEED.length} records across ${FEED_VENUES.length} venues...`);
  for (let i = 0; i < SEED.length; i += 10) {
    const chunk = SEED.slice(i, i + 10).map((fields) => ({ fields }));
    await table.create(chunk);
    console.log(`  inserted ${Math.min(i + 10, SEED.length)}/${SEED.length}`);
  }
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
