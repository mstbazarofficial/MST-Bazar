"use server";

import { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

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
  productCost: number | null;
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

  try {
    const order = await prisma.order.findFirst({
      where: {
        orderId: orderId.trim(),
        phoneNumber: phoneNumber.trim(),
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
        productCost: true,
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
