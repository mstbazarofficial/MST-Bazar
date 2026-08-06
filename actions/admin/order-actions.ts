// src/actions/admin/order-actions.ts
"use server";

import { OrderStatus } from "@/generated/prisma/enums";
import { OrderWhereInput } from "@/generated/prisma/models";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;

export interface AdminOrderFilters {
  search?: string;
  status?: string;
  month?: string; // Format: "YYYY-MM" (e.g. "2026-06")
  page?: number;
}

export async function getAdminOrders(filters: AdminOrderFilters) {
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
  const where: OrderWhereInput = {
    ...(filters.search && {
      OR: [
        { id: { contains: filters.search, mode: "insensitive" } },
        { customerName: { contains: filters.search, mode: "insensitive" } },
        { phoneNumber: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
    ...(filters.status &&
      filters.status !== "all" && {
        status: filters.status as OrderStatus,
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
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      select: {
        id: true,
        orderId: true,
        customerName: true,
        emailAddress: true,
        status: true,
        shippingCost: true,
        discount: true,
        productCost: true,
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
        payments: {
          take: 1,
          orderBy: { date: "desc" },
          select: {
            method: true,
          },
        },
      },
      orderBy: { orderDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  // 4. Map Results to Match OrdersTable props
  const formattedOrders = orders.map((order) => {
    // Calculate total amount from items if productCost is null
    const itemsTotal = order.orderItems.reduce((acc, item) => {
      const itemPriceAfterDiscount =
        item.discountPercentage > 0
          ? item.price * (1 - item.discountPercentage / 100)
          : item.price;
      return acc + itemPriceAfterDiscount * item.quantity;
    }, 0);

    const baseProductCost = order.productCost ?? itemsTotal;
    const totalAmount = Math.max(
      0,
      baseProductCost + order.shippingCost - order.discount,
    );

    return {
      id: order.id,
      orderId: order.orderId,
      customerName: order.customerName,
      emailAddress: order.emailAddress,
      userAvatar: order.user?.image ?? null,
      orderDate: order.orderDate,
      totalAmount,
      status: order.status,
      paymentMethod: order.payments[0]?.method ?? "COD",
    };
  });

  return {
    orders: formattedOrders,
    total,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function getAdminOrderStats() {
  await requireAdmin();

  const [total, pending, delivered] = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
  ]);

  return { total, pending, delivered };
}

export async function searchProductsForOrder(query: string) {
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
