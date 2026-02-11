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
  schemaName: string;
  seoTitle: string;
  seoPrimaryKeyword: string;
  seoVariants: string[];
  metaDescription: string;
};

export const services: ServiceKeyword[] = [
  {
    slug: "basic-clean",
    displayName: "Basic Clean",
    schemaName: "Regular House Cleaning",
    seoTitle: `Regular House Cleaning in ${AREA} (Basic Clean)`,
    seoPrimaryKeyword: "regular house cleaning plymouth",
    seoVariants: [
      "house cleaning plymouth",
      "domestic cleaners plymouth",
      "domestic cleaning plymouth",
      "weekly cleaning plymouth",
      "fortnightly cleaning plymouth",
      "home cleaning plymouth",
      "local house cleaners plymouth",
      "regular cleaning plymouth",
      "regular cleaner plymouth",
    ],
    metaDescription:
      "Regular house cleaning in Plymouth for already tidy homes. Book domestic cleaners for weekly or fortnightly visits with instant quotes and a reliable Basic Clean.",
  },
  {
    slug: "intermediate-clean",
    displayName: "Intermediate Clean",
    schemaName: "Deep Cleaning",
    seoTitle: `Deep Cleaning in ${AREA} (Intermediate Clean)`,
    seoPrimaryKeyword: "deep cleaning plymouth",
    seoVariants: [
      "deep house cleaning plymouth",
      "spring cleaning plymouth",
      "one off deep clean plymouth",
      "one-off deep clean plymouth",
      "kitchen and bathroom deep clean plymouth",
      "monthly cleaning plymouth",
      "detailed house cleaning plymouth",
      "deep cleaner plymouth",
    ],
    metaDescription:
      "Deep cleaning in Plymouth for homes that need a sharper reset. Book a one-off deep clean or spring clean with extra detail on build-up and touch points.",
  },
  {
    slug: "advanced-clean",
    displayName: "Advanced Clean",
    schemaName: "End of Tenancy Cleaning",
    seoTitle: `End of Tenancy Cleaning in ${AREA} (Advanced Clean)`,
    seoPrimaryKeyword: "end of tenancy cleaning plymouth",
    seoVariants: [
      "move out cleaning plymouth",
      "tenancy clean plymouth",
      "rental inspection cleaning plymouth",
      "rental cleaning plymouth",
      "property reset cleaning plymouth",
      "pre tenancy cleaning plymouth",
      "landlord cleaning plymouth",
    ],
    metaDescription:
      "End of tenancy cleaning in Plymouth for rentals and move-outs. Advanced Clean delivers a full reset that aligns with landlord and letting-agent expectations.",
  },
  {
    slug: "commercial-cleaning",
    displayName: "Commercial Cleaning",
    schemaName: "Office & Commercial Cleaning",
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

export const pricingKeywords = [
  "cleaning prices plymouth",
  "house cleaning cost plymouth",
  "domestic cleaning prices plymouth",
  "deep cleaning cost plymouth",
  "end of tenancy cleaning cost plymouth",
  "commercial cleaning prices plymouth",
];

export const faqKeywords = [
  "cleaning faq plymouth",
  "end of tenancy cleaning plymouth faq",
  "deposit cleaning plymouth",
  "move out cleaning questions",
  "deep cleaning questions plymouth",
  "commercial cleaning faq plymouth",
];
