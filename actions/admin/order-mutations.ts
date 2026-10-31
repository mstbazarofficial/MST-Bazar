// src/actions/admin/order-mutations.ts
"use server";

import { requireRole } from "@/lib/admin-auth";
import { syncCodPayment } from "@/lib/order-payments";
import { prisma } from "@/lib/prisma";
import { revalidateOrderPages } from "@/lib/revalidate-orders";
import { createUniqueId } from "@/utils/create-unique-id";
import {
  createOrderSchema,
  EditOrderInfoInput,
  editOrderInfoSchema,
  EditOrderStatusInput,
  editOrderStatusSchema,
  EditOrderSummaryInput,
  editOrderSummarySchema,
  OrderItemInput,
  orderItemSchema,
  type CreateOrderInput,
} from "@/validation/orders.validation";

export async function createOrder(data: CreateOrderInput) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    // 1. Validate input data
    const parsed = createOrderSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues,
      };
    }

    const { orderItems, ...orderData } = parsed.data;

    // 2. Create the order and nested order items in the database
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderId: createUniqueId("MST"),
          customerName: orderData.customerName,
          emailAddress: orderData.emailAddress || null,
          phoneNumber: orderData.phoneNumber,
          whatsappNumber: orderData.whatsappNumber,
          fullAddress: orderData.fullAddress,
          status: orderData.status,
          orderPaymentMethod: orderData.orderPaymentMethod,
          TrxID: orderData.TrxID,
          TrxNumber: orderData.TrxNumber,
          shippingCost: orderData.shippingCost,
          discount: orderData.discount,

          userId: orderData.userId,

          orderItems: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productImage: item.productImage,
              quantity: item.quantity,
              price: item.price,
              discountPercentage: item.discountPercentage,
            })),
          },
        },
      });

      await syncCodPayment(tx, created.id, {
        onDelivery: created.status === "DELIVERED",
      });

      return created;
    });

    // 3. Revalidate the order pages
    revalidateOrderPages();

    return { success: true, data: order.id };
  } catch (error: unknown) {
    console.error("Failed to create order:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the order.",
    };
  }
}

export async function addOrderItem({
  orderId,
  input,
}: {
  orderId: string;
  input: OrderItemInput;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const validatedData = orderItemSchema.parse(input);

    const newItem = await prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.create({
        data: {
          orderId,
          ...validatedData,
          productId: validatedData.productId || null,
        },
      });

      await syncCodPayment(tx, orderId);

      return item;
    });

    revalidateOrderPages();

    return { success: true, data: newItem };
  } catch (error) {
    console.error("Failed to add order item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to add order item",
    };
  }
}

// ==========================================
// 1. UPDATE ORDER ITEM
// ==========================================
export async function updateOrderItem({
  orderId,
  itemId,
  input,
}: {
  orderId: string;
  itemId: string;
  input: OrderItemInput;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const validatedData = orderItemSchema.parse(input);

    const updatedItem = await prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.update({
        where: {
          id: itemId,
          orderId, // Ensures the item belongs to this specific order
        },
        data: {
          ...validatedData,
          productId: validatedData.productId || null,
        },
      });

      await syncCodPayment(tx, orderId);

      return item;
    });

    revalidateOrderPages();

    return { success: true, data: updatedItem };
  } catch (error) {
    console.error("Failed to update order item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update order item",
    };
  }
}

// ==========================================
// 2. DELETE ORDER ITEM
// ==========================================
export async function deleteOrderItem({
  orderId,
  itemId,
}: {
  orderId: string;
  itemId: string;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const deletedItem = await prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.delete({
        where: {
          id: itemId,
          orderId, // Ensures the item belongs to this specific order
        },
      });

      await syncCodPayment(tx, orderId);

      return item;
    });

    revalidateOrderPages();

    return { success: true, data: deletedItem };
  } catch (error) {
    console.error("Failed to delete order item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete order item",
    };
  }
}

export async function updateOrderInfo({
  orderId,
  input,
}: {
  orderId: string;
  input: EditOrderInfoInput;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const validated = editOrderInfoSchema.parse(input);

    const isCod = validated.orderPaymentMethod === "CASH_ON_DELIVERY";

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          userId: validated.userId ?? null,
          customerName: validated.customerName,
          emailAddress: validated.emailAddress || null,
          phoneNumber: validated.phoneNumber,
          whatsappNumber: validated.whatsappNumber ?? null,
          fullAddress: validated.fullAddress,
          orderPaymentMethod: validated.orderPaymentMethod,
          TrxNumber: isCod ? null : (validated.TrxNumber ?? null),
          TrxID: isCod ? null : (validated.TrxID ?? null),
        },
      });

      await syncCodPayment(tx, orderId);

      return order;
    });

    revalidateOrderPages();

    return {
      success: true,
      data: updatedOrder,
    };
  } catch (error) {
    console.error("Failed to update order info:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update order info",
    };
  }
}

export async function updateOrderSummary({
  orderId,
  input,
}: {
  orderId: string;
  input: EditOrderSummaryInput;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const validated = editOrderSummarySchema.parse(input);

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          shippingCost: validated.shippingCost,
          discount: validated.discount,
        },
      });

      await syncCodPayment(tx, orderId);

      return order;
    });

    revalidateOrderPages();

    return {
      success: true,
      data: updatedOrder,
    };
  } catch (error) {
    console.error("Failed to update order summary:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update order summary",
    };
  }
}

export async function updateOrderStatus({
  orderId,
  input,
}: {
  orderId: string;
  input: EditOrderStatusInput;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const validated = editOrderStatusSchema.parse(input);

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: validated.status,
        },
      });

      await syncCodPayment(tx, orderId, {
        onDelivery: order.status === "DELIVERED",
      });

      return order;
    });

    revalidateOrderPages();

    return {
      success: true,
      data: updatedOrder,
    };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update order status",
    };
  }
}

export async function deleteOrder({ orderId }: { orderId: string }) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const deletedItem = await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    revalidateOrderPages();

    return { success: true, data: deletedItem };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order",
    };
  }
}
