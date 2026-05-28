import Image from "next/image";

export default function EmptyState() {
  return (
    <section className="flex-1 flex flex-col items-center px-6 pt-2 pb-8 text-center">
      <div className="relative w-[170px] h-[170px] my-2">
        <Image
          src="/cat-clueless.svg"
          alt=""
          fill
          priority
          sizes="170px"
        />
      </div>
      <p className="font-display text-[42px] leading-none tracking-[0.01em] text-cobalt mb-3.5">
        you&apos;re the first one
      </p>
      <p className="text-sm leading-[1.55] text-ink/85 max-w-[240px]">
        keep this page open — more profiles will roll in as the night goes on.
        you&apos;ll have someone to find soon. 🥂
      </p>
      <div className="mt-auto pt-6 inline-flex items-center justify-center gap-2 text-[11px] tracking-[0.04em] text-muted">
        <span
          aria-hidden
          className="w-[7px] h-[7px] rounded-full bg-cobalt animate-pulse-dot inline-block"
        />
        auto-refreshes every 30 seconds
      </div>
    </section>
  );
}
