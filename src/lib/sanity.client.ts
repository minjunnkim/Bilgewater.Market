import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";
import {
  featuredInventoryQuery,
  inventoryBySlugQuery,
  inventoryListQuery,
  inventorySlugsQuery,
  siteSettingsQuery,
} from "./sanity.queries";
import { sampleInventory, sampleSettings } from "./sample-data";
import type { InventoryItem, SiteSettings } from "./types";

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

function imageUrlsFromItem(item: InventoryItem): string[] {
  const fromImages =
    item.images
      ?.map((img) => img.asset?.url || img.url)
      .filter((url): url is string => Boolean(url)) ?? [];
  if (fromImages.length) return fromImages;
  if (item.imageUrl) return [item.imageUrl];
  return [];
}

function normalizeItem(item: InventoryItem): InventoryItem {
  const imageUrls = imageUrlsFromItem(item);
  return {
    ...item,
    imageUrls,
    imageUrl: item.imageUrl || imageUrls[0],
  };
}

export async function getInventory(): Promise<InventoryItem[]> {
  if (!client) return sampleInventory.map(normalizeItem);

  try {
    const items = await client.fetch<InventoryItem[]>(inventoryListQuery);
    return (items ?? []).map(normalizeItem);
  } catch (error) {
    console.error("[sanity] inventory fetch failed", error);
    return [];
  }
}

export async function getFeaturedInventory(): Promise<InventoryItem[]> {
  if (!client) {
    return sampleInventory.filter((i) => i.featured).map(normalizeItem);
  }

  try {
    const items = await client.fetch<InventoryItem[]>(featuredInventoryQuery);
    return (items ?? []).map(normalizeItem);
  } catch (error) {
    console.error("[sanity] featured fetch failed", error);
    return [];
  }
}

export async function getInventoryItem(
  slug: string,
): Promise<InventoryItem | null> {
  if (!client) {
    const sample = sampleInventory.find((item) => item.slug === slug);
    return sample ? normalizeItem(sample) : null;
  }

  try {
    const item = await client.fetch<InventoryItem | null>(inventoryBySlugQuery, {
      slug,
    });
    return item ? normalizeItem(item) : null;
  } catch (error) {
    console.error("[sanity] item fetch failed", error);
    return null;
  }
}

export async function getInventorySlugs(): Promise<string[]> {
  if (!client) return sampleInventory.map((item) => item.slug);

  try {
    const rows = await client.fetch<Array<{ slug: string }>>(inventorySlugsQuery);
    return (rows ?? []).map((row) => row.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!client) return sampleSettings;

  try {
    const settings = await client.fetch<SiteSettings | null>(siteSettingsQuery);
    return { ...sampleSettings, ...settings };
  } catch {
    return sampleSettings;
  }
}

export function formatPrice(item: Pick<InventoryItem, "askingPrice" | "priceOnRequest">) {
  if (item.priceOnRequest || item.askingPrice == null) return "POA";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(item.askingPrice);
}
