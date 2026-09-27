// app/products/[slug]/product-view-tracker.tsx
"use client";
import { trackEvent } from "@/lib/track-event";
import { useEffect } from "react";

export function ProductViewTracker({
  product,
}: {
  product: { id: string; name: string; price: number };
}) {
  useEffect(() => {
    trackEvent({
      eventName: "ViewContent",
      customData: {
        content_ids: [product.id],
        content_type: "product",
        content_name: product.name,
        value: product.price,
        currency: "BDT",
      },
    });
  }, [product.id]);

  return null;
}
