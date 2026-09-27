"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  upsertBannerSchema,
  type UpsertBannerInput,
} from "@/validation/banner.validation";
import { revalidatePath, updateTag } from "next/cache";

export async function upsertBanner(input: UpsertBannerInput) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const parsed = upsertBannerSchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: parsed.error.issues };

  const data = parsed.data;

  const fields = {
    title: data.title || null,
    imageUrl: data.imageUrl,
    linkUrl: data.linkUrl || null,
    placement: data.placement,
    order: data.order,
    isActive: data.isActive,
  };

  try {
    const banner = data.id
      ? await prisma.banner.update({
          where: { id: data.id },
          data: fields,
        })
      : await prisma.banner.create({
          data: fields,
        });

    updateTag("banners");
    updateTag(`banners-${banner.placement}`);
    revalidatePath("/admin/banners");

    return { success: true as const, banner };
  } catch (error) {
    console.error("Failed to save banner", error);
    return {
      success: false as const,
      error: "Something went wrong while saving the banner.",
    };
  }
}

export async function deleteBanner(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const deleted = await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/banners");

  updateTag("banners");
}

export async function toggleBannerActive(id: string, isActive: boolean) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const banner = await prisma.banner.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/banners");
  updateTag("banners");
}
