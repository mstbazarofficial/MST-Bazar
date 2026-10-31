import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { OrderStatus } from "@/generated/prisma/enums";
import { calculateOrderTotal } from "@/utils/calculate-order-total";

const COD_PAYMENT_NOTE = "Cash collected on delivery";

/** Cancelled and returned orders owe nothing and cannot be marked as paid. */
export const CLOSED_ORDER_STATUSES: OrderStatus[] = ["CANCELLED", "RETURNED"];

type OrderDueInput = Parameters<typeof calculateOrderTotal>[0] & {
  payments: { amount: number }[];
};

export function getOrderDue(order: OrderDueInput) {
  const paid = order.payments.reduce((sum, { amount }) => sum + amount, 0);

  return Math.max(0, calculateOrderTotal(order).finalTotal - paid);
}

/**
 * Must run in a transaction. Takes the order's row lock, so two changes to one
 * order wait their turn and each reads the payments the other recorded.
 * NO KEY UPDATE lets writes to the order's items and payments carry on.
 */
export async function lockOrderForPayment(
  tx: Prisma.TransactionClient,
  orderId: string,
) {
  await tx.$queryRaw`SELECT "id" FROM "Order" WHERE "id" = ${orderId} FOR NO KEY UPDATE`;

  return tx.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { orderItems: true, payments: true },
  });
}

/**
 * Keeps the automatic COD payment equal to what the order still owes, and
 * removes it once the order is no longer a delivered COD order, so a returned
 * order leaves income. Only onDelivery creates one, so a payment an admin
 * deleted stays deleted when the order is edited later.
 */
export async function syncCodPayment(
  tx: Prisma.TransactionClient,
  orderId: string,
  { onDelivery = false }: { onDelivery?: boolean } = {},
) {
  const order = await lockOrderForPayment(tx, orderId);

  const autoPayment = order.payments.find((payment) => payment.autoRecorded);
  const isCollected =
    order.status === "DELIVERED" &&
    order.orderPaymentMethod === "CASH_ON_DELIVERY";

  if (!isCollected) {
    if (autoPayment) {
      await tx.payment.delete({ where: { id: autoPayment.id } });
    }
    return;
  }

  const amount = getOrderDue({
    ...order,
    payments: order.payments.filter((payment) => !payment.autoRecorded),
  });

  if (autoPayment) {
    if (amount > 0) {
      await tx.payment.update({
        where: { id: autoPayment.id },
        data: { amount },
      });
    } else {
      await tx.payment.delete({ where: { id: autoPayment.id } });
    }
    return;
  }

  if (onDelivery && amount > 0) {
    await tx.payment.create({
      data: {
        orderId,
        amount,
        method: "CASH_ON_DELIVERY",
        note: COD_PAYMENT_NOTE,
        autoRecorded: true,
      },
    });
  }
}
