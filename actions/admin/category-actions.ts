"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function getAdminCategories(search?: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  return prisma.category.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      priority: true,
      _count: { select: { products: true } },
    },
    orderBy: [{ priority: "asc" }, { name: "asc" }],
  });
}

export async function getAdminCategoryById(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  return prisma.category.findUnique({
    where: { id },
  });
}
