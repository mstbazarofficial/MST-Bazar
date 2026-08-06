import { z } from "zod";

const categoryBaseSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name must be less than 100 characters"),
  inputSlug: z.string().optional(),
  // Optional image, but if provided it must be a real URL.
  // Empty string is allowed through so a cleared input doesn't fail validation.
  image: z.union([z.url("Invalid image URL"), z.literal("")]).optional(),
  priority: z.number().int().min(0, "Priority must be a non-negative integer"),
});

export const createCategorySchema = categoryBaseSchema;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = categoryBaseSchema.extend({
  id: z.string().min(1),
});
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
