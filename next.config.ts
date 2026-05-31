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
      // Venue feed consolidation (2026-05-30) — the four hardcoded
      // per-venue routes collapse into a single geo-aware /scan. Old
      // printed QR codes / shared links keep working via these 308s.
      { source: "/cb", destination: "/scan", permanent: true },
      { source: "/msb", destination: "/scan", permanent: true },
      { source: "/csq", destination: "/scan", permanent: true },
      { source: "/sbw", destination: "/scan", permanent: true },
    ];
  },
};

export default nextConfig;
