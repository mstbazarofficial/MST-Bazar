import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  calculatePromoDiscount,
  getPromoStatus,
  type PromoStatus,
} from "@/utils/calculate-promo-discount";
import { formatPrice } from "@/utils/format-price";
import { getBdPhoneVariants } from "@/utils/phone";

type PromoCustomer = {
  phone?: string;
  userId?: string | null;
};

/** A customer-facing reason a code cannot be used. */
export class PromoCodeError extends Error {}

const INVALID_CODE_MESSAGE = "This promo code is not valid.";

const BLOCKED_STATUS_MESSAGES: Record<
  Exclude<PromoStatus, "ACTIVE">,
  string
> = {
  PAUSED: INVALID_CODE_MESSAGE,
  SCHEDULED: "This promo code is not active yet.",
  EXPIRED: "This promo code has expired.",
  USED_UP: "This promo code has reached its usage limit.",
};

/** Orders that hold a use of a code. Cancelled orders have returned theirs. */
export const promoUseWhere = {
  status: { not: "CANCELLED" },
} satisfies Prisma.OrderWhereInput;

/** Reads a code and throws a PromoCodeError unless this customer can use it. */
export async function getUsablePromoCode(
  db: Prisma.TransactionClient,
  code: string,
  customer: PromoCustomer,
) {
  const promo = await db.promoCode.findUnique({ where: { code } });
  if (!promo) throw new PromoCodeError(INVALID_CODE_MESSAGE);

  const usedCount = await db.order.count({
    where: { ...promoUseWhere, promoCodeId: promo.id },
  });

  const status = getPromoStatus(promo, usedCount, new Date());
  if (status !== "ACTIVE") {
    throw new PromoCodeError(BLOCKED_STATUS_MESSAGES[status]);
  }

  const customerMatches: Prisma.OrderWhereInput[] = [
    ...(customer.phone
      ? [{ phoneNumber: { in: getBdPhoneVariants(customer.phone) } }]
      : []),
    ...(customer.userId ? [{ userId: customer.userId }] : []),
  ];

  if (promo.perCustomerLimit !== null && customerMatches.length > 0) {
    const customerUses = await db.order.count({
      where: {
        ...promoUseWhere,
        promoCodeId: promo.id,
        OR: customerMatches,
      },
    });

    if (customerUses >= promo.perCustomerLimit) {
      throw new PromoCodeError("You have already used this promo code.");
    }
  }

  return promo;
}

/** The checkout preview. The order itself is checked again by claimPromoCode. */
export function checkPromoCode(code: string, customer: PromoCustomer) {
  return getUsablePromoCode(prisma, code, customer);
}

/**
 * Must run in the transaction that creates the order. The row lock makes
 * orders using the same code wait their turn, so the order created by one is
 * counted before the next is checked and the last use cannot be taken twice.
 */
export async function claimPromoCode(
  tx: Prisma.TransactionClient,
  code: string,
  customer: PromoCustomer,
  itemsSubtotal: number,
) {
  await tx.$queryRaw`SELECT "id" FROM "PromoCode" WHERE "code" = ${code} FOR UPDATE`;

  const promo = await getUsablePromoCode(tx, code, customer);

  if (itemsSubtotal < promo.minOrderAmount) {
    throw new PromoCodeError(
      `This promo code needs a minimum order of ${formatPrice(promo.minOrderAmount)}.`,
    );
  }

  return {
    id: promo.id,
    code: promo.code,
    discount: calculatePromoDiscount(promo, itemsSubtotal),
  };
}
