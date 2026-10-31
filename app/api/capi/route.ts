// Place this file at: app/api/capi/route.ts

import { SITE_CONFIG } from "@/constants/site";
import { sendCapiEvent } from "@/lib/meta-capi";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MAX_BODY_BYTES = 8 * 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_EVENTS_PER_IP = 60;

const SITE_HOSTNAME = new URL(SITE_CONFIG.url).hostname.replace(/^www\./, "");

// Purchase is left out on purpose: it is only ever sent by the server when an
// order is saved, so a browser request can't report a fake sale.
const capiEventSchema = z.object({
  eventName: z.enum(["ViewContent", "AddToCart", "InitiateCheckout"]),
  eventId: z.string().min(1).max(100),
  eventSourceUrl: z.url().max(2000).optional(),
  fbp: z.string().max(200).optional(),
  fbc: z.string().max(500).optional(),
  userData: z
    .object({
      email: z.string().max(200).optional(),
      phone: z.string().max(30).optional(),
      externalId: z.string().max(100).optional(),
    })
    .optional(),
  customData: z
    .object({
      value: z.number().optional(),
      currency: z.string().max(10).optional(),
      content_ids: z.array(z.string().max(100)).max(50).optional(),
      contents: z
        .array(z.object({ id: z.string().max(100), quantity: z.number() }))
        .max(50)
        .optional(),
      content_type: z.string().max(50).optional(),
      content_name: z.string().max(300).optional(),
      num_items: z.number().optional(),
    })
    .optional(),
});

function isAllowedOrigin(origin: string | null) {
  if (process.env.NODE_ENV !== "production") return true;
  if (!origin) return false;

  try {
    const { hostname } = new URL(origin);
    return hostname === SITE_HOSTNAME || hostname === `www.${SITE_HOSTNAME}`;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req.headers.get("origin"))) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const ip = getClientIp(req.headers);

  if (!checkRateLimit(`capi:${ip}`, MAX_EVENTS_PER_IP, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const rawBody = await req.text();

    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false }, { status: 413 });
    }

    const parsed = capiEventSchema.safeParse(JSON.parse(rawBody));

    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const body = parsed.data;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    await sendCapiEvent({
      eventName: body.eventName,
      eventId: body.eventId,
      eventSourceUrl: body.eventSourceUrl,
      actionSource: "website",
      userData: {
        ...body.userData,
        clientIpAddress: ip === "unknown" ? undefined : ip,
        clientUserAgent: userAgent,
        fbp: body.fbp,
        fbc: body.fbc,
      },
      customData: body.customData && {
        ...body.customData,
        contents: body.customData.contents
          ? JSON.stringify(body.customData.contents)
          : undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CAPI route error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
