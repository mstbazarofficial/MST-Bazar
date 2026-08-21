// lib/data/catalog.ts
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
};

export type ProductDTO = {
  id: string;
  title: string;
  slug: string;
  unit: string | null;
  price: number;
  discountPercentage: number;
  isBestDeal: boolean;
  isPopular: boolean;
  isCombo: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    url: string;
    isFeatured: boolean;
  }[];
};

export const getAllCategories = unstable_cache(
  async (): Promise<CategoryDTO[]> => {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: { select: { products: true } },
      },
      orderBy: [{ priority: "asc" }, { name: "asc" }],
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      productCount: c._count.products,
    }));
  },
  ["all-categories"],
  { tags: ["categories"] },
);

export const getAllProducts = unstable_cache(
  async (): Promise<ProductDTO[]> => {
    return prisma.product.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        unit: true,
        price: true,
        discountPercentage: true,
        images: {
          select: {
            url: true,
            isFeatured: true,
          },
        },
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        isBestDeal: true,
        isPopular: true,
        isCombo: true,
      },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    });
  },
  ["all-products"],
  { tags: ["products"] },
);

export const getProductBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      return prisma.product.findUnique({
        where: { slug },
        include: {
          images: true,
          category: { select: { id: true, name: true, slug: true } },
        },
      });
    },
    ["product-by-slug", slug],
    { tags: [`product-${slug}`] },
  )();

export const getAllProductSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const products = await prisma.product.findMany({
      select: { slug: true },
    });

    return products.map((p) => p.slug);
  },
  ["all-product-slugs"],
  { tags: ["products"] },
);

export const getRelatedProducts = (
  categoryId: string,
  currentProductId: string,
  limit = 4,
) =>
  unstable_cache(
    async (): Promise<ProductDTO[]> => {
      return prisma.product.findMany({
        where: {
          categoryId,
          NOT: {
            id: currentProductId,
          },
        },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          unit: true,
          price: true,
          discountPercentage: true,
          images: {
            select: {
              url: true,
              isFeatured: true,
            },
          },
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          isBestDeal: true,
          isPopular: true,
          isCombo: true,
        },
        orderBy: [{ priority: "asc" }, { title: "asc" }],
      });
    },
    ["related-products", categoryId, currentProductId, String(limit)],
    { tags: [`category-${categoryId}`] },
  )();
