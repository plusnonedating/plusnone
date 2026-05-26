import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full pt-6 pb-2 flex items-center justify-center">
      <Image
        src="/plus-none-logo.png"
        alt="plus none"
        width={560}
        height={560}
        priority
        className="w-[220px] sm:w-[260px] md:w-[280px] h-auto"
      />
    </header>
  );
}
