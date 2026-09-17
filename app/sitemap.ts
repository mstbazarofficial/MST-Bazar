// app/sitemap.ts
import { SITE_CONFIG } from "@/constants/site";
import { getAllCategories, getAllProducts } from "@/lib/data/catalog";
import type { MetadataRoute } from "next";

const SPECIAL_FILTERS = [
  "best-deals",
  "popular-products",
  "combo-deals",
  "top-selling",
];

// Fixed date for static legal/informational pages (update when content actually changes)
const STATIC_PAGE_DATE = new Date("2026-09-23");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];

  try {
    [products, categories] = await Promise.all([
      getAllProducts(),
      getAllCategories(),
    ]);
  } catch (error) {
    console.error("Failed to fetch data for sitemap:", error);
  }

  // 1. Static Core & Policy Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/return-refund`,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: STATIC_PAGE_DATE,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 2. Special Filter Category Pages (/products/best-deals, etc.)
  const specialFilterRoutes: MetadataRoute.Sitemap = SPECIAL_FILTERS.map(
    (filter) => ({
      url: `${baseUrl}/products/${filter}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }),
  );

  // 3. Category Pages (/products/honey, /products/groceries, etc.)
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => {
    const categoryUpdatedAt = (category as { updatedAt?: string | Date })
      .updatedAt;
    return {
      url: `${baseUrl}/products/${category.slug}`,
      lastModified: categoryUpdatedAt
        ? new Date(categoryUpdatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  // 4. Product Detail Pages (/product/pure-honey-500g, etc.)
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...specialFilterRoutes,
    ...categoryRoutes,
    ...productRoutes,
  ];
}
