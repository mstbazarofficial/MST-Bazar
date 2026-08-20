"use server";
import { ContactStatus } from "@/generated/prisma/enums";
import { ContactSubmissionWhereInput } from "@/generated/prisma/models";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

interface AdminContactFilters {
  search?: string;
  status?: string;
  month?: string; // Format: "YYYY-MM" (e.g. "2026-06")
  page?: number;
}

const PAGE_SIZE = 20;

export async function getAdminContacts(filters: AdminContactFilters) {
  await requireAdmin();

  const page = filters.page && filters.page > 0 ? filters.page : 1;

  // 1. Calculate Date Range if month filter is provided
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (filters.month) {
    const [yearStr, monthStr] = filters.month.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (!isNaN(year) && !isNaN(month)) {
      // First day of the month 00:00:00
      startDate = new Date(year, month - 1, 1);
      // Last day of the month 23:59:59
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    }
  }

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
    ...(startDate &&
      endDate && {
        orderDate: {
          gte: startDate,
          lte: endDate,
        },
      }),
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
