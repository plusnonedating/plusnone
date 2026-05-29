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
    ];
  },
};

export default nextConfig;
