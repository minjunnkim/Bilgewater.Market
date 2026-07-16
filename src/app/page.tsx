import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { InventoryCard } from "@/components/inventory-card";
import { getFeaturedInventory, getSiteSettings } from "@/lib/sanity.client";
import type { InventoryItem } from "@/lib/types";
import { isSanityConfigured } from "@/sanity/env";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getFeaturedInventory(),
  ]);

  return (
    <>
      <Hero tagline={settings.tagline} blurb={settings.homepageBlurb} />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-foam">
            Why Bilgewater
          </p>
          <h2 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">
            Trust on the docks
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-wake sm:text-base">
            Every card is inspected before it hits the board. Inquire directly —
            no checkout theater, just clear deals and insured shipping.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Verified authenticity",
              body: "Personal inspection on every piece. Only genuine cards change hands.",
            },
            {
              title: "Direct inquire",
              body: "See a card you want? Express interest with your budget — we respond promptly.",
            },
            {
              title: "Weekly drops",
              body: "Join the list for inventory updates every week. New holds, sold clears, priorities first.",
            },
          ].map((item) => (
            <div key={item.title} className="border-t border-tide/30 pt-5">
              <h3 className="font-display text-xl text-parchment">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-wake">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="border-t border-tide/15 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foam">
                  Featured hold
                </p>
                <h2 className="mt-3 font-display text-3xl text-parchment">
                  On the board
                </h2>
              </div>
              <Link
                href="/inventory"
                className="text-xs uppercase tracking-[0.16em] text-brass hover:text-parchment"
              >
                View all inventory →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 3).map((item: InventoryItem) => (
                <InventoryCard key={item._id} item={item} />
              ))}
            </div>
            {!isSanityConfigured ? (
              <p className="mt-8 text-center text-xs text-wake/70">
                Showing sample inventory — connect Sanity to manage live cards.
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-tide/25">
          <Image
            src="/brand/bilgewater-market-hero.png"
            alt=""
            fill
            className="object-cover object-[center_35%]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-foam">
            Ready to deal
          </p>
          <h2 className="mt-3 font-display text-3xl text-parchment">
            Looking for something specific?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-wake">
            Commission a find or ask about a card not yet listed. Reach out and
            we&apos;ll work the docks.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-sm border border-brass/50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-brass transition hover:bg-brass hover:text-ink"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
