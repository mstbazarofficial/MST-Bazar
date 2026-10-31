import type { PaymentMethod } from "@/generated/prisma/enums";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH_ON_DELIVERY: "Cash on Delivery",
  BKASH: "bKash",
  ROCKET: "Rocket",
  NAGAD: "Nagad",
  BANK_TRANSFER: "Bank Transfer",
  CARD: "Card Payment",
  OTHER: "Other",
};

export function formatPaymentMethod(method: PaymentMethod) {
  return PAYMENT_METHOD_LABELS[method] ?? method;
}
