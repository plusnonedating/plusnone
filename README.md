# plus none

The live feed at [plusnone.fetewell.com](https://plusnone.fetewell.com).

Single attendees film a 15-second selfie video, submit it via WPForms, and appear on this page for 6 hours so other singles at the wedding can go say hi in person. No DMs, no likes, no matching — the page is intentionally limited.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript, Tailwind CSS v4 (CSS-first config via `@theme`)
- Airtable as the data store, no other DB
- Vercel for hosting

## Local development

```bash
cp .env.example .env.local       # fill in the values
npm install
npm run dev                      # http://localhost:3000
```

Required env vars (see `.env.example`):

- `AIRTABLE_API_KEY` — Airtable personal access token, scopes `data.records:read` and `data.records:write`
- `AIRTABLE_BASE_ID` — `app1bnUYIncirnxRn`

## How the 6-hour window works

Records are **never** auto-deleted from Airtable. The 6-hour window is purely a visibility filter on the public feed.

Each venue feed queries Airtable per slug with:
`AND(NOT({Consent Acknowledged} = BLANK()), {Venue} = '<venue label>', DATETIME_DIFF(NOW(), CREATED_TIME(), 'hours') < 6)`

So anything older than 6h immediately disappears from the page, but the underlying record stays in Airtable forever — available for the podcast, business records, and follow-up.

The consent text on the form reflects this: "auto-clears from public view after 6 hours" (not "auto-clears after 6 hours"). No user-facing promise of deletion.

To purge records manually (between events, or to clear out test/seed data), use the [Manual flush](#manual-flush) section below.

## Rotating `AIRTABLE_API_KEY`

1. Generate a new token at <https://airtable.com/create/tokens> with scopes `data.records:read` + `data.records:write`, scoped to base `app1bnUYIncirnxRn`.
2. In Vercel: Project → Settings → Environment Variables → edit `AIRTABLE_API_KEY`, paste the new value, save.
3. Redeploy (Deployments → … → Redeploy) so the new value takes effect.
4. Confirm the page still loads, then revoke the old token in Airtable.

## Manual flush

Wipes **every record** in the Submissions table. Use between events or to get out of a bad state.

```bash
CONFIRM=yes npm run flush
```

The `CONFIRM=yes` guard prevents accidents. Reads `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` from `.env.local`.

## Seeding demo data

```bash
npm run seed
```

Pushes 6 demo records with public sample MP4s into Airtable, distributed across the four venues. They drop off the public feed after 12h (the visibility filter), but stay in the Airtable table until you run `npm run flush`.

## Deploy

```bash
vercel link        # one-time, picks the project
vercel env pull    # syncs env vars locally
vercel --prod      # production deploy
```

Custom domain: in Vercel → Project → Settings → Domains, add `plusnone.fetewell.com`. Vercel will tell you what CNAME to set at your DNS provider.

## File map

```
src/
  app/
    layout.tsx                 # fonts (Bebas + Inter) + cream bg
    page.tsx                   # / — server component, revalidates every 30s
    not-found.tsx              # 404 fallback
    globals.css                # Tailwind v4 @theme: cream/cobalt/ink palette
  components/
    Header.tsx                 # logo, centered, max-w 280px
    Feed.tsx                   # client — shuffle on mount, owns audible-id
    ProfileCard.tsx            # client — video, tap-to-unmute, IO observer
    EmptyState.tsx             # "nothing yet — go film something" + form link
  lib/
    airtable.ts                # lazy SDK init
    submissions.ts             # fetchRecent (per-venue) / fetchAll / deleteRecords
    shuffle.ts                 # Fisher-Yates
    types.ts                   # Submission interface
scripts/
  seed-airtable.ts             # npm run seed
  flush-airtable.ts            # CONFIRM=yes npm run flush
```
