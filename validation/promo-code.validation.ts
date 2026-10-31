import { z } from "zod";

export const PROMO_CODE_MAX_LENGTH = 30;

export const promoDiscountTypeEnum = z.enum(["PERCENT", "FIXED"]);

export const PROMO_DISCOUNT_TYPE_LABELS: Record<
  z.infer<typeof promoDiscountTypeEnum>,
  string
> = {
  PERCENT: "Percent (%)",
  FIXED: "Fixed amount (৳)",
};

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase();
}

const optionalDay = z
  .string()
  .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Enter a valid date");

const optionalLimit = z
  .number("Enter a whole number")
  .int("Enter a whole number")
  .positive("Must be at least 1")
  .nullable();

export const upsertPromoCodeSchema = z
  .object({
    id: z.string().optional(),
    code: z
      .string()
      .transform(normalizePromoCode)
      .pipe(
        z
          .string()
          .regex(
            /^[A-Z0-9_-]{3,30}$/,
            "Use 3-30 letters, numbers, dashes or underscores",
          ),
      ),
    description: z.string().trim().max(200, "Keep it under 200 characters"),
    discountType: promoDiscountTypeEnum,
    discountValue: z
      .number("Enter a discount")
      .positive("Must be more than 0"),
    maxDiscount: z
      .number("Enter an amount")
      .positive("Must be more than 0")
      .nullable(),
    minOrderAmount: z.number("Enter an amount").min(0, "Cannot be negative"),
    startsAt: optionalDay,
    endsAt: optionalDay,
    usageLimit: optionalLimit,
    perCustomerLimit: optionalLimit,
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.discountType === "PERCENT" && data.discountValue > 100) {
      ctx.addIssue({
        code: "custom",
        message: "A percent discount cannot be more than 100",
        path: ["discountValue"],
      });
    }

    if (data.startsAt && data.endsAt && data.endsAt < data.startsAt) {
      ctx.addIssue({
        code: "custom",
        message: "End date cannot be before the start date",
        path: ["endsAt"],
      });
    }
  });

export type UpsertPromoCodeFormValues = z.input<typeof upsertPromoCodeSchema>;
export type UpsertPromoCodeInput = z.output<typeof upsertPromoCodeSchema>;
