export const AREA = "Plymouth";
export const BRAND = "Spark & Mend";

export type ServiceSlug =
  | "basic-clean"
  | "intermediate-clean"
  | "advanced-clean"
  | "commercial-cleaning";

export type ServiceKeyword = {
  slug: ServiceSlug;
  displayName: string;
  seoTitle: string;
  seoPrimaryKeyword: string;
  seoVariants: string[];
  metaDescription: string;
};

export const services: ServiceKeyword[] = [
  {
    slug: "basic-clean",
    displayName: "Basic Clean",
    seoTitle: `Regular House Cleaning in ${AREA} (Basic Clean)`,
    seoPrimaryKeyword: "regular house cleaning plymouth",
    seoVariants: [
      "house cleaning plymouth",
      "domestic cleaning plymouth",
      "weekly cleaning plymouth",
      "fortnightly cleaning plymouth",
      "home cleaning plymouth",
      "local house cleaners plymouth",
      "regular cleaner plymouth",
    ],
    metaDescription:
      "Regular house cleaning in Plymouth for already tidy homes. A light, reliable Basic Clean focused on visible areas with instant quotes and easy booking.",
  },
  {
    slug: "intermediate-clean",
    displayName: "Intermediate Clean",
    seoTitle: `Deep Cleaning in ${AREA} (Intermediate Clean)`,
    seoPrimaryKeyword: "deep cleaning plymouth",
    seoVariants: [
      "deep house cleaning plymouth",
      "spring cleaning plymouth",
      "one off deep clean plymouth",
      "kitchen and bathroom deep clean plymouth",
      "monthly cleaning plymouth",
      "detailed house cleaning plymouth",
      "deep cleaner plymouth",
    ],
    metaDescription:
      "Deep cleaning in Plymouth for homes that need a sharper reset. Intermediate Clean targets build-up, touch points, and extra detail with a fixed instant quote.",
  },
  {
    slug: "advanced-clean",
    displayName: "Advanced Clean",
    seoTitle: `End of Tenancy & Deep Cleaning in ${AREA} (Advanced Clean)`,
    seoPrimaryKeyword: "end of tenancy cleaning plymouth",
    seoVariants: [
      "move out cleaning plymouth",
      "tenancy clean plymouth",
      "full deep clean plymouth",
      "property reset cleaning plymouth",
      "pre tenancy cleaning plymouth",
      "rental cleaning plymouth",
      "landlord cleaning plymouth",
    ],
    metaDescription:
      "End of tenancy and deep cleaning in Plymouth for a full reset. Advanced Clean is our most thorough option for rentals, first cleans, and detailed finishes.",
  },
  {
    slug: "commercial-cleaning",
    displayName: "Commercial Cleaning",
    seoTitle: `Office & Commercial Cleaning in ${AREA}`,
    seoPrimaryKeyword: "commercial cleaning plymouth",
    seoVariants: [
      "office cleaning plymouth",
      "workplace cleaning plymouth",
      "business cleaning plymouth",
      "commercial cleaners plymouth",
      "cleaning services for offices plymouth",
      "shop cleaning plymouth",
      "clinic cleaning plymouth",
    ],
    metaDescription:
      "Office and commercial cleaning in Plymouth with consistent, reliable visits. We clean around your hours and keep the scope clear with fast quotes.",
  },
];

export const getServiceBySlug = (slug: ServiceSlug): ServiceKeyword => {
  const service = services.find((item) => item.slug === slug);
  if (!service) {
    throw new Error(`Unknown service slug: ${slug}`);
  }
  return service;
};

export const getServicePath = (slug: ServiceSlug) => `/${slug}`;

export const buildServiceTitle = (slug: ServiceSlug) => {
  const service = getServiceBySlug(slug);
  return `${service.seoTitle} | ${BRAND}`;
};
