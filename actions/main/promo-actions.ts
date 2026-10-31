"use server";

import { auth } from "@/lib/auth";
import { checkPromoCode, PromoCodeError } from "@/lib/promo-code";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { PromoRules } from "@/utils/calculate-promo-discount";
import {
  normalizePromoCode,
  PROMO_CODE_MAX_LENGTH,
} from "@/validation/promo-code.validation";
import { headers } from "next/headers";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_CHECKS_PER_IP = 15;

export type AppliedPromo = PromoRules & { code: string };

type ApplyPromoCodeResult =
  | { success: true; promo: AppliedPromo }
  | { success: false; error: string };

export async function applyPromoCode(
  rawCode: string,
  phone: string,
): Promise<ApplyPromoCodeResult> {
  const code = normalizePromoCode(rawCode);
  if (!code || code.length > PROMO_CODE_MAX_LENGTH) {
    return { success: false, error: "This promo code is not valid." };
  }

  const requestHeaders = await headers();

  // Stops codes being guessed by trying them one after another.
  const isWithinLimit = checkRateLimit(
    `promo:ip:${getClientIp(requestHeaders)}`,
    MAX_CHECKS_PER_IP,
    RATE_LIMIT_WINDOW_MS,
  );

  if (!isWithinLimit) {
    return {
      success: false,
      error: "Too many attempts. Please wait a few minutes and try again.",
    };
  }

  try {
    const session = await auth.api.getSession({ headers: requestHeaders });
    const promo = await checkPromoCode(code, {
      phone,
      userId: session?.user?.id,
    });

    return {
      success: true,
      promo: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        maxDiscount: promo.maxDiscount,
        minOrderAmount: promo.minOrderAmount,
      },
    };
  } catch (error) {
    if (error instanceof PromoCodeError) {
      return { success: false, error: error.message };
    }

    console.error("Failed to check promo code:", error);
    return {
      success: false,
      error: "Couldn't check this promo code. Please try again.",
    };
  }
}
