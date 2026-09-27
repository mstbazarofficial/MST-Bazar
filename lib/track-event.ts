"use client";

function generateEventId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : undefined;
}

type TrackOptions = {
  eventName: string; // "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | ...
  customData?: Record<string, unknown>; // { value, currency, content_ids, content_type, ... }
  userData?: { email?: string; phone?: string; externalId?: string };
};

// Call this from product pages, add-to-cart handlers, checkout, order confirmation, etc.
// It fires the browser pixel AND the server-side CAPI call with the SAME event_id,
// which tells Meta to deduplicate the two into a single event.
export async function trackEvent({
  eventName,
  customData,
  userData,
}: TrackOptions) {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "production") {
    return;
  }
  const eventId = generateEventId();

  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", eventName, customData, { eventID: eventId });
  }

  fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      eventId,
      customData,
      userData,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      eventSourceUrl: window.location.href,
    }),
  }).catch((err) => console.error("CAPI dispatch failed", err));

  return eventId;
}
