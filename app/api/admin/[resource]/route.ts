import { requireRole } from "@/lib/admin-auth";
import { adminReaders, type AdminReaders } from "@/lib/admin-readers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const { resource } = await params;
  if (!Object.hasOwn(adminReaders, resource)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = await adminReaders[resource as keyof AdminReaders](
    request.nextUrl.searchParams,
  );

  return NextResponse.json(data, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
