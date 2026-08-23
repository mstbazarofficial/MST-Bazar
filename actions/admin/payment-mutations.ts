"use server";

import { revalidatePath } from "next/cache";

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

    const newPayment = await prisma.payment.create({
      data: {
        orderId,
        amount: validatedData.amount,
        method: validatedData.method,
        date: validatedData.date,
        note: validatedData.note || null,
      },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

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

    const updatedPayment = await prisma.payment.update({
      where: {
        id: paymentId,
        orderId, // Ensures the payment belongs to this specific order
      },
      data: {
        amount: validatedData.amount,
        method: validatedData.method,
        date: validatedData.date,
        note: validatedData.note || null,
      },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

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
    const deletedPayment = await prisma.payment.delete({
      where: {
        id: paymentId,
        orderId,
      },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

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
