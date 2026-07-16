import { groq } from "next-sanity";

export const inventoryListQuery = groq`
  *[_type == "inventoryItem" && status in ["available", "pending"]]
  | order(coalesce(sortOrder, 999) asc, _createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    description,
    images[]{
      alt,
      label,
      asset->{
        url
      }
    },
    set,
    finish,
    cardType,
    gradingCompany,
    certNumber,
    grade,
    condition,
    askingPrice,
    priceOnRequest,
    population,
    populationAsOf,
    psaSpecId,
    status,
    featured,
    sortOrder
  }
`;

export const featuredInventoryQuery = groq`
  *[_type == "inventoryItem" && status == "available" && featured == true]
  | order(coalesce(sortOrder, 999) asc, _createdAt desc) [0...4] {
    _id,
    name,
    "slug": slug.current,
    description,
    images[]{
      alt,
      label,
      asset->{
        url
      }
    },
    set,
    finish,
    cardType,
    gradingCompany,
    certNumber,
    grade,
    condition,
    askingPrice,
    priceOnRequest,
    population,
    populationAsOf,
    psaSpecId,
    status,
    featured,
    sortOrder
  }
`;

export const inventoryBySlugQuery = groq`
  *[_type == "inventoryItem" && slug.current == $slug && status in ["available", "pending"]][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    images[]{
      alt,
      label,
      asset->{
        url
      }
    },
    set,
    finish,
    cardType,
    gradingCompany,
    certNumber,
    grade,
    condition,
    askingPrice,
    priceOnRequest,
    population,
    populationAsOf,
    psaSpecId,
    status,
    featured,
    sortOrder
  }
`;

export const inventorySlugsQuery = groq`
  *[_type == "inventoryItem" && status in ["available", "pending"] && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    tagline,
    homepageBlurb,
    contactEmail,
    shippingNote,
    discordUrl,
    twitterUrl
  }
`;
