export const dynamic = "force-dynamic";

import {
  PageHeading,
  Panel,
} from "@/components/dashboard/layout/dashboard-panel";
import { OrderDeliveryCard } from "@/components/dashboard/orders/order-delivery-card";
import { OrderHelpCard } from "@/components/dashboard/orders/order-help-card";
import { OrderItemsCard } from "@/components/dashboard/orders/order-items-card";
import { formatOrderDate } from "@/components/dashboard/orders/order-meta";
import { OrderStatusTracker } from "@/components/dashboard/orders/order-status-tracker";
import { OrderSummaryCard } from "@/components/dashboard/orders/order-summary-card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { orderId },
    select: {
      id: true,
      orderId: true,
      status: true,
      orderPaymentMethod: true,
      TrxNumber: true,
      TrxID: true,
      shippingCost: true,
      discount: true,
      promoCode: true,
      customerName: true,
      phoneNumber: true,
      whatsappNumber: true,
      fullAddress: true,
      orderDate: true,
      userId: true,
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

  // Guard: order must exist and belong to this user
  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/dashboard/orders"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Orders
        </Link>
        <PageHeading
          title={`Order #${order.orderId}`}
          description={`Placed on ${formatOrderDate(order.orderDate, "long")}`}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-5">
          <Panel title="Order status">
            <div className="px-5 pb-5">
              <OrderStatusTracker status={order.status} />
            </div>
          </Panel>
          <OrderItemsCard items={order.orderItems} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <OrderSummaryCard
            orderPaymentMethod={order.orderPaymentMethod}
            TrxNumber={order.TrxNumber}
            TrxID={order.TrxID}
            shippingCost={order.shippingCost}
            discount={order.discount}
            promoCode={order.promoCode}
            orderItems={order.orderItems}
          />
          <OrderDeliveryCard
            customerName={order.customerName}
            phoneNumber={order.phoneNumber}
            whatsappNumber={order.whatsappNumber}
            fullAddress={order.fullAddress}
          />
          <OrderHelpCard />
        </div>
      </div>
    </div>
  );
}
