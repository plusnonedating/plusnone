export default function EmptyState() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-display text-5xl sm:text-6xl tracking-wide text-ink leading-none">
        you&apos;re the first one
      </p>
      <p className="mt-5 max-w-sm text-base text-muted leading-relaxed">
        keep this page open — more videos will roll in as the night goes on. you&apos;ll have someone to find soon. 🥂
      </p>
      <p className="mt-8 text-xs text-muted tracking-wide">
        auto-refreshes every 30 seconds
      </p>
    </section>
  );
}
