# Recovery playbook

What to do when something fails. Each scenario lists symptoms → diagnosis → fix.
Read this before panicking, then act.

If you're in a crisis and reading this for the first time, also keep
[DEPLOYMENT.md](./DEPLOYMENT.md) open in another tab — it has the reference info
this doc points at (env vars, base IDs, etc.).

---

## Scenario 1: Vercel deploy didn't pick up a merge

**Symptoms:** PR merged to `main`, but `plusnone.fetewell.com` still shows the old version 5+ minutes later.

**Diagnosis:** Vercel's GitHub webhook is flaky on this project. Check with:
```bash
gh api repos/plusnonedating/plusnone/commits/<merge-sha>/status
```
If `state=pending` and `total=0` minutes after the merge, the webhook didn't fire.

**Fix:** Trigger a manual deploy from a local checkout:
```bash
cd plusnone
git checkout main && git pull
vercel deploy --prod --yes
```
Takes ~90s. Verify with `curl -sI https://plusnone.fetewell.com/` (look for 200).

---

## Scenario 2: Airtable PAT revoked / wrong scope

**Symptoms:** `/scan?debug=1` shows `decision: airtable-fetch-failed` and `activeVenueCount: 0`. Or `/api/submissions` returns 500.

**Diagnosis:** The PAT in Vercel either expired, got revoked, or doesn't have the right base scope. PATs are scoped per-base — a PAT for the Submissions base will NOT work for the Partners base. (This bit us before — see git log around June 2026.)

**Fix:**
1. Go to <https://airtable.com/create/tokens>
2. Click "Create new token"
3. Name: e.g. "Plus None — Partners (2026-06)"
4. Scopes: `data.records:read` (also `data.records:write` for Submissions base)
5. Access: only the ONE base you're regenerating for
6. Copy the new token
7. Vercel → Settings → Environment Variables → edit the right variable (`AIRTABLE_API_KEY` for Submissions, `AIRTABLE_BUSINESS_API_KEY` for Partners), paste, save
8. Redeploy (Vercel → Deployments → latest → ⋯ → Redeploy)
9. Confirm `/scan?debug=1` shows `decision: matched` or `out-of-range` (not `airtable-fetch-failed`)
10. Revoke the old PAT in Airtable

---

## Scenario 3: Lemon Squeezy denies your account / kicks you off

**Symptoms:** Lemon Squeezy emails saying "your account has been suspended" or "we can't approve this category." All 4 checkout links return errors.

**What you have backed up:** the Buy Link URLs in 1Password — these are gone once your LS account closes. But the WIRING is portable.

**Fix — migrate to a different payment processor:**

Best Plus-None-compatible alternatives (in priority order):
1. **Paddle** — Merchant of Record like LS, similar approval process, more permissive on adult/lifestyle categories
2. **Stripe** — direct billing, you handle tax + chargebacks yourself (Stripe was the original setup before LS)
3. **FastSpring** — MoR, B2B-friendly
4. **Polar.sh** — newer MoR, focused on creators/SaaS

Once you've signed up + been approved with the new processor, get new checkout URLs and:

Update in code (one PR, ~5 min):
- `src/app/business/page.tsx` line ~11 (`CHECKOUT_URL`)
- `src/app/founding-partner/page.tsx` line ~11 (`CHECKOUT_URL`)
- `src/app/events/page.tsx` lines ~27–29 (`CHECKOUT_URL_SINGLE_DAY`, `CHECKOUT_URL_MULTI_DAY`)

Also search-and-replace "Lemon Squeezy" → new processor name in:
- `src/components/partners/ThanksPage.tsx`
- `src/components/partners/PartnerSignup.tsx`
- `src/app/events/page.tsx`
- `src/app/*/thanks/page.tsx` (footer disclosures)
- `src/components/partners/PartnerSignup.tsx` footer disclosure

The thanks-page redirects are the new processor's job to configure — same as LS, set their post-checkout URL to `https://plusnone.fetewell.com/{business,events,founding-partner}/thanks`.

---

## Scenario 4: A bad code change broke production

**Symptoms:** Production site is broken, errors in the browser console, pages 500ing.

**Fix (fastest path — revert the bad commit):**
```bash
git checkout main && git pull
git revert <bad-commit-sha>
git push origin main          # blocked by branch protection
# So instead:
git checkout -b revert-bad-commit
git push origin revert-bad-commit
gh pr create --title "Revert bad commit" --body "Reverting <sha>"
gh pr merge <pr#> --squash --delete-branch
vercel deploy --prod --yes    # manual deploy since Vercel webhook is flaky
```

---

## Scenario 5: Lost / forgot all your secrets

**Symptoms:** You can't log into Vercel, lost your password, 2FA codes gone, etc.

**Prevention** (do this BEFORE you lose access):
- Every secret in 1Password under a "Plus None" vault
- 2FA backup codes saved offline (printed sheet, encrypted file, etc.)
- Account recovery email is one YOU control and can access without depending on this system

**If it's already happened:**
1. Use the service's "forgot password" / account-recovery flow
2. They'll usually email a reset link to your recovery email
3. Worst case: contact support with proof of identity

---

## Scenario 6: GitHub account suspended

**Symptoms:** Can't access github.com/plusnonedating/plusnone. PRs blocked.

**Mitigation already in place:** You have a local clone at `~/plusnone`. Your most recent code is on disk.

**Fix:**
1. Create a new GitHub org or use a different account
2. Create a new repo there
3. Locally: `git remote set-url origin <new-repo-url>` then `git push -u origin main`
4. In Vercel: Settings → Git → Disconnect → Connect to new repo
5. Daily Airtable backups (see `.github/workflows/airtable-backup.yml`) will need their secrets re-added in the new repo

---

## Scenario 7: Airtable goes down or you lose access

**Symptoms:** `/scan` and `/api/submissions` both return errors. Airtable.com is down or your account is locked.

**Mitigation already in place:** Daily Airtable CSV backups via GitHub Actions (`.github/workflows/airtable-backup.yml`). Snapshots live on the `backups` branch.

**Fix:**
- If it's a transient Airtable outage, just wait. Status: <https://status.airtable.com>
- If it's permanent (account locked, etc.):
  1. Create a new Airtable workspace + bases
  2. Restore the latest CSVs from the `backups` branch
  3. Generate new PATs
  4. Update `AIRTABLE_BASE_ID` and `AIRTABLE_BUSINESS_BASE_ID` in Vercel to point at the new bases
  5. Redeploy

---

## Scenario 8: Domain hijacked / lost

**Symptoms:** `plusnone.fetewell.com` returns "site not found" or worse, points at someone else's content.

**Fix:**
1. Log into the registrar where `fetewell.com` lives
2. Check the DNS records for the `plusnone` subdomain — should be CNAME to Vercel
3. If records were changed: revert them
4. If you've lost access to the registrar entirely: contact their support with ID proof. Domain registrars take this seriously.

**Prevention:** 2FA on the registrar account is non-negotiable. Domain-level locks (transfer lock, registrar lock) should be ON.
