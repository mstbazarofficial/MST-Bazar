"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/validation/product.validation";
import { revalidatePath, updateTag } from "next/cache";
function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(base: string, excludeId?: string) {
  let slug = base;
  let counter = 2;
  while (
    await prisma.product.findFirst({
      where: { slug, ...(excludeId && { id: { not: excludeId } }) },
      select: { id: true },
    })
  ) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

export async function createProduct(input: CreateProductInput) {
  await requireAdmin();

  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: parsed.error.issues };

  const data = parsed.data;
  const slug = await generateUniqueSlug(slugify(data.inputSlug || data.title));

  try {
    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,
        brand: data.brand || null,
        unit: data.unit || null,
        price: data.price,
        discountPercentage: data.discountPercentage,
        shortDescription: data.shortDescription || null,
        productDetails: data.productDetails || null,
        isBestDeal: data.isBestDeal,
        isAvailable: data.isAvailable,
        categoryId: data.categoryId,
        isPopular: data.isPopular,
        priority: data.priority,
        images: {
          create: data.images.map((img) => ({
            imageId: img.imageId,
            url: img.url,
            isFeatured: img.isFeatured,
          })),
        },
      },
      select: { id: true, categoryId: true },
    });

    updateTag("products");
    updateTag("categories");
    updateTag(`category-${product.categoryId}`);
    revalidatePath("/admin/products");

    return { success: true as const, product };
  } catch (error) {
    console.error("Failed to create product", error);
    return {
      success: false as const,
      error: "Something went wrong while saving the product.",
    };
  }
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput,
) {
  await requireAdmin();

  const parsed = updateProductSchema.safeParse({ ...input, id: productId });
  if (!parsed.success)
    return { success: false as const, error: parsed.error.issues };

  const data = parsed.data;

  // 1. Include categoryId in existing fetch so we can diff category changes
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      slug: true,
      categoryId: true,
      images: { select: { id: true } },
    },
  });

  if (!existing)
    return { success: false as const, error: "Product not found." };

  const newSlug = data.inputSlug
    ? await generateUniqueSlug(slugify(data.inputSlug), productId)
    : existing.slug;

  // 2. Diff images
  const existingImageIds = existing.images.map((img) => img.id);
  const incomingImageIds = data.images
    .filter((img) => img.id)
    .map((img) => img.id!);
  const removedImageIds = existingImageIds.filter(
    (id) => !incomingImageIds.includes(id),
  );

  try {
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          title: data.title,
          slug: newSlug,
          brand: data.brand || null,
          unit: data.unit || null,
          price: data.price,
          discountPercentage: data.discountPercentage,
          shortDescription: data.shortDescription || null,
          productDetails: data.productDetails || null,
          isBestDeal: data.isBestDeal,
          isAvailable: data.isAvailable,
          categoryId: data.categoryId,
          isPopular: data.isPopular,
          priority: data.priority,
        },
      }),
      ...(removedImageIds.length
        ? [
            prisma.productImage.deleteMany({
              where: { id: { in: removedImageIds } },
            }),
          ]
        : []),
      ...data.images.map((img) =>
        img.id
          ? prisma.productImage.update({
              where: { id: img.id },
              data: {
                url: img.url,
                imageId: img.imageId,
                isFeatured: img.isFeatured,
              },
            })
          : prisma.productImage.create({
              data: {
                productId,
                url: img.url,
                imageId: img.imageId,
                isFeatured: img.isFeatured,
              },
            }),
      ),
    ]);

    // 3. Admin path revalidations
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);

    // 4. Update tags dynamically based on what changed
    updateTag("products"); // Global products list
    updateTag(`product-${existing.slug}`); // Product details by old slug

    // If slug changed, invalidate new slug as well
    if (existing.slug !== newSlug) {
      updateTag(`product-${newSlug}`);
    }

    // Invalidate new/current category's related products
    updateTag(`category-${data.categoryId}`);

    // If category changed, update old category + global categories count
    if (existing.categoryId !== data.categoryId) {
      updateTag("categories"); // Recalculate product counts
      updateTag(`category-${existing.categoryId}`); // Remove from old category related list
    }

    return { success: true as const };
  } catch (error) {
    console.error("Failed to update product", error);
    return {
      success: false as const,
      error: "Something went wrong while saving the product.",
    };
  }
}
export async function deleteProduct(id: string) {
  await requireAdmin();
  const deletedProduct = await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");

  updateTag("products");
  updateTag(`product-${deletedProduct.slug}`);
  updateTag("categories");
  updateTag(`category-${deletedProduct.categoryId}`);
}
