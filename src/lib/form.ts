export const FORM_URL = "https://fetewell.com/plus-none-podcast/";

/**
 * Build the WPForms submission URL with venue pre-fill and (optionally)
 * an anonymous device ID for repeat-visit analytics. The WPForms form is
 * configured to read these as URL params and write them as hidden fields.
 */
export function formUrlForVenue(
  label: string,
  deviceId?: string | null,
): string {
  const url = new URL(FORM_URL);
  url.searchParams.set("venue", label);
  if (deviceId) url.searchParams.set("device_id", deviceId);
  return url.toString();
}
