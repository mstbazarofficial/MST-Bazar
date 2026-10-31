"use server";

import {
  CLOSED_ORDER_STATUSES,
  getOrderDue,
  lockOrderForPayment,
  syncCodPayment,
} from "@/lib/order-payments";
import { revalidateOrderPages } from "@/lib/revalidate-orders";

import { requireRole } from "@/lib/admin-auth"; // Adjust to your auth check path
import { prisma } from "@/lib/prisma"; // Adjust to your Prisma instance path
import { PaymentInput, paymentSchema } from "@/validation/payment.validation";

// ==========================================
// 1. ADD PAYMENT
// ==========================================
export async function addPayment({
  orderId,
  input,
}: {
  orderId: string;
  input: PaymentInput;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const validatedData = paymentSchema.parse(input);

    const newPayment = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          orderId,
          amount: validatedData.amount,
          method: validatedData.method,
          date: validatedData.date,
          note: validatedData.note || null,
        },
      });

      await syncCodPayment(tx, orderId);

      return payment;
    });

    revalidateOrderPages();

    return { success: true, data: newPayment };
  } catch (error) {
    console.error("Failed to add payment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add payment",
    };
  }
}

// ==========================================
// 2. UPDATE PAYMENT
// ==========================================
export async function updatePayment({
  orderId,
  paymentId,
  input,
}: {
  orderId: string;
  paymentId: string;
  input: PaymentInput;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const validatedData = paymentSchema.parse(input);

    const updatedPayment = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: {
          id: paymentId,
          orderId, // Ensures the payment belongs to this specific order
        },
        data: {
          amount: validatedData.amount,
          method: validatedData.method,
          date: validatedData.date,
          note: validatedData.note || null,
          autoRecorded: false, // The admin's figure now stands
        },
      });

      await syncCodPayment(tx, orderId);

      return payment;
    });

    revalidateOrderPages();

    return { success: true, data: updatedPayment };
  } catch (error) {
    console.error("Failed to update payment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update payment",
    };
  }
}

// ==========================================
// 3. DELETE PAYMENT
// ==========================================
export async function deletePayment({
  orderId,
  paymentId,
}: {
  orderId: string;
  paymentId: string;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const deletedPayment = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.delete({
        where: {
          id: paymentId,
          orderId,
        },
      });

      await syncCodPayment(tx, orderId);

      return payment;
    });

    revalidateOrderPages();

    return { success: true, data: deletedPayment };
  } catch (error) {
    console.error("Failed to delete payment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete payment",
    };
  }
}

// ==========================================
// 4. MARK AS PAID
// ==========================================
export async function markOrderPaid({ orderId }: { orderId: string }) {
  await requireRole(["ADMIN", "MODERATOR"]);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await lockOrderForPayment(tx, orderId);

      if (CLOSED_ORDER_STATUSES.includes(order.status)) {
        return { error: "Cancelled or returned orders cannot be paid." };
      }

      const amount = getOrderDue(order);
      if (amount <= 0) {
        return { error: "This order is already paid." };
      }

      const payment = await tx.payment.create({
        data: {
          orderId,
          amount,
          method: order.orderPaymentMethod,
          note: order.TrxID ? `TrxID ${order.TrxID}` : null,
        },
      });

      return { payment };
    });

    if (result.error !== undefined) {
      return { success: false, error: result.error };
    }

    revalidateOrderPages();

    return { success: true, data: result.payment };
  } catch (error) {
    console.error("Failed to mark order as paid:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to mark the order as paid",
    };
  }
}
