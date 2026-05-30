# Brand pass audit — open PRs vs revised brief

**Date:** 2026-05-29
**Source brief:** `plus-none-brand-pass.md` — lean rewrite (Change 5 uses `LiveFeedPreview` / `StatStrip` / `Statement` components; Change 4a deprecated)

## Verdict

| PR | Status | Action |
|---|---|---|
| #16 (Change 5) | STALE — implements verbose pre-rewrite version | **Closed** in favor of fresh PR |
| #17 (Change 4) | Partial — 4a stale (deprecated), 4b matches | **Revised** to 4b-only |
| Merged #13/#14/#15 (Changes 1–3) | Match brief, on main | Keep |

## PR #16 — precise diffs vs revised brief

- **Hero body shipped:** 3-sentence — "We're sure the cocktails are great. But Plus None turns your business into a dating pool so the singles in the room can actually find each other. That's why they keep coming back."
- **Hero body in brief:** 2-sentence lean — "Plus None turns the room into a dating pool. Singles in the room can find each other."
- **Missing in hero:** `<LiveFeedPreview venueName="…" />` below the CTA
- **Missing under hero:** `<StatStrip items={…} />` flush against the hero bottom
- **Why this works shipped:** 3 numbered cards with bg-[#ede4d5] backgrounds + intro body paragraph between H2 and grid + blockquote pull-quote outcome
- **Why this works in brief:** H2 → 3 `<Statement>` components (icon circle + title + body, no card chrome) → italic pull-quote in `text-[#2647e8]`. No eyebrow above H2. No intro paragraph under H2.
- **Missing components entirely:** `src/components/marketing/Statement.tsx`, `StatStrip.tsx`, `LiveFeedPreview.tsx`

## PR #17 — precise diffs vs revised brief

- **4a "Two ways in" cards block on `/business`:** brief says "Do not implement 4a." PR #17 implements it. Removed.
- **4b `/ig` mailto → `/business` link:** matches brief. Keep.
- **4b `/cb` `/msb` `/csq` venue feed CTA:** matches brief. Keep.

## Changes 1–3 — already on `main`

- Change 1 (Header): matches. Logo bumped from h-20 → h-28/md:h-36 after PNG was cropped tight; intentional, post-crop sizing.
- Change 2 (mobile padding): matches in visual outcome. Implemented in `.partner-page` namespaced CSS rather than inline Tailwind utilities, but result is the same.
- Change 3 (DataSection): matches the brief character-for-character. `/events` uses `PopupDataSection` event-flavored variant per earlier explicit choice.

## Lesson learned

My initial audit walked the STALE verdict back when the verbose version of the brief was re-pasted. The revised lean brief existed all along — I just didn't see it until later. When the brief description doesn't match the code blocks in front of me, the right move is to ask for the literal text before changing the verdict, not flip the verdict on a hunch.
