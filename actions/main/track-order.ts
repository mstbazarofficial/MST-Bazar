"use server";

import { getBdPhoneVariants } from "@/utils/phone";
import { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { headers } from "next/headers";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_LOOKUPS_PER_IP = 30;
const MAX_LOOKUPS_PER_ORDER = 10;

export type TrackedOrderItem = {
  id: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: number;
  discountPercentage: number;
};

export type TrackedOrder = {
  id: string;
  orderId: string;
  customerName: string;
  phoneNumber: string;
  fullAddress: string;
  status: OrderStatus;
  orderPaymentMethod: PaymentMethod;
  TrxNumber: string | null;
  shippingCost: number;
  discount: number;
  promoCode: string | null;
  orderDate: string;
  orderItems: TrackedOrderItem[];
};

type TrackOrderResult =
  | { success: true; order: TrackedOrder }
  | { success: false; error: string };

export async function trackOrderAction(
  orderId: string,
  phoneNumber: string,
): Promise<TrackOrderResult> {
  if (!orderId.trim() || !phoneNumber.trim()) {
    return {
      success: false,
      error: "Please enter both Order ID and mobile number.",
    };
  }

  const isWithinLimit =
    checkRateLimit(
      `track:ip:${getClientIp(await headers())}`,
      MAX_LOOKUPS_PER_IP,
      RATE_LIMIT_WINDOW_MS,
    ) &&
    checkRateLimit(
      `track:order:${orderId.trim()}`,
      MAX_LOOKUPS_PER_ORDER,
      RATE_LIMIT_WINDOW_MS,
    );

  if (!isWithinLimit) {
    return {
      success: false,
      error: "Too many attempts. Please wait a few minutes and try again.",
    };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        orderId: orderId.trim(),
        phoneNumber: { in: getBdPhoneVariants(phoneNumber) },
      },
      select: {
        id: true,
        orderId: true,
        customerName: true,
        phoneNumber: true,
        fullAddress: true,
        status: true,
        orderPaymentMethod: true,
        TrxNumber: true,
        shippingCost: true,
        discount: true,
        promoCode: true,
        orderDate: true,
        orderItems: {
          select: {
            id: true,
            productName: true,
            productImage: true,
            quantity: true,
            price: true,
            discountPercentage: true,
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        error:
          "No order found with that Order ID and mobile number. Please check your details.",
      };
    }

    return {
      success: true,
      order: {
        ...order,
        orderDate: order.orderDate.toISOString(),
      },
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}
