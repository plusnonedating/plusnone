import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * /rep layout — just sets noindex. Individual pages own their own
 * headers so the login page can be full-bleed while the dashboard has
 * the branded shell.
 */
export default function RepLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
