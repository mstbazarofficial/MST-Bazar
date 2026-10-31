"use server";

import type { OrderStatus } from "@/generated/prisma/enums";
import { ProductWhereInput } from "@/generated/prisma/models";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;
const RECENT_ORDERS_LIMIT = 20;
const CLOSED_ORDER_STATUSES: OrderStatus[] = ["CANCELLED", "RETURNED"];

export type ProductAvailabilityFilter = "all" | "available" | "unavailable";

export type AdminProductFilters = {
  search?: string;
  categorySlug?: string;
  availability?: ProductAvailabilityFilter;
  page?: number;
};

export async function getAdminProducts(filters: AdminProductFilters) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const page = filters.page && filters.page > 0 ? filters.page : 1;

  const where: ProductWhereInput = {
    ...(filters.search && {
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { sku: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
    ...(filters.categorySlug && {
      category: { slug: filters.categorySlug },
    }),
    ...(filters.availability === "available" && { isAvailable: true }),
    ...(filters.availability === "unavailable" && { isAvailable: false }),
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        discountPercentage: true,
        unit: true,
        isAvailable: true,
        isPopular: true,
        isCombo: true,
        isTopSelling: true,
        isBestDeal: true,
        priority: true,
        category: { select: { id: true, name: true } },
        images: {
          take: 1,
          select: { url: true },
          orderBy: { isFeatured: "desc" },
        },
      },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      discountPercentage: p.discountPercentage,
      unit: p.unit,
      isAvailable: p.isAvailable,
      isBestDeal: p.isBestDeal,
      isPopular: p.isPopular,
      isCombo: p.isCombo,
      isTopSelling: p.isTopSelling,
      category: p.category,
      image: p.images[0]?.url ?? null,
      slug: p.slug,
      priority: p.priority,
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
  };
}
export async function getAdminProductStats() {
  await requireRole(["ADMIN", "MODERATOR"]);

  const [total, active, bestDeal] = await prisma.$transaction([
    prisma.product.count(),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.product.count({ where: { isBestDeal: true } }),
  ]);

  return { total, active, bestDeal };
}

export async function getAdminProductById(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  return prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
    },
  });
}
export async function getAdminProductBySlug(slug: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
    },
  });
}

export async function getAdminProductOrders(productId: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const counted = { status: { notIn: CLOSED_ORDER_STATUSES } };

  const [items, total, orderCount, units] = await Promise.all([
    prisma.orderItem.findMany({
      where: { productId },
      orderBy: { order: { orderDate: "desc" } },
      take: RECENT_ORDERS_LIMIT,
      select: {
        id: true,
        quantity: true,
        price: true,
        discountPercentage: true,
        order: {
          select: {
            orderId: true,
            status: true,
            customerName: true,
            orderDate: true,
          },
        },
      },
    }),
    prisma.order.count({ where: { orderItems: { some: { productId } } } }),
    prisma.order.count({
      where: { ...counted, orderItems: { some: { productId } } },
    }),
    prisma.orderItem.aggregate({
      where: { productId, order: counted },
      _sum: { quantity: true },
    }),
  ]);

  return {
    items,
    total,
    orderCount,
    unitsSold: units._sum.quantity ?? 0,
  };
}

export async function getAdminCategories() {
  await requireRole(["ADMIN", "MODERATOR"]);
  return prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
}
