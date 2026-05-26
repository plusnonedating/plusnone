/**
 * First-party anonymous device identifier for repeat-visit analytics on the
 * Plus None scan landing flow.
 *
 * Stored in localStorage and forwarded to the WPForms submission URL as a query
 * parameter, so Airtable's "Device ID" column can compute repeat-scanner rate
 * per venue. No PII, no cross-site tracking, not shared with third parties,
 * not used for advertising. Functional analytics only — no cookie banner
 * required.
 */
const KEY = "plusnone_device_id";

export function getDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (e.g. Safari private mode, storage full).
    // We just skip analytics for this device — never block the user.
    return null;
  }
}
