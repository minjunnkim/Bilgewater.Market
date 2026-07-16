import Image from "next/image";
import Link from "next/link";
import { SubscribeForm } from "./subscribe-form";

export function Hero({
  tagline,
  blurb,
}: {
  tagline?: string;
  blurb?: string;
}) {
  return (
    <section className="relative">
      <div className="relative min-h-[88vh] w-full overflow-hidden">
        <Image
          src="/brand/bilgewater-market-hero.png"
          alt="Bilgewater Market"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-ink/40" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
          <p className="animate-fade-up text-xs uppercase tracking-[0.28em] text-foam">
            Premium Riftbound TCG
          </p>
          <h1 className="animate-fade-up-delay sr-only">Bilgewater Market</h1>
          <p className="animate-fade-up-delay mt-3 max-w-xl font-display text-3xl leading-tight text-parchment sm:text-4xl">
            {tagline || "Premium Riftbound TCG, dockside."}
          </p>
          <p className="animate-fade-up-delay-2 mt-4 max-w-lg text-sm leading-relaxed text-wake sm:text-base">
            {blurb ||
              "Verified high-value cards. Browse the hold, express interest, and get weekly inventory drops."}
          </p>
          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/inventory"
              className="rounded-sm bg-brass px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-parchment"
            >
              Browse inventory
            </Link>
            <a
              href="#weekly-list"
              className="rounded-sm border border-parchment/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-parchment transition hover:border-brass hover:text-brass"
            >
              Join weekly list
            </a>
          </div>
        </div>
      </div>

      <div
        id="weekly-list"
        className="border-y border-tide/15 bg-ink/30"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-foam">
              Weekly inventory
            </p>
            <p className="mt-2 max-w-md font-display text-2xl text-parchment">
              Get the hold in your inbox
            </p>
            <p className="mt-2 text-sm text-wake">
              New listings and updates every week. No spam — inventory only.
            </p>
          </div>
          <div className="w-full max-w-md">
            <SubscribeForm />
          </div>
        </div>
      </div>
    </section>
  );
}
