"use server";

// ADJUST THESE TWO IMPORTS to match your project:
import { MAX_ITEM_QTY } from "@/constants/site";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { auth } from "@/lib/auth"; // your better-auth server instance
import { prisma } from "@/lib/prisma"; // your Prisma client singleton

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { PaymentMethod } from "@/generated/prisma/enums";
import { createUniqueId } from "@/utils/create-unique-id";
import {
  checkoutFormSchema,
  DELIVERY_CHARGES,
  type DeliveryOptionType,
  type PaymentMethodType,
} from "@/validation/checkout.validation";
import {
  normalizePromoCode,
  PROMO_CODE_MAX_LENGTH,
} from "@/validation/promo-code.validation";

// Import your email utility function
import { sendCapiEvent } from "@/lib/meta-capi";
import { claimPromoCode, PromoCodeError } from "@/lib/promo-code";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendOrderConfirmationEmail } from "@/utils/mail-presets";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ORDERS_PER_IP = 10;
const MAX_ORDERS_PER_PHONE = 5;

// ---------------------------------------------------------------------------
// Input contract
// ---------------------------------------------------------------------------

const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(MAX_ITEM_QTY),
});

const placeOrderInputSchema = z.object({
  customer: checkoutFormSchema,
  items: z
    .array(orderItemInputSchema)
    .min(1, "Select at least one item to order"),
  promoCode: z.string().max(PROMO_CODE_MAX_LENGTH).optional(),
});

export type PlaceOrderInput = z.infer<typeof placeOrderInputSchema>;

export type PlaceOrderResult =
  | { success: true; orderId: string; metaEventId: string; total: number }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

// Map our form's payment method values to your Prisma enum.
const PAYMENT_METHOD_MAP: Record<PaymentMethodType, PaymentMethod> = {
  cod: "CASH_ON_DELIVERY",
  bkash: "BKASH",
  nagad: "NAGAD",
  rocket: "ROCKET",
} as Record<PaymentMethodType, PaymentMethod>;

function getShippingCost(option: DeliveryOptionType) {
  return DELIVERY_CHARGES[option];
}

