"use client";

import { useEffect, useMemo, useState } from "react";
import { InventoryCard } from "./inventory-card";
import { InterestForm } from "./interest-form";
import type { InventoryItem } from "@/lib/types";

const SETS = ["All", "Origins", "Spiritforged", "Unleashed", "Other"] as const;

export function InventoryGrid({
  items,
  interestSlug,
}: {
  items: InventoryItem[];
  interestSlug?: string;
}) {
  const [setFilter, setSetFilter] = useState<(typeof SETS)[number]>("All");

  const filtered = useMemo(() => {
    if (setFilter === "All") return items;
    return items.filter((item) => item.set === setFilter);
  }, [items, setFilter]);

  const interestItem = interestSlug
    ? items.find((item) => item.slug === interestSlug)
    : undefined;

  useEffect(() => {
    if (!interestItem) return;
    document.getElementById("interest")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [interestItem]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {SETS.map((set) => (
            <button
              key={set}
              type="button"
              onClick={() => setSetFilter(set)}
              className={`rounded-sm px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition ${
                setFilter === set
                  ? "bg-brass text-ink"
                  : "border border-tide/30 text-wake hover:border-foam/50 hover:text-parchment"
              }`}
            >
              {set}
            </button>
          ))}
        </div>
        <p className="text-sm text-wake">
          {filtered.length} card{filtered.length === 1 ? "" : "s"} available
        </p>
      </div>

      {interestItem ? (
        <div
          id="interest"
          className="animate-fade-up mt-8 rounded-sm border border-brass/30 bg-harbor/50 p-6"
        >
          <h2 className="font-display text-2xl text-parchment">
            Express interest
          </h2>
          <div className="mt-4">
            <InterestForm
              cardName={interestItem.name}
              cardId={interestItem._id}
            />
          </div>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-display text-2xl text-parchment">Hold is empty</p>
          <p className="mt-2 text-sm text-wake">
            No cards match this filter. Check back soon or join the weekly list.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <InventoryCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
