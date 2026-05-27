import IgLanding from "./IgLanding";

/**
 * /ig now serves the same public IG-only landing as /. After an IG submission,
 * the form redirects to /?from=submission&venue=… which routes through
 * LandingShell to /ig — and the visitor sees this page.
 */
export default function IgShell() {
  return <IgLanding />;
}