// ---------------------------------------------------------------------------
// Action
// ---------------------------------------------------------------------------

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const parsed = placeOrderInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      (fieldErrors[path] ??= []).push(issue.message);
    });

    return {
      success: false,
      error: "Some details are invalid. Please review the form and try again.",
      fieldErrors,
    };
  }

  const { customer, items, promoCode } = parsed.data;
  const requestHeaders = await headers();

  const isWithinLimit =
    checkRateLimit(
      `order:ip:${getClientIp(requestHeaders)}`,
      MAX_ORDERS_PER_IP,
      RATE_LIMIT_WINDOW_MS,
    ) &&
    checkRateLimit(
      `order:phone:${customer.phone}`,
      MAX_ORDERS_PER_PHONE,
      RATE_LIMIT_WINDOW_MS,
    );

  if (!isWithinLimit) {
    return {
      success: false,
      error:
        "Too many orders in a short time. Please wait a few minutes or contact us for help.",
    };
  }

  // Orders can be placed as a guest — userId is optional on the Order model.
  const session = await auth.api.getSession({ headers: requestHeaders });
  const userId = session?.user?.id ?? null;

  const productIds = items.map((item) => item.productId);

  // Fetch products with images sorted so `isFeatured: true` comes first (desc)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      title: true,
      images: {
        select: {
          url: true,
          isFeatured: true,
        },
        orderBy: { isFeatured: "desc" },
      },
      price: true,
      discountPercentage: true,
      isAvailable: true,
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  const missingProductIds = productIds.filter((id) => !productMap.has(id));
  if (missingProductIds.length > 0) {
    return {
      success: false,
      error:
        "Some items in your cart are no longer available. Please refresh your cart and try again.",
    };
  }

  const unavailableTitles = products
    .filter((product) => !product.isAvailable)
    .map((product) => product.title);
  if (unavailableTitles.length > 0) {
    return {
      success: false,
      error: `Currently out of stock: ${unavailableTitles.join(", ")}. Please remove ${unavailableTitles.length === 1 ? "it" : "them"} to continue.`,
    };
  }

  // Extract the featured image URL, or fall back to the first available image
  const orderItemsData = items.map((item) => {
    const product = productMap.get(item.productId)!;

    const featuredImage = product.images.find((img) => img.isFeatured);
    const primaryImage = featuredImage?.url ?? product.images[0]?.url ?? null;

    return {
      productId: product.id,
      productName: product.title,
      productImage: primaryImage,
      quantity: item.quantity,
      price: product.price,
      discountPercentage: product.discountPercentage ?? 0,
    };
  });

  const shippingCost = getShippingCost(customer.deliveryOption);
  const isManualPayment = customer.paymentMethod !== "cod";
  const orderId = createUniqueId("MST");
  const { itemsSubtotal } = calculateOrderTotal({
    orderItems: orderItemsData,
    discount: 0,
    shippingCost,
  });

  const eventId = crypto.randomUUID();

  let order: {
    orderId: string;
    id: string;
    discount: number;
    promoCode: string | null;
  };

  try {
    order = await prisma.$transaction(async (tx) => {
      const promo = promoCode
        ? await claimPromoCode(
            tx,
            normalizePromoCode(promoCode),
            { phone: customer.phone, userId },
            itemsSubtotal,
          )
        : null;

      return tx.order.create({
        data: {
          orderId,
          userId,

          customerName: customer.fullName,
          emailAddress: customer.email || null,
          phoneNumber: customer.phone,
          whatsappNumber: customer.whatsapp || null,
          fullAddress: customer.address,

          orderPaymentMethod: PAYMENT_METHOD_MAP[customer.paymentMethod],
          TrxNumber: isManualPayment ? customer.paymentPhone || null : null,
          TrxID: isManualPayment ? customer.transactionId || null : null,

          shippingCost,
          discount: promo?.discount ?? 0,
          promoCodeId: promo?.id,
          promoCode: promo?.code,

          orderItems: {
            create: orderItemsData,
          },
        },
        select: { orderId: true, id: true, discount: true, promoCode: true },
      });
    });
  } catch (error) {
    if (error instanceof PromoCodeError) {
      return { success: false, error: error.message };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Couldn't generate a unique order ID. Please try again.",
      };
    }

    console.error("Failed to place order:", error);
    return {
      success: false,
      error: "Something went wrong while placing your order. Please try again.",
    };
  }

  const { finalTotal: orderTotal } = calculateOrderTotal({
    orderItems: orderItemsData,
    discount: order.discount,
    shippingCost,
  });

  // The order is saved from here on. Email and tracking run after the response
  // so a failure in either can never make a saved order look like it failed.
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
    const {
      orderId: placedOrderId,
      id: placedOrderDbId,
      discount,
      promoCode: placedPromoCode,
    } = order;

    after(async () => {
      const results = await Promise.allSettled([
        customer.email &&
          sendOrderConfirmationEmail({
            orderId: placedOrderId,
            customerName: customer.fullName,
            emailAddress: customer.email,
            fullAddress: customer.address,
            phoneNumber: customer.phone,
            shippingCost,
            discount,
            promoCode: placedPromoCode,
            orderPaymentMethod: PAYMENT_METHOD_MAP[customer.paymentMethod],
            orderItems: orderItemsData,
          }),
        sendCapiEvent({
          eventName: "Purchase",
          eventId,
          actionSource: "website",
          userData: {
            email: customer.email,
            phone: customer.phone,
            externalId: placedOrderDbId,
          },
          customData: {
            value: orderTotal,
            currency: "BDT",
            content_ids: orderItemsData.map((i) => i.productId),
            contents: JSON.stringify(
              orderItemsData.map((i) => ({
                id: i.productId,
                quantity: i.quantity,
              })),
            ),
            num_items: orderItemsData.length,
            order_id: placedOrderId,
          },
        }),
      ]);

      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error(
            `Order ${placedOrderId} saved, but a follow-up task failed:`,
            result.reason,
          );
        }
      });
    });
  }

  revalidatePath("/checkout");

  return {
    success: true,
    orderId: order.orderId,
    metaEventId: eventId,
    total: orderTotal,
  };
}
