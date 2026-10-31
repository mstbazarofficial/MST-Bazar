export const dynamic = "force-dynamic";
import { ORDER_LIST_SELECT } from "@/components/dashboard/orders/order-meta";
import { OrdersSection } from "@/components/dashboard/orders/orders-section";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { orderDate: "desc" },
    select: ORDER_LIST_SELECT,
  });

  return <OrdersSection orders={orders} />;
}
