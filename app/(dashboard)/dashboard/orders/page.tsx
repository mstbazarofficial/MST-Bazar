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
    select: {
      id: true,
      orderId: true,
      status: true,
      orderPaymentMethod: true,
      shippingCost: true,
      discount: true,
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

  return (
    <div>
      <OrdersSection orders={orders} />
    </div>
  );
}
