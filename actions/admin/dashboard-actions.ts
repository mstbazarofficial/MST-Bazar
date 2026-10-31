"use server";

import { getFinanceDues } from "@/actions/admin/finance-actions";
import { requireRole } from "@/lib/admin-auth";
import {
  getDhakaDayRange,
  getDhakaMonthRange,
  getRecentDhakaDays,
  toDhakaDay,
} from "@/lib/dhaka-time";
import { CLOSED_ORDER_STATUSES } from "@/lib/order-payments";
import { prisma } from "@/lib/prisma";
import { calculateOrderTotal } from "@/utils/calculate-order-total";

const SALES_CHART_DAYS = 30;

const dayLabelFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export async function getDashboardOverview() {
  await requireRole(["ADMIN", "MODERATOR"]);

  const days = getRecentDhakaDays(SALES_CHART_DAYS);
  const today = days[days.length - 1];
  const thisMonth = today.slice(0, 7);

  // Early in a long month, the month starts before the chart does.
  const since = new Date(
    Math.min(
      getDhakaDayRange(days[0]).gte.getTime(),
      getDhakaMonthRange(thisMonth)!.gte.getTime(),
    ),
  );

  const [salesOrders, pendingOrders, dues, recentOrders, recentUsers] =
    await Promise.all([
      prisma.order.findMany({
        where: {
          orderDate: { gte: since },
          status: { notIn: CLOSED_ORDER_STATUSES },
        },
        select: {
          orderDate: true,
          shippingCost: true,
          discount: true,
          orderItems: {
            select: { price: true, quantity: true, discountPercentage: true },
          },
        },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      getFinanceDues(),
      prisma.order.findMany({
        take: 5,
        orderBy: { orderDate: "desc" },
        select: {
          id: true,
          orderId: true,
          customerName: true,
          status: true,
          shippingCost: true,
          discount: true,
          orderDate: true,
          orderItems: {
            select: { price: true, quantity: true, discountPercentage: true },
          },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          image: true,
        },
      }),
    ]);

  const salesByDay = new Map<string, { amount: number; orders: number }>();

  salesOrders.forEach((order) => {
    const day = toDhakaDay(order.orderDate);
    const sales = salesByDay.get(day) ?? { amount: 0, orders: 0 };

    sales.amount += calculateOrderTotal(order).finalTotal;
    sales.orders += 1;
    salesByDay.set(day, sales);
  });

  const monthSales = [...salesByDay.entries()]
    .filter(([day]) => day.startsWith(thisMonth))
    .map(([, sales]) => sales);

  return {
    todaySales: salesByDay.get(today) ?? { amount: 0, orders: 0 },
    monthSales: {
      amount: monthSales.reduce((sum, { amount }) => sum + amount, 0),
      orders: monthSales.reduce((sum, { orders }) => sum + orders, 0),
    },
    pendingOrders,
    customerDue: dues.customerDue,
    supplierDue: dues.supplierDue,
    salesChart: days.map((day) => ({
      day: dayLabelFormat.format(Date.parse(day)),
      sales: salesByDay.get(day)?.amount ?? 0,
    })),
    recentOrders: recentOrders.map((order) => ({
      orderId: order.orderId,
      customerName: order.customerName,
      status: order.status,
      orderDate: order.orderDate,
      itemsCount: order.orderItems.length,
      totalAmount: calculateOrderTotal(order).finalTotal,
    })),
    recentUsers,
  };
}
