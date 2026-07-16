import Link from "next/link";

const links = [
  { href: "/inventory", label: "Inventory" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-tide/20 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group min-w-0">
          <span className="font-display text-lg tracking-wide text-parchment transition group-hover:text-brass sm:text-xl">
            Bilgewater
          </span>
          <span className="ml-2 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-wake transition group-hover:text-foam sm:text-xs">
            Market
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-wake sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-parchment"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/inventory"
            className="hidden rounded-sm border border-brass/50 bg-brass/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-brass transition hover:border-brass hover:bg-brass/20 sm:inline-block"
          >
            Browse
          </Link>
        </nav>
      </div>
    </header>
  );
}
