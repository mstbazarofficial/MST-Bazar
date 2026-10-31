// src/actions/admin/order-actions.ts
"use server";

import { Prisma } from "@/generated/prisma/client";
import { OrderStatus } from "@/generated/prisma/enums";
import { OrderWhereInput } from "@/generated/prisma/models";
import { requireRole } from "@/lib/admin-auth";
import { getDhakaMonthRange } from "@/lib/dhaka-time";
import { findDuplicateTrxIds } from "@/lib/duplicate-trx-ids";
import { CLOSED_ORDER_STATUSES, getOrderDue } from "@/lib/order-payments";
import { prisma } from "@/lib/prisma";
import { calculateOrderTotal } from "@/utils/calculate-order-total";

const PAGE_SIZE = 20;

export interface AdminOrderFilters {
  search?: string;
  status?: string;
  month?: string; // Format: "YYYY-MM" (e.g. "2026-06")
  page?: number;
}

export async function getAdminOrders(filters: AdminOrderFilters) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const page = filters.page && filters.page > 0 ? filters.page : 1;

  // 1. Calculate Date Range if month filter is provided
  const monthRange = getDhakaMonthRange(filters.month);

  // 2. Build Where Clauses
  const where: OrderWhereInput = {
    ...(filters.search && {
      OR: [
        { orderId: { contains: filters.search, mode: "insensitive" } },
        { customerName: { contains: filters.search, mode: "insensitive" } },
        { emailAddress: { contains: filters.search, mode: "insensitive" } },
        { phoneNumber: { contains: filters.search, mode: "insensitive" } },
        { TrxID: { contains: filters.search, mode: "insensitive" } },
        { promoCode: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
    ...(filters.status &&
      filters.status !== "all" && {
        status: filters.status as OrderStatus,
      }),
    ...(monthRange && { orderDate: monthRange }),
  };

  // 3. Query Prisma Transaction
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      select: {
        id: true,
        orderId: true,
        customerName: true,
        emailAddress: true,
        phoneNumber: true,
        status: true,
        shippingCost: true,
        discount: true,
        promoCode: true,
        orderPaymentMethod: true,
        TrxID: true,
        orderDate: true,
        user: {
          select: {
            image: true, // User avatar (if linked)
          },
        },
        orderItems: {
          select: {
            price: true,
            quantity: true,
            discountPercentage: true,
          },
        },
        payments: { select: { amount: true } },
      },
      orderBy: { orderDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  const duplicateTrxIds = await findDuplicateTrxIds(
    orders.flatMap((order) => (order.TrxID ? [order.TrxID] : [])),
  );

  // 4. Map Results to Match OrdersTable props
  const formattedOrders = orders.map((order) => {
    return {
      id: order.id,
      orderId: order.orderId,
      customerName: order.customerName,
      emailAddress: order.emailAddress,
      phoneNumber: order.phoneNumber,
      userAvatar: order.user?.image ?? null,
      orderDate: order.orderDate,
      totalAmount: calculateOrderTotal(order).finalTotal,
      due: CLOSED_ORDER_STATUSES.includes(order.status)
        ? 0
        : getOrderDue(order),
      promoCode: order.promoCode,
      status: order.status,
      paymentMethod: order.orderPaymentMethod,
      TrxID: order.TrxID,
      hasDuplicateTrxId:
        !!order.TrxID && duplicateTrxIds.has(order.TrxID.toUpperCase()),
    };
  });

  return {
    orders: formattedOrders,
    total,
    page,
    pageSize: PAGE_SIZE,
  };
}

const orderDetailInclude = {
  orderItems: { orderBy: { createdAt: "asc" } },
  payments: { orderBy: { date: "desc" } },
  notes: { orderBy: { createdAt: "desc" } },
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} satisfies Prisma.OrderInclude;

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: typeof orderDetailInclude;
}>;

export async function getAdminOrderDetail(orderId: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const order = await prisma.order.findUnique({
    where: { orderId },
    include: orderDetailInclude,
  });

  if (!order) return null;

  const duplicateTrxCount = order.TrxID
    ? await prisma.order.count({
        where: {
          id: { not: order.id },
          TrxID: { equals: order.TrxID, mode: "insensitive" },
        },
      })
    : 0;

  return { order, duplicateTrxCount };
}

export async function getAdminOrderStats() {
  await requireRole(["ADMIN", "MODERATOR"]);

  const [total, pending, delivered] = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
  ]);

  return { total, pending, delivered };
}

export async function searchProductsForOrder(query: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  if (!query || query.trim().length === 0) return [];

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 8,
    select: {
      id: true,
      title: true,
      sku: true,
      price: true,
      discountPercentage: true,
      isAvailable: true,
      images: {
        take: 1,
        orderBy: { isFeatured: "desc" },
        select: { url: true },
      },
    },
  });

  return products.map((p) => ({
    id: p.id,
    title: p.title,
    sku: p.sku,
    price: p.price,
    discountPercentage: p.discountPercentage,
    isAvailable: p.isAvailable,
    image: p.images[0]?.url ?? null,
  }));
}
