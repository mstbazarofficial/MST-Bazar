export const dynamic = "force-dynamic";

import { OrderDeliveryCard } from "@/components/dashboard/orders/order-delivery-card";
import { OrderHelpCard } from "@/components/dashboard/orders/order-help-card";
import { OrderItemsCard } from "@/components/dashboard/orders/order-items-card";
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

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(order.orderDate));

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-start gap-3">
        <Link
          href="/dashboard/orders"
          className="h-8 w-8 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shrink-0 mt-0.5"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            Order #{order.orderId}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Placed on {formattedDate}
          </p>
        </div>
      </div>

      {/* Tracker — full width, always on top */}
      <OrderStatusTracker status={order.status} />

      {/* Items */}
      <OrderItemsCard items={order.orderItems} />

      {/* Two-column on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <OrderSummaryCard
          orderPaymentMethod={order.orderPaymentMethod}
          TrxNumber={order.TrxNumber}
          TrxID={order.TrxID}
          shippingCost={order.shippingCost}
          discount={order.discount}
          orderItems={order.orderItems}
        />
        <OrderDeliveryCard
          customerName={order.customerName}
          phoneNumber={order.phoneNumber}
          whatsappNumber={order.whatsappNumber}
          fullAddress={order.fullAddress}
        />
      </div>

      {/* Help */}
      <OrderHelpCard />
    </div>
  );
}
