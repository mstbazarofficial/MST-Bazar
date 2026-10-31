"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { promoUseWhere } from "@/lib/promo-code";
import { getPromoStatus } from "@/utils/calculate-promo-discount";

export async function getAdminPromoCodeById(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  return prisma.promoCode.findUnique({
    where: { id },
  });
}

export async function getAdminPromoCodes() {
  await requireRole(["ADMIN", "MODERATOR"]);

  const promoCodes = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: { where: promoUseWhere } } },
    },
  });

  const now = new Date();

  return promoCodes.map(({ _count, ...promo }) => ({
    ...promo,
    usedCount: _count.orders,
    status: getPromoStatus(promo, _count.orders, now),
  }));
}
