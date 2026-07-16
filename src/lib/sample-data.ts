import type { InventoryItem, SiteSettings } from "./types";

/** Demo inventory shown when Sanity is not configured yet. */
export const sampleInventory: InventoryItem[] = [
  {
    _id: "sample-1",
    name: "Best of Miss Fortune",
    slug: "best-of-miss-fortune",
    description:
      "Prize card from Origins. Near Mint, verified authenticity. Sample listing for site preview.",
    imageUrl: "/brand/bilgewater-market-hero.png",
    images: [
      {
        url: "/brand/bilgewater-market-hero.png",
        label: "Front",
        alt: "Best of Miss Fortune front",
      },
      {
        url: "/brand/bilgewater-market-hero.png",
        label: "Back",
        alt: "Best of Miss Fortune back",
      },
    ],
    set: "Origins",
    finish: "raw",
    cardType: "Prize Card",
    condition: "Near Mint",
    askingPrice: 15000,
    priceOnRequest: false,
    status: "available",
    featured: true,
    sortOrder: 1,
  },
  {
    _id: "sample-2",
    name: "Best of Gangplank",
    slug: "best-of-gangplank",
    description:
      "Spiritforged Best Of. Sample listing — replace with real inventory in Sanity Studio.",
    imageUrl: "/brand/bilgewater-market-hero.png",
    images: [
      {
        url: "/brand/bilgewater-market-hero.png",
        label: "Front",
        alt: "Best of Gangplank front",
      },
      {
        url: "/brand/bilgewater-market-hero.png",
        label: "Back",
        alt: "Best of Gangplank back",
      },
    ],
    set: "Spiritforged",
    finish: "raw",
    cardType: "Prize Card",
    condition: "Near Mint",
    askingPrice: 18000,
    priceOnRequest: false,
    status: "available",
    featured: true,
    sortOrder: 2,
  },
  {
    _id: "sample-3",
    name: "Black Label Signature",
    slug: "black-label-signature",
    description: "Graded signature card. Price on request — inquire for details.",
    imageUrl: "/brand/bilgewater-market-hero.png",
    images: [
      {
        url: "/brand/bilgewater-market-hero.png",
        label: "Front",
        alt: "Black Label Signature front",
      },
      {
        url: "/brand/bilgewater-market-hero.png",
        label: "Back",
        alt: "Black Label Signature back",
      },
    ],
    set: "Unleashed",
    finish: "graded",
    cardType: "Signature",
    gradingCompany: "BGS",
    grade: "Black Label",
    certNumber: "00000000",
    priceOnRequest: true,
    population: 4,
    populationAsOf: "2026-07-01T12:00:00.000Z",
    status: "available",
    featured: false,
    sortOrder: 3,
  },
];

export const sampleSettings: SiteSettings = {
  title: "Bilgewater Market",
  tagline: "Premium Riftbound TCG, dockside.",
  homepageBlurb:
    "Verified high-value Riftbound cards. Browse the hold, express interest, and get weekly inventory drops.",
  contactEmail: "hello@bilgewater.market",
  shippingNote:
    "Cards ship fully insured in rigid protection. Hand delivery available by arrangement.",
};
