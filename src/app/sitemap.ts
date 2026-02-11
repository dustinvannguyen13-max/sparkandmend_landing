import type { MetadataRoute } from "next";

const baseUrl = "https://sparkandmend.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      priority: 1,
    },
    {
      url: `${baseUrl}/cleaning-services-plymouth`,
      lastModified,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cleaning-results-plymouth`,
      lastModified,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cleaning-prices-plymouth`,
      lastModified,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq-plymouth`,
      lastModified,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/basic-clean`,
      lastModified,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/intermediate-clean`,
      lastModified,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/advanced-clean`,
      lastModified,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/commercial-cleaning`,
      lastModified,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/get-a-quote`,
      lastModified,
      priority: 0.7,
    },
  ];
}
