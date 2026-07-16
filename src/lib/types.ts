export type InventoryStatus = "available" | "pending" | "sold";
export type InventoryFinish = "graded" | "raw";

export type SiteSettings = {
  title?: string;
  tagline?: string;
  homepageBlurb?: string;
  contactEmail?: string;
  shippingNote?: string;
  discordUrl?: string;
  twitterUrl?: string;
};

export type InventoryItem = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images?: Array<{
    asset?: { _ref?: string; url?: string };
    alt?: string;
    label?: string;
    url?: string;
  }>;
  imageUrl?: string;
  imageUrls?: string[];
  set?: string;
  /** @deprecated use finish + cardType */
  category?: string;
  finish?: InventoryFinish;
  cardType?: string;
  gradingCompany?: string;
  certNumber?: string;
  grade?: string;
  condition?: string;
  askingPrice?: number;
  priceOnRequest?: boolean;
  population?: number;
  /** ISO datetime — when population was last set in Studio */
  populationAsOf?: string;
  /** PSA SpecID — optional deep-link to psacard.com/spec/psa/{id} */
  psaSpecId?: number;
  status: InventoryStatus;
  featured?: boolean;
  sortOrder?: number;
};
