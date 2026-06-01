# Quarterly smoke test

Run this checklist once every 3 months (or after any major change) to confirm
the live site works end-to-end. Takes ~15 minutes.

For each item: open the URL on a real phone or in a Chrome window and confirm
the expected behavior. If anything fails, open an issue with what you saw.

---

## 1. Marketing pages render

- [ ] <https://plusnone.fetewell.com/business> — hero copy, "How it works" list, phone mockup, pricing block, all visible
- [ ] <https://plusnone.fetewell.com/events> — hero, event pricing tiers (Single Day $499, Multi Day $799), all visible
- [ ] <https://plusnone.fetewell.com/founding-partner> — hero, pricing block, "First year free" callout
- [ ] <https://plusnone.fetewell.com/ig> — landing page that scans IG visitors get sent to

**Pass criteria:** every page loads under 2s, no broken images, no console errors.

---

## 2. /scan flow at a real venue

Drive (or walk) to a venue with `Status = 'Active'` in Airtable Partners. Then:

- [ ] Open <https://plusnone.fetewell.com/scan> on your phone
- [ ] Tap "Allow location"
- [ ] You should be matched to the correct venue
- [ ] Blurred feed appears with `N people are here.` + CTA `Add yourself to see them`

**If it fails:** add `?debug=1` to the URL (so `/scan?debug=1`) and screenshot the debug panel. Common causes:
- PAT expired → see [RECOVERY.md Scenario 2](./RECOVERY.md#scenario-2-airtable-pat-revoked--wrong-scope)
- Geofence too tight → bump the `Radius (m)` field in Airtable Partners

---

## 3. Submission flow end-to-end

- [ ] From /scan at a matched venue, tap "Add yourself"
- [ ] WPForm loads with the venue prefilled in the hidden field
- [ ] Fill in a test submission and submit
- [ ] Redirect should land you back at `https://plusnone.fetewell.com/?from=submission&venue=<venue%20name>`
- [ ] `LandingShell` should auto-redirect you to `/scan` and unlock the feed
- [ ] Your test submission should appear in the feed

**If the redirect URL is wrong:** check WPForms confirmation settings. See [DEPLOYMENT.md](./DEPLOYMENT.md#wpforms--wordpress-config).

After testing, delete the test submission from Airtable so it doesn't show up to real users.

---

## 4. Blurred gate works for non-submitters

- [ ] Open /scan in a private/incognito window (no localStorage from your test submission)
- [ ] If at a venue: should show the blurred preview, not the full feed
- [ ] If NOT at a venue: should show the /ig landing

---

## 5. Lemon Squeezy checkout (test mode)

While LS is in test mode (before final approval), checkout still works but charges no money.

- [ ] Click "Become a Plus None Location →" on /business
- [ ] LS checkout page loads
- [ ] Complete checkout with the test card `4242 4242 4242 4242`
- [ ] LS redirects you to `https://plusnone.fetewell.com/business/thanks`
- [ ] The thanks page shows "Download the Plus None Playbook →" button
- [ ] Clicking the button downloads a PDF

Repeat for /founding-partner and both /events tiers.

---

## 6. 308 redirects from legacy URLs

These should each redirect to /scan with HTTP 308:

```bash
curl -sI https://plusnone.fetewell.com/cb  | head -3
curl -sI https://plusnone.fetewell.com/msb | head -3
curl -sI https://plusnone.fetewell.com/csq | head -3
curl -sI https://plusnone.fetewell.com/sbw | head -3
```

- [ ] All four return `HTTP/2 308` with `location: /scan`

---

## 7. Airtable backups are running

The GitHub Action runs daily at 03:00 UTC.

- [ ] Check the `backups` branch: <https://github.com/plusnonedating/plusnone/tree/backups>
- [ ] Latest commit should be from within the last 48 hours
- [ ] CSVs should exist for both `submissions` and `partners` for recent dates

**If backups stopped:** check the Actions tab for failures. Most common cause is a PAT rotation that forgot to update the GitHub Action's secrets too.

---

## Done

Mark the date you ran this and pin it somewhere (calendar reminder works).
Next run: 3 months from today.
