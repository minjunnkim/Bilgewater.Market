import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ExpressInterestButton } from "@/components/express-interest-button";
import { ItemGallery } from "@/components/item-gallery";
import { certLookupUrl, psaPopulationUrl } from "@/lib/grader-links";
import {
  formatPrice,
  getInventoryItem,
  getInventorySlugs,
} from "@/lib/sanity.client";
import type { InventoryStatus } from "@/lib/types";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getInventorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getInventoryItem(slug);
  if (!item) return { title: "Card not found" };

  return {
    title: item.name,
    description:
      item.description?.slice(0, 160) ||
      `${item.name} available at Bilgewater Market.`,
    openGraph: {
      title: item.name,
      images: item.imageUrl ? [item.imageUrl] : undefined,
    },
  };
}

function statusMeta(status: InventoryStatus) {
  if (status === "available") {
    return {
      label: "Available",
      dot: "bg-foam",
      ring: "ring-foam/40",
    };
  }
  if (status === "pending") {
    return {
      label: "Pending",
      dot: "bg-ember",
      ring: "ring-ember/40",
    };
  }
  return {
    label: "Sold",
    dot: "bg-wake",
    ring: "ring-wake/40",
  };
}

function SpecTile({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-sm border border-tide/25 bg-harbor/50 px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-wake">
        {label}
      </p>
      <div className="mt-2 text-lg font-semibold tracking-tight text-parchment sm:text-xl">
        {children}
      </div>
    </div>
  );
}

function ExternalValue({
  href,
  children,
}: {
  href: string | null;
  children: ReactNode;
}) {
  if (!href) return <>{children}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-brass/50 underline-offset-4 transition hover:text-brass hover:decoration-brass"
    >
      {children}
    </a>
  );
}

export default async function InventoryItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getInventoryItem(slug);
  if (!item) notFound();

  const galleryImages =
    item.images
      ?.map((img) => ({
        url: img.asset?.url || img.url || "",
        alt: img.alt,
        label: img.label,
      }))
      .filter((img) => img.url) ??
    (item.imageUrl
      ? [{ url: item.imageUrl, alt: item.name, label: "Front" }]
      : []);

  const status = statusMeta(item.status);
  const gradeLabel =
    item.finish === "graded"
      ? [item.gradingCompany, item.grade].filter(Boolean).join(" ")
      : item.condition;
  const certHref = certLookupUrl(item.gradingCompany, item.certNumber);
  // Prefer Spec details page; fall back to the cert page (also shows pop) for PSA.
  const popHref =
    item.gradingCompany === "PSA"
      ? psaPopulationUrl(item.psaSpecId) || certHref
      : null;

  const eyebrow = [
    item.set,
    item.cardType,
    item.finish === "graded" ? "Graded" : item.finish === "raw" ? "Raw" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/inventory"
        className="text-xs uppercase tracking-[0.16em] text-wake transition hover:text-brass"
      >
        ← Back to inventory
      </Link>

      <div className="mt-5 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:z-20 lg:self-start">
          <ItemGallery
            images={galleryImages}
            name={item.name}
            overlayDetailsColumn
          />
        </div>

        <div id="inventory-details-column" className="relative min-w-0">
          {eyebrow ? (
            <p className="text-[10px] uppercase tracking-[0.16em] text-wake">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">
            {item.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-wake">
                Asking price
              </p>
              <p className="mt-1 font-display text-3xl text-brass">
                {formatPrice(item)}
              </p>
            </div>
            <ExpressInterestButton cardName={item.name} cardId={item._id} />
          </div>

          {item.finish === "graded" ? (
            <div className="mt-8 grid grid-cols-2 gap-3">
              <SpecTile label="Cert">
                {item.certNumber ? (
                  <ExternalValue href={certHref}>
                    {item.certNumber}
                  </ExternalValue>
                ) : (
                  <span className="text-wake">—</span>
                )}
              </SpecTile>
              <SpecTile label="Population">
                {item.population != null ? (
                  <div>
                    <ExternalValue href={popHref}>
                      {item.population.toLocaleString("en-US")}
                    </ExternalValue>
                    {item.populationAsOf ? (
                      <p className="mt-1 text-xs font-normal tracking-normal text-wake">
                        as of{" "}
                        {new Date(item.populationAsOf).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-wake">—</span>
                )}
              </SpecTile>
              <SpecTile label="Grade">
                {gradeLabel || <span className="text-wake">—</span>}
              </SpecTile>
              <SpecTile label="Status">
                <span className="inline-flex items-center gap-2.5">
                  <span
                    className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ${status.dot} ${status.ring}`}
                    aria-hidden
                  />
                  {status.label}
                </span>
              </SpecTile>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3">
              <SpecTile label="Condition">
                {item.condition || <span className="text-wake">—</span>}
              </SpecTile>
              <SpecTile label="Status">
                <span className="inline-flex items-center gap-2.5">
                  <span
                    className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ${status.dot} ${status.ring}`}
                    aria-hidden
                  />
                  {status.label}
                </span>
              </SpecTile>
            </div>
          )}

          {item.description ? (
            <div className="mt-8 border-t border-tide/20 pt-8">
              <h2 className="text-xs uppercase tracking-[0.16em] text-foam">
                Details
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-wake">
                {item.description}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
