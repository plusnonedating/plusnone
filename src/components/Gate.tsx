import Link from "next/link";

export default function Gate() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-display text-5xl sm:text-6xl tracking-wide text-ink leading-none">
        submit your video first
      </p>
      <p className="mt-5 max-w-sm text-base text-muted leading-relaxed">
        you have to put yourself out there to see who else is single at this event
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center justify-center rounded-full bg-cobalt px-8 py-4 text-cream text-base font-medium hover:bg-cobalt-hover transition-colors"
      >
        Shoot your shot
      </Link>
    </section>
  );
}
