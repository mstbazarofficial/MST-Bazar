// lib/data/catalog.ts
import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

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

const INFINITE = { stale: Infinity, revalidate: Infinity, expire: Infinity };

export async function getAllCategories(): Promise<CategoryDTO[]> {
  "use cache";
  cacheTag("categories");
  cacheLife(INFINITE);

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
}

export async function getAllProducts(): Promise<ProductDTO[]> {
  "use cache";
  cacheTag("products");
  cacheLife(INFINITE);

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
    },
    orderBy: [{ priority: "asc" }, { title: "asc" }],
  });
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheTag(`product-${slug}`); // ✅ ONLY tag the specific product
  cacheLife(INFINITE);

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  return product;
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag("products"); // ✅ Broad tag is correct here because adding/deleting products changes slug list
  cacheLife(INFINITE);

  const products = await prisma.product.findMany({
    select: { slug: true },
  });

  return products.map((p) => p.slug);
}

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit = 4,
): Promise<ProductDTO[]> {
  "use cache";
  cacheTag(`category-${categoryId}`); // ✅ ONLY tag the specific category
  cacheLife(INFINITE);

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
    },
    orderBy: [{ priority: "asc" }, { title: "asc" }],
  });
}
