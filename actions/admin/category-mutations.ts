"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@/validation/category.validation";
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
    await prisma.category.findFirst({
      where: { slug, ...(excludeId && { id: { not: excludeId } }) },
      select: { id: true },
    })
  ) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

export async function createCategory(input: CreateCategoryInput) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const parsed = createCategorySchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: parsed.error.issues };

  const data = parsed.data;
  const slug = await generateUniqueSlug(slugify(data.inputSlug || data.name));

  try {
    const category = await prisma.category.create({
      data: { name: data.name, slug, image: data.image || null },
      select: { id: true },
    });

    revalidatePath("/admin/categories");
    updateTag("categories");
    return { success: true as const, category };
  } catch (error) {
    console.error("Failed to create category", error);
    return {
      success: false as const,
      error: "Something went wrong while saving the category.",
    };
  }
}

export async function updateCategory(
  categoryId: string,
  input: UpdateCategoryInput,
) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const parsed = updateCategorySchema.safeParse({ ...input, id: categoryId });
  if (!parsed.success)
    return { success: false as const, error: parsed.error.issues };

  const data = parsed.data;

  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { slug: true },
  });
  if (!existing)
    return { success: false as const, error: "Category not found." };

  const slug = data.inputSlug
    ? await generateUniqueSlug(slugify(data.inputSlug), categoryId)
    : existing.slug;

  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        slug,
        image: data.image || null,
        priority: data.priority,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${categoryId}`);
    // After editing category...
    updateTag("categories");
    updateTag("products"); // Refreshes product lists displaying the updated category name/slug
    updateTag(`category-${categoryId}`); // Refreshes related products using this category
    return { success: true as const };
  } catch (error) {
    console.error("Failed to update category", error);
    return {
      success: false as const,
      error: "Something went wrong while saving the category.",
    };
  }
}

export async function deleteCategory(categoryId: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) {
    return {
      success: false as const,
      error: `Can't delete — ${productCount} product${productCount === 1 ? "" : "s"} still use this category.`,
    };
  }

  try {
    await prisma.category.delete({ where: { id: categoryId } });
    revalidatePath("/admin/categories");
    updateTag("categories");
    updateTag("products");
    return { success: true as const };
  } catch (error) {
    console.error("Failed to delete category", error);
    return {
      success: false as const,
      error: "Something went wrong while deleting the category.",
    };
  }
}
