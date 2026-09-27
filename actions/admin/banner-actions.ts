"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function getAdminBannerById(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  return prisma.banner.findUnique({
    where: { id },
  });
}

export async function getAdminBanners() {
  await requireRole(["ADMIN", "MODERATOR"]);

  return prisma.banner.findMany({
    orderBy: [{ placement: "asc" }, { order: "asc" }],
  });
}
