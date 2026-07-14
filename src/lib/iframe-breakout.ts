/**
 * When our checkout flow is embedded in an Auth.net iframe (see
 * BusinessSignupForm / EventsBookingForm), the Auth.net hosted page
 * redirects to our callback URL inside the iframe on completion. A
 * plain server redirect (`NextResponse.redirect`) would then navigate
 * the iframe, not the parent — user ends up looking at our thanks
 * page rendered inside the booking form, which is jarring.
 *
 * This helper returns an HTML response that runs a small script to
 * navigate the TOP window to the target URL, breaking out of any
 * iframe context. If not iframed (e.g. someone hits the callback URL
 * directly, or Auth.net does a full-page redirect for a browser
 * without JS), it falls back to a same-window navigation and a
 * `<meta refresh>` for the no-JS edge case.
 */
export function topRedirect(target: string): Response {
  const safe = target.replace(/[<>"'&]/g, ""); // no XSS from callers
  const body = `<!doctype html>
<html><head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${safe}">
<title>Redirecting…</title>
</head><body>
<script>
(function(){
  var t = ${JSON.stringify(safe)};
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = t;
      return;
    }
  } catch (e) { /* cross-origin block — fall through */ }
  window.location.href = t;
})();
</script>
<p style="font-family:sans-serif;padding:24px;">Redirecting…</p>
</body></html>`;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
