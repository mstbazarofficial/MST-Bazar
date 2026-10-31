"use client";

import OrderDetailSkeleton from "@/app/(admin)/admin/orders/[orderId]/skeleton";
import { OrderDetailsClient } from "@/components/admin/orders/order-details-client";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";

export function OrderDetailPageClient() {
  const { orderId } = useParams<{ orderId: string }>();

  const { data } = useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: () => adminFetch("order", { orderId }),
  });

  if (data === undefined) return <OrderDetailSkeleton />;
  if (data === null) notFound();

  return (
    <OrderDetailsClient
      order={data.order}
      duplicateTrxCount={data.duplicateTrxCount}
    />
  );
}
