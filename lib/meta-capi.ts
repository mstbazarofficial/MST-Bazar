import crypto from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID!;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_FB_CAPI_ACCESS_TOKEN!;
const TEST_EVENT_CODE = process.env.NEXT_PUBLIC_FB_TEST_EVENT_CODE; // set only while testing in Events Manager
const GRAPH_API_VERSION = "v26.0";

function sha256(value: string) {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

type UserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string; // your internal user/session id — improves match quality
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string; // _fbp cookie, set by the pixel
  fbc?: string; // _fbc cookie, set when a user arrives via an ad click
};

type CustomData = Record<string, string | number | string[] | undefined>;

export type CapiEvent = {
  eventName: string; // "Purchase" | "AddToCart" | "ViewContent" | "InitiateCheckout" | ...
  eventId: string; // MUST match the client-side pixel eventID for deduplication
  eventSourceUrl?: string;
  userData: UserData;
  customData?: CustomData;
  actionSource?: "website" | "app" | "system_generated" | "other";
};

export async function sendCapiEvent(event: CapiEvent) {
  const {
    eventName,
    eventId,
    eventSourceUrl,
    userData,
    customData,
    actionSource = "website",
  } = event;

  // Meta requires PII fields (email, phone, name) to be SHA-256 hashed.
  // IP, user agent, fbp, fbc, and external_id are sent as-is (external_id is hashed too).
  const hashedUserData: Record<string, string> = {};
  if (userData.email) hashedUserData.em = sha256(userData.email);
  if (userData.phone)
    hashedUserData.ph = sha256(userData.phone.replace(/[^\d]/g, ""));
  if (userData.firstName) hashedUserData.fn = sha256(userData.firstName);
  if (userData.lastName) hashedUserData.ln = sha256(userData.lastName);
  if (userData.externalId)
    hashedUserData.external_id = sha256(userData.externalId);
  if (userData.clientIpAddress)
    hashedUserData.client_ip_address = userData.clientIpAddress;
  if (userData.clientUserAgent)
    hashedUserData.client_user_agent = userData.clientUserAgent;
  if (userData.fbp) hashedUserData.fbp = userData.fbp;
  if (userData.fbc) hashedUserData.fbc = userData.fbc;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: actionSource,
        user_data: hashedUserData,
        custom_data: customData,
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Meta CAPI error:", err);
    throw new Error(`Meta CAPI request failed: ${res.status}`);
  }

  return res.json();
}
