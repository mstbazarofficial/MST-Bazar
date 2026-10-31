"use server";

import { Prisma } from "@/generated/prisma/client";
import { requireRole } from "@/lib/admin-auth";
import { getDhakaDayRange } from "@/lib/dhaka-time";
import { prisma } from "@/lib/prisma";
import {
  upsertPromoCodeSchema,
  type UpsertPromoCodeFormValues,
} from "@/validation/promo-code.validation";
import { revalidatePath } from "next/cache";

export async function upsertPromoCode(input: UpsertPromoCodeFormValues) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const parsed = upsertPromoCodeSchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: parsed.error.issues };

  const data = parsed.data;

  const fields = {
    code: data.code,
    description: data.description || null,
    discountType: data.discountType,
    discountValue: data.discountValue,
    maxDiscount: data.discountType === "PERCENT" ? data.maxDiscount : null,
    minOrderAmount: data.minOrderAmount,
    startsAt: data.startsAt ? getDhakaDayRange(data.startsAt).gte : null,
    endsAt: data.endsAt ? getDhakaDayRange(data.endsAt).lt : null,
    usageLimit: data.usageLimit,
    perCustomerLimit: data.perCustomerLimit,
    isActive: data.isActive,
  };

  try {
    const promoCode = data.id
      ? await prisma.promoCode.update({
          where: { id: data.id },
          data: fields,
        })
      : await prisma.promoCode.create({
          data: fields,
        });

    revalidatePath("/admin/promo-codes");

    return { success: true as const, promoCode };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false as const,
        error: [
          { path: ["code"], message: "This code already exists" },
        ] as { path: PropertyKey[]; message: string }[],
      };
    }

    console.error("Failed to save promo code", error);
    return {
      success: false as const,
      error: "Something went wrong while saving the promo code.",
    };
  }
}

export async function deletePromoCode(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  await prisma.promoCode.delete({ where: { id } });

  revalidatePath("/admin/promo-codes");
}

export async function togglePromoCodeActive(id: string, isActive: boolean) {
  await requireRole(["ADMIN", "MODERATOR"]);

  await prisma.promoCode.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/promo-codes");
}
