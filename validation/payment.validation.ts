// src/validation/payment.validation.ts
import { PaymentMethod } from "@/generated/prisma/enums";
import { z } from "zod";

export const paymentSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  method: z.enum(PaymentMethod, {
    message: "Please select a valid payment method",
  }),
  date: z.date("Payment date is required"),
  note: z.string().optional().nullable(),
});

export type PaymentInput = z.input<typeof paymentSchema>;

export interface PaymentType extends PaymentInput {
  id: string;
}
