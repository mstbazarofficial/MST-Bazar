import { z } from "zod";

export const bannerPlacementEnum = z.enum(["HERO_SLIDER", "HERO_SIDE_BANNER"]);
export type BannerPlacement = z.infer<typeof bannerPlacementEnum>;

export const upsertBannerSchema = z.object({
  id: z.string().optional(),

  title: z
    .string()
    .max(255, "Title must be less than 255 characters")
    .optional(),

  imageUrl: z.url("Please upload an image"),

  // Treat an empty string from the input as "not set" rather than failing z.url()
  linkUrl: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v : undefined))
    .pipe(z.url("Invalid link URL").optional()),

  placement: bannerPlacementEnum,
  order: z.number().int().min(1, "Order must be at least 1"),
  isActive: z.boolean(),
});

export type UpsertBannerInput = z.input<typeof upsertBannerSchema>;

// Single source of truth for placement -> crop ratio, shared by the form
// and anywhere else that needs it (e.g. an admin preview).
export const BANNER_ASPECT_RATIO: Record<BannerPlacement, number> = {
  HERO_SLIDER: 5 / 2,
  HERO_SIDE_BANNER: 1,
};

export const BANNER_UPLOAD_PRESET: Record<BannerPlacement, string> = {
  HERO_SLIDER: "hero_slider",
  HERO_SIDE_BANNER: "hero_side_banner",
};

export const BANNER_PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  HERO_SLIDER: "Hero Slider (carousel)",
  HERO_SIDE_BANNER: "Hero Side Banner",
};
