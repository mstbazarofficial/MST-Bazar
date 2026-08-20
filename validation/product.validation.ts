import { z } from "zod";

// 1. Image Schema
export const productImageSchema = z.object({
  id: z.string().optional(),
  imageId: z.string().min(1, "Image ID is required"),
  url: z.url("Invalid image URL"),
  isFeatured: z.boolean(),
  productId: z.string().optional(),
});

// 2. Base Product Schema
const productBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Product title is required")
    .max(255, "Title must be less than 255 characters"),
  inputSlug: z.string().optional(),
  sku: z.string().optional(),
  brand: z
    .string()
    .max(100, "Brand must be less than 100 characters")
    .optional(),
  unit: z.string().optional(),

  price: z.number().min(0.01, "Price must be greater than 0"),
  discountPercentage: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),

  shortDescription: z.string().optional(),
  productDetails: z.string().optional(),

  isBestDeal: z.boolean(),
  isAvailable: z.boolean(),
  isPopular: z.boolean(),
  priority: z.number().int().min(0, "Priority must be a non-negative integer"),

  categoryId: z.string().min(1, "Please select a category"),

  // Images array is strictly typed here
  images: z.array(productImageSchema),
});

// 3. Create Schema
export const createProductSchema = productBaseSchema
  .refine((data) => data.images.length > 0, {
    message: "At least one product image is required",
    path: ["images"],
  })
  .refine(
    // TypeScript now perfectly infers `img` without needing `any`
    (data) => data.images.filter((img) => img.isFeatured).length === 1,
    {
      message: "Exactly one featured image must be selected",
      path: ["images"],
    },
  );

export type CreateProductInput = z.input<typeof createProductSchema>;

// 4. Update Schema
export const updateProductSchema = productBaseSchema
  // We extend the base schema first to add the required ID
  .extend({
    id: z.string().min(1, "Product ID is required for updating"),
  })
  // Then apply the exact same refinements
  .refine((data) => data.images.length > 0, {
    message: "At least one product image is required",
    path: ["images"],
  })
  .refine((data) => data.images.filter((img) => img.isFeatured).length === 1, {
    message: "Exactly one featured image must be selected",
    path: ["images"],
  });

export type UpdateProductInput = z.input<typeof updateProductSchema>;
