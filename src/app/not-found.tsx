import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="font-display text-5xl tracking-wide text-ink">404</p>
        <p className="mt-3 text-base text-muted">nothing here</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-cobalt px-6 py-3 text-cream font-medium hover:bg-cobalt-hover transition-colors"
        >
          Back to the feed
        </Link>
      </section>
    </>
  );
}
