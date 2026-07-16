import type { Metadata } from "next";
import { InventoryGrid } from "@/components/inventory-grid";
import { getInventory } from "@/lib/sanity.client";
import { isSanityConfigured } from "@/sanity/env";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Available Riftbound cards at Bilgewater Market.",
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ interest?: string }>;
};

export default async function InventoryPage({ searchParams }: Props) {
  const { interest } = await searchParams;
  const items = await getInventory();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-foam">
          The hold
        </p>
        <h1 className="mt-3 font-display text-4xl text-parchment">
          Available inventory
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-wake sm:text-base">
          Every card is verified and ready for sale. Express interest to begin
          the conversation — pricing is often negotiable.
        </p>
        {!isSanityConfigured ? (
          <p className="mt-3 text-xs text-wake/70">
            Demo listings until Sanity is connected.
          </p>
        ) : null}
      </div>

      <div className="mt-10">
        <InventoryGrid items={items} interestSlug={interest} />
      </div>
    </div>
  );
}
