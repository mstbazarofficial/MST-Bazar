"use server";
import { Role } from "@/generated/prisma/enums";
import { UserWhereInput } from "@/generated/prisma/models";
import { requireRole } from "@/lib/admin-auth";
import { getDhakaMonthRange } from "@/lib/dhaka-time";
import { prisma } from "@/lib/prisma";

export async function searchUsersForAdmin(query: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  if (!query || query.trim().length === 0) return [];

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      image: true,
      whatsappNumber: true,
      fullAddress: true,
      role: true,
      banned: true,
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phoneNumber: u.phoneNumber,
    image: u.image,
    whatsappNumber: u.whatsappNumber,
    fullAddress: u.fullAddress,
    role: u.role,
    banned: u.banned,
  }));
}

interface AdminUserFilters {
  search?: string;
  role?: string;
  page?: number;
  month?: string;
}

const PAGE_SIZE = 20;

export async function getAdminUsers(filters: AdminUserFilters) {
  await requireRole(["ADMIN", "MODERATOR"]);

  // 1. Calculate Date Range if month filter is provided
  const monthRange = getDhakaMonthRange(filters.month);
  const page = filters.page && filters.page > 0 ? filters.page : 1;

  // 2. Build Where Clauses
  const where: UserWhereInput = {
    ...(filters.search && {
      OR: [
        { phoneNumber: { contains: filters.search, mode: "insensitive" } },
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
    ...(filters.role &&
      filters.role !== "all" && {
        role: filters.role as Role,
      }),
    ...(monthRange && { createdAt: monthRange }),
  };

  // 3. Query Prisma Transaction
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    pageSize: PAGE_SIZE,
  };
}
export type AdminUsersResult = Awaited<ReturnType<typeof getAdminUsers>>;

export async function getAdminUserDetail(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const now = new Date();

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      phoneNumber: true,
      whatsappNumber: true,
      fullAddress: true,
      createdAt: true,
      updatedAt: true,
      banned: true,
      banReason: true,
      banExpires: true,

      orders: {
        orderBy: { orderDate: "desc" },
        select: {
          id: true,
          orderId: true,
          status: true,
          orderDate: true,
          shippingCost: true,
          discount: true,
          orderItems: {
            select: {
              price: true,
              quantity: true,
              discountPercentage: true,
            },
          },
        },
      },

      cart: {
        select: {
          items: {
            select: {
              id: true,
              quantity: true,
              product: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  discountPercentage: true,
                  images: {
                    select: { url: true, isFeatured: true },
                  },
                },
              },
            },
          },
        },
      },

      sessions: {
        where: { expiresAt: { gt: now } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
          expiresAt: true,
        },
      },
    },
  });
}
