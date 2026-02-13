export const AREA = "Plymouth";
export const BRAND = "Spark & Mend";

export type ServiceSlug =
  | "basic-clean"
  | "intermediate-clean"
  | "advanced-clean"
  | "commercial-cleaning";

export type MarketingPagePath =
  | "/"
  | "/cleaning-services-plymouth"
  | "/cleaning-results-plymouth"
  | "/cleaning-prices-plymouth"
  | "/faq-plymouth"
  | "/get-a-quote"
  | "/guides"
  | "/guides/end-of-tenancy-cleaning-checklist-plymouth"
  | "/guides/cleaning-cost-guide-plymouth"
  | "/guides/what-landlords-check-plymouth"
  | "/guides/how-long-does-a-deep-clean-take-plymouth"
  | "/case-studies"
  | "/case-studies/end-of-tenancy-plymouth"
  | "/case-studies/deep-clean-plymouth";

export type ServiceKeyword = {
  slug: ServiceSlug;
  displayName: string;
  schemaName: string;
  seoTitle: string;
  seoPrimaryKeyword: string;
  seoVariants: string[];
  metaDescription: string;
};

export type PageKeyword = {
  path: MarketingPagePath;
  seoTitle: string;
  primaryKeyword: string;
  variants: string[];
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
      "home cleaning plymouth",
      "domestic cleaners plymouth",
      "book a cleaner plymouth",
      "one off cleaning plymouth",
      "domestic cleaning plymouth",
      "weekly cleaning plymouth",
      "fortnightly cleaning plymouth",
      "weekly cleaner plymouth",
      "fortnightly cleaner plymouth",
      "monthly cleaning service plymouth",
      "local house cleaners plymouth",
      "regular cleaning plymouth",
      "regular cleaner plymouth",
    ],
    metaDescription:
      "Regular house cleaning in Plymouth for already tidy homes. Book domestic cleaners for weekly, fortnightly, or monthly visits with clear pricing from the Spark & Mend calculator.",
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
      "kitchen deep cleaning plymouth",
      "bathroom deep cleaning plymouth",
      "kitchen and bathroom deep clean plymouth",
      "monthly cleaning plymouth",
      "detailed house cleaning plymouth",
      "deep cleaner plymouth",
    ],
    metaDescription:
      "Deep cleaning in Plymouth for homes that need a sharper reset. Book a one-off deep clean or spring clean with extra focus on kitchens, bathrooms, and build-up.",
  },
  {
    slug: "advanced-clean",
    displayName: "Advanced Clean",
    schemaName: "End of Tenancy Cleaning",
    seoTitle: `End of Tenancy Cleaning in ${AREA} (Advanced Clean)`,
    seoPrimaryKeyword: "end of tenancy cleaning plymouth",
    seoVariants: [
      "move out cleaning plymouth",
      "move-in cleaning plymouth",
      "tenancy clean plymouth",
      "deposit cleaning plymouth",
      "rental inspection cleaning plymouth",
      "rental cleaning plymouth",
      "property reset cleaning plymouth",
      "pre tenancy cleaning plymouth",
      "landlord cleaning plymouth",
      "letting agent cleaning plymouth",
    ],
    metaDescription:
      "End of tenancy cleaning in Plymouth for rentals and move-outs. Advanced Clean delivers a checklist-led reset that aligns with landlord and letting-agent expectations.",
  },
  {
    slug: "commercial-cleaning",
    displayName: "Commercial Cleaning",
    schemaName: "Office & Commercial Cleaning",
    seoTitle: `Office & Commercial Cleaning in ${AREA}`,
    seoPrimaryKeyword: "office cleaning plymouth",
    seoVariants: [
      "office cleaners plymouth",
      "commercial cleaning plymouth",
      "office cleaning plymouth",
      "workplace cleaning plymouth",
      "business cleaning plymouth",
      "commercial cleaners plymouth",
      "cleaning services for offices plymouth",
      "shop cleaning plymouth",
      "clinic cleaning plymouth",
    ],
    metaDescription:
      "Office and commercial cleaning in Plymouth with consistent visits. We clean around your hours, keep the scope clear, and quote quickly via the online calculator.",
  },
];

