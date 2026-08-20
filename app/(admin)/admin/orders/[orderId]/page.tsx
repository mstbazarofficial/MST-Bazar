import { OrderDetailsClient } from "@/components/admin/orders/order-details-client";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
const orderInclude = {
  orderItems: {
    orderBy: { createdAt: "asc" },
  },
  payments: {
    orderBy: { date: "desc" },
  },
  notes: {
    orderBy: { createdAt: "desc" },
  },
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} satisfies Prisma.OrderInclude;

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  await requireAdmin();

  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { orderId },
    include: {
      orderItems: { orderBy: { createdAt: "asc" } },
      payments: { orderBy: { date: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!order) notFound();

  return <OrderDetailsClient order={order} />;
}
