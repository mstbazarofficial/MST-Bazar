"use server";

// ADJUST THESE TWO IMPORTS to match your project:
import { auth } from "@/lib/auth"; // your better-auth server instance
import { prisma } from "@/lib/prisma"; // your Prisma client singleton

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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

// Import your email utility function
import { sendOrderConfirmationEmail } from "@/utils/mail-presets";

// ---------------------------------------------------------------------------
// Input contract
// ---------------------------------------------------------------------------

const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
});

const placeOrderInputSchema = z.object({
  customer: checkoutFormSchema,
  items: z
    .array(orderItemInputSchema)
    .min(1, "Select at least one item to order"),
});

export type PlaceOrderInput = z.infer<typeof placeOrderInputSchema>;

export type PlaceOrderResult =
  | { success: true; orderId: string }
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

  const { customer, items } = parsed.data;

  // Orders can be placed as a guest — userId is optional on the Order model.
  const session = await auth.api.getSession({ headers: await headers() });
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

  try {
    const order = await prisma.order.create({
      data: {
        orderId,
        userId,

        customerName: customer.fullName,
        emailAddress: customer.email,
        phoneNumber: customer.phone,
        whatsappNumber: customer.whatsapp || null,
        fullAddress: customer.address,

        orderPaymentMethod: PAYMENT_METHOD_MAP[customer.paymentMethod],
        TrxNumber: isManualPayment ? customer.paymentPhone || null : null,
        TrxID: isManualPayment ? customer.transactionId || null : null,

        shippingCost,

        orderItems: {
          create: orderItemsData,
        },
      },
      select: { orderId: true },
    });

    if (process.env.ENABLE_EMAILS === "true") {
      sendOrderConfirmationEmail({
        orderId: order.orderId,
        customerName: customer.fullName,
        emailAddress: customer.email,
        fullAddress: customer.address,
        phoneNumber: customer.phone,
        shippingCost,
        discount: 0,
        orderPaymentMethod: customer.paymentMethod,
        orderItems: orderItemsData,
      }).catch((emailError) => {
        console.error(
          "Order saved, but confirmation email failed:",
          emailError,
        );
      });
    }

    revalidatePath("/checkout");

    return { success: true, orderId: order.orderId };
  } catch (error) {
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
}