export const pages: PageKeyword[] = [
  {
    path: "/",
    seoTitle: `Cleaning Services in ${AREA}`,
    primaryKeyword: "cleaning services plymouth",
    variants: [
      "cleaners plymouth",
      "cleaning company plymouth",
      "domestic cleaners plymouth",
      "house cleaning plymouth",
      "home cleaning plymouth",
      "book a cleaner plymouth",
    ],
    metaDescription:
      "Spark & Mend provides reliable home, office, and end-of-tenancy cleaning in Plymouth. Arrange a free clean in minutes with clear pricing.",
  },
  {
    path: "/cleaning-services-plymouth",
    seoTitle: `Cleaners in ${AREA}`,
    primaryKeyword: "cleaners plymouth",
    variants: [
      "cleaning company plymouth",
      "domestic cleaners plymouth",
      "house cleaning plymouth",
      "home cleaning plymouth",
      "book a cleaner plymouth",
      "one off cleaning plymouth",
      "regular cleaning plymouth",
      "weekly cleaner plymouth",
      "fortnightly cleaner plymouth",
      "monthly cleaning service plymouth",
      "same day cleaners near me",
      "home cleaning near me",
      "house cleaning services near me",
    ],
    metaDescription:
      "Cleaners in Plymouth for homes, rentals, and businesses. Compare regular, deep, end-of-tenancy, and commercial services with clear pricing and fast booking.",
  },
  {
    path: "/cleaning-prices-plymouth",
    seoTitle: `Cleaning Prices in ${AREA}`,
    primaryKeyword: "cleaning prices plymouth",
    variants: [
      "house cleaning cost plymouth",
      "domestic cleaning prices plymouth",
      "deep cleaning cost plymouth",
      "end of tenancy cleaning cost plymouth",
      "commercial cleaning prices plymouth",
      "cleaning cost plymouth",
      "cheap cleaning service plymouth",
    ],
    metaDescription:
      "Cleaning prices in Plymouth generated instantly by our calculator. See price ranges and examples for regular, deep, end-of-tenancy, and commercial cleaning.",
  },
  {
    path: "/faq-plymouth",
    seoTitle: `Cleaning FAQs for ${AREA}`,
    primaryKeyword: "cleaning faq plymouth",
    variants: [
      "deposit cleaning plymouth",
      "end of tenancy cleaning plymouth faq",
      "move out cleaning questions",
      "deep cleaning questions plymouth",
      "commercial cleaning faq plymouth",
      "oven cleaning plymouth",
    ],
    metaDescription:
      "Cleaning FAQs for Plymouth covering deposits, inspections, ovens, carpets, timing, and products. Find quick answers before you book.",
  },
  {
    path: "/cleaning-results-plymouth",
    seoTitle: `Cleaning Results in ${AREA}`,
    primaryKeyword: "cleaning results plymouth",
    variants: [
      "before and after cleaning plymouth",
      "cleaning results in plymouth",
      "plymouth cleaning gallery",
      "house cleaning results plymouth",
      "deep cleaning results plymouth",
    ],
    metaDescription:
      "See before-and-after cleaning results in Plymouth from Spark & Mend. Browse real transformations and arrange a free clean in minutes.",
  },
  {
    path: "/get-a-quote",
    seoTitle: `Get an Instant Cleaning Quote in ${AREA}`,
    primaryKeyword: "cleaning quote plymouth",
    variants: [
      "get a cleaning quote plymouth",
      "instant cleaning quote plymouth",
      "book a cleaner plymouth",
      "house cleaning quote plymouth",
      "cleaning estimate plymouth",
    ],
    metaDescription:
      "Get an instant cleaning quote in Plymouth. Pick a service, share your details, and book online in minutes with clear pricing.",
  },
  {
    path: "/guides",
    seoTitle: `Cleaning Guides in ${AREA}`,
    primaryKeyword: "cleaning guides plymouth",
    variants: [
      "end of tenancy cleaning checklist plymouth",
      "cleaning cost guide plymouth",
      "what landlords check plymouth",
      "deep clean timing plymouth",
    ],
    metaDescription:
      "Plymouth cleaning guides from Spark & Mend. Explore checklists, cost guidance, inspection tips, and deep cleaning timing.",
  },
  {
    path: "/guides/end-of-tenancy-cleaning-checklist-plymouth",
    seoTitle: `End of Tenancy Cleaning Checklist in ${AREA}`,
    primaryKeyword: "end of tenancy cleaning checklist plymouth",
    variants: [
      "tenancy cleaning checklist plymouth",
      "move out cleaning checklist plymouth",
      "deposit cleaning checklist plymouth",
      "landlord inspection cleaning checklist plymouth",
      "oven cleaning checklist plymouth",
    ],
    metaDescription:
      "End of tenancy cleaning checklist for Plymouth rentals. Room-by-room tasks, landlord expectations, and how to book.",
  },
  {
    path: "/guides/cleaning-cost-guide-plymouth",
    seoTitle: `Cleaning Cost Guide in ${AREA}`,
    primaryKeyword: "cleaning cost guide plymouth",
    variants: [
      "cleaning prices guide plymouth",
      "house cleaning cost guide plymouth",
      "deep cleaning cost guide plymouth",
      "end of tenancy cost guide plymouth",
    ],
    metaDescription:
      "Plymouth cleaning cost guide covering what affects price, service choices, and how to get an instant quote.",
  },
  {
    path: "/guides/what-landlords-check-plymouth",
    seoTitle: `What Landlords Check in Plymouth`,
    primaryKeyword: "what landlords check plymouth",
    variants: [
      "landlord inspection checklist plymouth",
      "letting agent inspection plymouth",
      "end of tenancy inspection plymouth",
      "deposit inspection plymouth",
    ],
    metaDescription:
      "What landlords and letting agents typically check in Plymouth rentals, plus how to prepare for inspections.",
  },
  {
    path: "/guides/how-long-does-a-deep-clean-take-plymouth",
    seoTitle: `How Long Does a Deep Clean Take in ${AREA}`,
    primaryKeyword: "how long does a deep clean take plymouth",
    variants: [
      "deep cleaning time plymouth",
      "deep clean duration plymouth",
      "how long does a deep clean take",
      "deep cleaning timing guide plymouth",
    ],
    metaDescription:
      "A Plymouth guide to deep cleaning time: what affects duration, how it compares to regular cleaning, and how to book.",
  },
  {
    path: "/case-studies",
    seoTitle: `Cleaning Case Studies in ${AREA}`,
    primaryKeyword: "cleaning case studies plymouth",
    variants: [
      "end of tenancy cleaning case study plymouth",
      "deep cleaning case study plymouth",
      "before and after cleaning plymouth",
    ],
    metaDescription:
      "Case study templates for Plymouth cleaning jobs, using gallery assets and clear placeholders for real job details.",
  },
  {
    path: "/case-studies/end-of-tenancy-plymouth",
    seoTitle: `End of Tenancy Clean Case Study in ${AREA}`,
    primaryKeyword: "end of tenancy clean case study plymouth",
    variants: [
      "move out cleaning case study plymouth",
      "tenancy clean case study plymouth",
    ],
    metaDescription:
      "Template case study for an end of tenancy clean in Plymouth with placeholders for real job details.",
  },
  {
    path: "/case-studies/deep-clean-plymouth",
    seoTitle: `Deep Clean Case Study in ${AREA}`,
    primaryKeyword: "deep clean case study plymouth",
    variants: [
      "deep cleaning case study plymouth",
      "spring clean case study plymouth",
    ],
    metaDescription:
      "Template case study for a Plymouth deep clean with gallery assets and placeholders for real job details.",
  },
];

