# Deployment runbook

The complete "rebuild Plus None from scratch on a new Vercel account" walkthrough.
Written for a non-engineer or a junior dev who's never seen this project before.

If something here is wrong, fix it in the same PR you fix the underlying issue.

---

## Stack at a glance

- **Code** — Next.js 16 + React 19 + TypeScript. Lives at `github.com/plusnonedating/plusnone`.
- **Hosting** — Vercel (project name `plusnone`, owner `hello-73921415`).
- **Data** — Airtable, two bases (Submissions + Partners). No other database.
- **Forms** — WordPress + WPForms at `fetewell.com`, redirects back to plusnone.
- **Payments** — Lemon Squeezy as Merchant of Record. 4 Buy Links.
- **Domain** — `plusnone.fetewell.com` (subdomain of fetewell.com).

---

## Accounts you need

| Service | What it does | Where to sign up |
|---|---|---|
| GitHub | Code hosting | github.com |
| Vercel | App hosting + CI/CD | vercel.com |
| Airtable | Database for submissions + venue configs | airtable.com |
| Lemon Squeezy | Payments (Merchant of Record) | lemonsqueezy.com |
| WordPress + WPForms | The submission form | (fetewell.com is already set up) |
| Domain registrar | Owns `fetewell.com` DNS | wherever fetewell.com lives |

---

## Environment variables

All four live in **Vercel → Settings → Environment Variables** (production scope).

| Variable | What it is | Default if unset |
|---|---|---|
| `AIRTABLE_API_KEY` | Airtable PAT scoped to the **Submissions** base. Scopes: `data.records:read`, `data.records:write`. | required, no default |
| `AIRTABLE_BASE_ID` | ID of the Submissions base. | `app1bnUYIncirnxRn` (current prod) |
| `AIRTABLE_BUSINESS_API_KEY` | Airtable PAT scoped to the **Partners** base. Scopes: `data.records:read`. **Must be a separate PAT from `AIRTABLE_API_KEY`** because Airtable PATs are scoped per-base. | falls back to `AIRTABLE_API_KEY` (don't rely on this — generate a separate token) |
| `AIRTABLE_BUSINESS_BASE_ID` | ID of the Partners base. | `appNewsi5A4VKSs4g` (current prod) |

**To rotate any of these:** generate a new PAT at <https://airtable.com/create/tokens>, paste into Vercel, hit Redeploy on the latest deployment, then revoke the old PAT.

---

## Airtable schema

### Submissions base (`app1bnUYIncirnxRn`)

**Table name:** `Submissions` (lookup by string name, not table ID).

Each row is one person submitting via the WPForm. Field names used by code:

- `Consent Acknowledged` — checkbox/text, blank = hide from feed
- `Venue` — string, must match the WPForm's hidden venue field exactly
- `Name`, `Pitch`, `Video URL`, `Instagram` — display fields shown in the feed
- `CREATED_TIME()` — Airtable system field, used by the 6-hour filter

The 6-hour feed filter (from `src/lib/airtable.ts`):
```
AND(
  NOT({Consent Acknowledged} = BLANK()),
  {Venue} = '<venue label>',
  DATETIME_DIFF(NOW(), CREATED_TIME(), 'hours') < 6
)
```

### Partners base (`appNewsi5A4VKSs4g`)

**Table ID:** `tblCjS56kFGGr1XYo` (hardcoded in `src/lib/partners.ts`).
We use the table ID, not the name, so renaming the table in the UI is safe.

Each row is one venue's geo + display config. Field names used by code:

- `Status` — string. Only rows where `Status = 'Active'` are loaded.
- `Slug` — string. Used in URLs (e.g. `cb`, `msb`).
- `Name` — display name (e.g. "Citizens Ballroom").
- `Label` — WPForm-matching venue label (e.g. "Citizens Ballroom (Frederick, MD)").
- `WordPress Venue Param` — URL-encoded version of Label for the WPForm prefill.
- `Latitude`, `Longitude` — numbers. Decimal degrees.
- `Radius (m)` — number. Geofence radius in meters.

To add a venue: create a row in Airtable, set `Status = 'Active'`, fill all fields. Code reloads within 60s (cached via `unstable_cache`).

---

## WPForms / WordPress config

Lives at <https://fetewell.com/wp-admin> under WPForms.

The submission form must redirect back to plusnone after submit. In the form settings:

- **Confirmation Type:** Go to URL (Redirect)
- **Redirect URL:** `https://plusnone.fetewell.com/?from=submission&venue={field_id="19"}`

Where `field_id="19"` is WPForms' smart-tag for the hidden Venue field. The `?from=submission` param triggers the "just submitted" unlock in `LandingShell.tsx`, redirecting the user to `/scan` and revealing the full feed.

---

## Lemon Squeezy

4 Buy Links live in `https://plusnone.lemonsqueezy.com`. URLs hardcoded in code:

| Tier | File | Line approx | Trial / window |
|---|---|---|---|
| Business $99/mo | `src/app/business/page.tsx` | 11 | 30-day trial |
| Founding Partner $99/mo | `src/app/founding-partner/page.tsx` | 11 | 365-day trial |
| Event Single Day $499 | `src/app/events/page.tsx` | 27 | 24h activation |
| Event Multi Day $799 | `src/app/events/page.tsx` | 29 | 72h activation |

**For each Buy Link, in the LS dashboard set "Thank You URL" to:**
- Business → `https://plusnone.fetewell.com/business/thanks`
- Founding Partner → `https://plusnone.fetewell.com/founding-partner/thanks`
- Event tiers → `https://plusnone.fetewell.com/events/thanks`

This is what triggers the playbook PDF download flow.

---

## Vercel deployment

The project is connected to GitHub. **Auto-deploys on merge to `main` have been flaky** — sometimes the webhook doesn't fire after a merge.

**Fallback: manual deploy from a local checkout:**

```bash
cd plusnone
git checkout main && git pull
vercel deploy --prod --yes
```

This uploads + builds + ships to prod. Takes ~90 seconds. Requires `vercel` CLI authed (`vercel login`).

**Branch protection:** `main` is protected — no direct push, all changes via PR.

---

## Domain DNS

`plusnone.fetewell.com` is a CNAME at the registrar pointing at Vercel.

If you ever need to point it somewhere else (e.g. Vercel locked your account):

1. Log into the registrar of `fetewell.com`.
2. Update the CNAME for `plusnone` to the new host's URL.
3. Update SSL — the new host will need to issue a cert (Vercel/Netlify do this automatically).

---

## Smoke test post-deploy

Run [VERIFY.md](./VERIFY.md) once after every meaningful deploy.

---

## Disaster recovery

See [RECOVERY.md](./RECOVERY.md) for what to do when X breaks.
