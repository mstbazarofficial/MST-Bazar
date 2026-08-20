"use client";

import { trackOrderAction } from "@/actions/main/track-order";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { OrderResult } from "./order-result";
import { OrderSearchForm } from "./order-search-form";
import { SupportCard } from "./support-card";

export function TrackOrderClient() {
  const [search, setSearch] = useState<{
    orderId: string;
    phone: string;
  } | null>(null);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["track-order", search?.orderId, search?.phone],
    queryFn: async () => {
      if (!search) return null;
      const result = await trackOrderAction(search.orderId, search.phone);
      if (!result.success) throw new Error(result.error);
      return result.order;
    },
    enabled: !!search,
    retry: false,
    staleTime: 30_000,
  });

  function handleSearch(orderId: string, phone: string) {
    setSearch({ orderId: orderId.trim(), phone: phone.trim() });
  }

  const errorMessage =
    isError && search
      ? "No order found. Please check your Order ID and mobile number."
      : null;

  return (
    <div className="space-y-5">
      {/* Search card */}
      <div className="bg-card border border-border rounded-lg p-6 sm:px-9 shadow-md">
        <OrderSearchForm onSearch={handleSearch} isPending={isFetching} />
      </div>

      {/* Error */}
      {errorMessage && !isFetching && (
        <div
          className="bg-destructive/10 border border-destructive/30 rounded-lg p-3.5 flex items-center gap-2.5 text-destructive text-[0.9rem] font-medium"
          role="alert"
        >
          <AlertCircle size={16} className="shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {isFetching && (
        <div
          className="flex flex-col gap-4 animate-pulse"
          aria-label="Loading order details"
        >
          <div className="h-22.5 bg-muted rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-45 bg-muted rounded-lg" />
            <div className="h-45 bg-muted rounded-lg" />
          </div>
          <div className="h-30 bg-muted rounded-lg" />
        </div>
      )}

      {/* Result */}
      {data && !isFetching && <OrderResult order={data} />}
      {/* Support */}
      <SupportCard />
    </div>
  );
}
