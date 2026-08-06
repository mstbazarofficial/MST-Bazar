import { z } from "zod";

/**
 * Bangladeshi mobile numbers: 11 digits, starting 013-019.
 */
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

export const PAYMENT_METHODS = ["cod", "bkash", "nagad", "rocket"] as const;
export const DELIVERY_OPTIONS = ["inside", "outside"] as const;

export type PaymentMethodType = (typeof PAYMENT_METHODS)[number];
export type DeliveryOptionType = (typeof DELIVERY_OPTIONS)[number];

export const checkoutFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(80, "Full name looks too long"),

    email: z.string().trim().email("Enter a valid email address"),

    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(
        BD_PHONE_REGEX,
        "Enter a valid 11-digit number (e.g. 017XXXXXXXX)",
      ),

    whatsapp: z
      .union([
        z.literal(""),
        z
          .string()
          .trim()
          .regex(BD_PHONE_REGEX, "Enter a valid 11-digit WhatsApp number"),
      ])
      .optional(),

    address: z
      .string()
      .trim()
      .min(10, "Please add a more complete address (min 10 characters)")
      .max(200, "Address must be under 200 characters"),

    deliveryOption: z.enum(DELIVERY_OPTIONS, {
      message: "Please select a delivery option",
    }),

    paymentMethod: z.enum(PAYMENT_METHODS, {
      message: "Please select a payment method",
    }),

    // Optional by default in the schema object, but required during superRefine for manual payments
    paymentPhone: z.string().trim().optional().or(z.literal("")),
    transactionId: z.string().trim().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "cod") return;

    // Validate payment phone for manual payments
    if (!data.paymentPhone || !BD_PHONE_REGEX.test(data.paymentPhone)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter the number you sent the payment from",
        path: ["paymentPhone"],
      });
    }

    // Validate transaction ID for manual payments
    if (!data.transactionId || data.transactionId.trim().length < 6) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid Transaction ID (at least 6 characters)",
        path: ["transactionId"],
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const DELIVERY_CHARGES: Record<DeliveryOptionType, number> = {
  inside: 70,
  outside: 120,
};

export const checkoutDefaultValues: CheckoutFormValues = {
  fullName: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  deliveryOption: "inside",
  paymentMethod: "cod",
  paymentPhone: "",
  transactionId: "",
};
