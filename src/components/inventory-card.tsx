import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/sanity.client";
import type { InventoryItem } from "@/lib/types";

export function InventoryCard({ item }: { item: InventoryItem }) {
  const href = `/inventory/${item.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-tide/25 bg-harbor/40 transition hover:border-brass/40 hover:bg-harbor/70">
      <Link href={href} className="relative aspect-[4/3] overflow-hidden bg-depth">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.images?.[0]?.alt || item.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-wake">
            No image
          </div>
        )}
        {item.status === "pending" ? (
          <span className="absolute left-3 top-3 rounded-sm bg-ember/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
            Pending
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-foam">
          {item.finish === "graded" && item.gradingCompany && item.grade ? (
            <span>
              {item.gradingCompany} {item.grade}
            </span>
          ) : item.condition ? (
            <span>{item.condition}</span>
          ) : item.finish ? (
            <span>{item.finish}</span>
          ) : null}
          {item.cardType ? <span>· {item.cardType}</span> : null}
          {item.set ? <span>· {item.set}</span> : null}
        </div>
        <Link href={href}>
          <h3 className="mt-2 font-display text-xl text-parchment transition group-hover:text-brass">
            {item.name}
          </h3>
        </Link>
        {item.finish === "graded" && item.population != null ? (
          <p className="mt-1 text-xs text-wake">Population {item.population}</p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-wake">
              Asking price
            </p>
            <p className="mt-0.5 text-lg text-brass">{formatPrice(item)}</p>
          </div>
          <Link
            href={href}
            className="rounded-sm border border-brass/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brass transition hover:bg-brass hover:text-ink"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
