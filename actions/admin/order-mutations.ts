// src/actions/admin/order-mutations.ts
"use server";

import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { createUniqueId } from "@/utils/create-unique-id";
import {
  createOrderSchema,
  EditOrderCostsInput,
  editOrderCostsSchema,
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
import { revalidatePath } from "next/cache";

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
    const order = await prisma.order.create({
      data: {
        orderId: createUniqueId("MST"),
        customerName: orderData.customerName,
        emailAddress: orderData.emailAddress,
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

    // 3. Revalidate the orders list page
    revalidatePath("/admin/orders");

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

    const newItem = await prisma.orderItem.create({
      data: {
        orderId,
        ...validatedData,
        productId: validatedData.productId || null,
      },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

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

    const updatedItem = await prisma.orderItem.update({
      where: {
        id: itemId,
        orderId, // Ensures the item belongs to this specific order
      },
      data: {
        ...validatedData,
        productId: validatedData.productId || null,
      },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

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
    const deletedItem = await prisma.orderItem.delete({
      where: {
        id: itemId,
        orderId, // Ensures the item belongs to this specific order
      },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

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

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        userId: validated.userId ?? null,
        customerName: validated.customerName,
        emailAddress: validated.emailAddress,
        phoneNumber: validated.phoneNumber,
        whatsappNumber: validated.whatsappNumber ?? null,
        fullAddress: validated.fullAddress,
        orderPaymentMethod: validated.orderPaymentMethod,
        TrxNumber: isCod ? null : (validated.TrxNumber ?? null),
        TrxID: isCod ? null : (validated.TrxID ?? null),
      },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");

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
  try {
    const validated = editOrderSummarySchema.parse(input);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingCost: validated.shippingCost,
        discount: validated.discount,
      },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");

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

export async function updateOrderCosts({
  orderId,
  input,
}: {
  orderId: string;
  input: EditOrderCostsInput;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const validated = editOrderCostsSchema.parse(input);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        productCost: validated.productCost ?? null,
        deliveryCost: validated.deliveryCost ?? null,
      },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");

    return {
      success: true,
      data: updatedOrder,
    };
  } catch (error) {
    console.error("Failed to update order costs:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update order costs",
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

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: validated.status,
      },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");

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

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return { success: true, data: deletedItem };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order",
    };
  }
}
