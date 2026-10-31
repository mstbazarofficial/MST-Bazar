"use server";
import { ContactStatus } from "@/generated/prisma/enums";
import { ContactSubmissionWhereInput } from "@/generated/prisma/models";
import { requireRole } from "@/lib/admin-auth";
import { getDhakaMonthRange } from "@/lib/dhaka-time";
import { prisma } from "@/lib/prisma";

interface AdminContactFilters {
  search?: string;
  status?: string;
  month?: string; // Format: "YYYY-MM" (e.g. "2026-06")
  page?: number;
}

const PAGE_SIZE = 20;

export async function getAdminContacts(filters: AdminContactFilters) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const page = filters.page && filters.page > 0 ? filters.page : 1;

  // 1. Calculate Date Range if month filter is provided
  const monthRange = getDhakaMonthRange(filters.month);

  // 2. Build Where Clauses
  const where: ContactSubmissionWhereInput = {
    ...(filters.search && {
      OR: [
        { phone: { contains: filters.search, mode: "insensitive" } },
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
    ...(filters.status &&
      filters.status !== "all" && {
        status: filters.status as ContactStatus,
      }),
    ...(monthRange && { createdAt: monthRange }),
  };

  // 3. Query Prisma Transaction
  const [contacts, total] = await prisma.$transaction([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contactSubmission.count({ where }),
  ]);

  return {
    contacts,
    total,
    page,
    pageSize: PAGE_SIZE,
  };
}
export type AdminContactsResult = Awaited<ReturnType<typeof getAdminContacts>>;
