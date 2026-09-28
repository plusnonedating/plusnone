import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Plus None Rep",
  robots: { index: false, follow: false },
};

/**
 * /rep/login — password-only sign-in for the rep dashboard. Everyone
 * with the shared REP_TOKEN gets in. When we add per-user auth this
 * page becomes an email → magic-link flow.
 */
export default function RepLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4ede4] px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
            Plus None
          </p>
          <h1 className="font-serif text-3xl leading-tight tracking-tight text-stone-900 md:text-4xl">
            Rep portal
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Sign in with the password Kate sent you.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
