// Place this file at: app/api/capi/route.ts

import { sendCapiEvent } from "@/lib/meta-capi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const userAgent = req.headers.get("user-agent") ?? undefined;

    await sendCapiEvent({
      eventName: body.eventName,
      eventId: body.eventId,
      eventSourceUrl: body.eventSourceUrl,
      actionSource: "website",
      userData: {
        ...body.userData,
        clientIpAddress: ip,
        clientUserAgent: userAgent,
        fbp: body.fbp,
        fbc: body.fbc,
      },
      customData: body.customData,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CAPI route error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
