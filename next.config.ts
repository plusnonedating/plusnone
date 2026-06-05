import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Partner → Business / Pop-up → Events rename (2026-05-29).
    // Anyone with old links (Stripe success URLs, social posts, email
    // signatures) lands on the new route. 308 = permanent + preserves
    // request method.
    return [
      { source: "/partner", destination: "/business", permanent: true },
      {
        source: "/partner/thanks",
        destination: "/business/thanks",
        permanent: true,
      },
      { source: "/popup", destination: "/events", permanent: true },
      {
        source: "/popup/thanks",
        destination: "/events/thanks",
        permanent: true,
      },
      // /cb, /msb, /csq, /sbw previously 308'd to /scan after the
      // venue feed consolidation (PR #36). Reinstated as direct
      // routes when /[slug] landed (2026-06-05) so all 7 active
      // venues — cb, msb, csq, sbw, tsd, fno, sr — render their feed
      // inline without a redirect or a geo prompt. /scan still works
      // for geo-aware discovery; the /[slug] route is for direct
      // links (e.g. printed QR codes).
    ];
  },
};

export default nextConfig;