export const getServiceBySlug = (slug: ServiceSlug): ServiceKeyword => {
  const service = services.find((item) => item.slug === slug);
  if (!service) {
    throw new Error(`Unknown service slug: ${slug}`);
  }
  return service;
};

export const getPageByPath = (path: MarketingPagePath): PageKeyword => {
  const page = pages.find((item) => item.path === path);
  if (!page) {
    throw new Error(`Unknown marketing page path: ${path}`);
  }
  return page;
};

export const getServicePath = (slug: ServiceSlug) => `/${slug}`;

export const buildServiceTitle = (slug: ServiceSlug) => {
  const service = getServiceBySlug(slug);
  return `${service.seoTitle} | ${BRAND}`;
};

export const buildPageTitle = (path: MarketingPagePath) => {
  const page = getPageByPath(path);
  return `${page.seoTitle} | ${BRAND}`;
};

export const pricingKeywords = [
  "cleaning prices plymouth",
  "house cleaning cost plymouth",
  "domestic cleaning prices plymouth",
  "deep cleaning cost plymouth",
  "end of tenancy cleaning cost plymouth",
  "commercial cleaning prices plymouth",
  "cleaning cost plymouth",
  "cheap cleaning service plymouth",
];

export const faqKeywords = [
  "cleaning faq plymouth",
  "end of tenancy cleaning plymouth faq",
  "deposit cleaning plymouth",
  "move out cleaning questions",
  "deep cleaning questions plymouth",
  "commercial cleaning faq plymouth",
  "oven cleaning plymouth",
  "carpet cleaning plymouth",
];
