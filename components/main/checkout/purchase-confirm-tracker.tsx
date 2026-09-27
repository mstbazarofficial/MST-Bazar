// app/order-confirmation/[id]/purchase-confirm-tracker.tsx
"use client";
import { useEffect } from "react";

export function PurchaseConfirmTracker({
  orderId,
  eventId,
  value,
  items,
}: {
  orderId: string;
  eventId: string;
  value: number;
  items: { id: string; qty: number }[];
}) {
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).fbq) return;

    (window as any).fbq(
      "track",
      "Purchase",
      {
        value,
        currency: "BDT",
        content_ids: items.map((i) => i.id),
        contents: items.map((i) => ({ id: i.id, quantity: i.qty })),
        order_id: orderId,
      },
      { eventID: eventId }, // must match the server-side event_id exactly
    );
  }, [orderId, eventId, value, items]);

  return null;
}
