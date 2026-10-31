export type PromoRules = {
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  maxDiscount: number | null;
  minOrderAmount: number;
};

type PromoSchedule = {
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  usageLimit: number | null;
};

export type PromoStatus =
  | "ACTIVE"
  | "PAUSED"
  | "SCHEDULED"
  | "EXPIRED"
  | "USED_UP";

/**
 * The taka taken off an order. Applies to the items only, never to delivery,
 * and is rounded down to a whole taka so it can never pass a limit.
 */
export function calculatePromoDiscount(
  promo: PromoRules,
  itemsSubtotal: number,
) {
  if (itemsSubtotal < promo.minOrderAmount) return 0;

  const discount =
    promo.discountType === "PERCENT"
      ? (itemsSubtotal * promo.discountValue) / 100
      : promo.discountValue;

  return Math.floor(
    Math.min(discount, promo.maxDiscount ?? Infinity, itemsSubtotal),
  );
}

export function getPromoStatus(
  promo: PromoSchedule,
  usedCount: number,
  now: Date,
): PromoStatus {
  if (!promo.isActive) return "PAUSED";
  if (promo.endsAt && now >= promo.endsAt) return "EXPIRED";
  if (promo.startsAt && now < promo.startsAt) return "SCHEDULED";
  if (promo.usageLimit !== null && usedCount >= promo.usageLimit) {
    return "USED_UP";
  }
  return "ACTIVE";
}
