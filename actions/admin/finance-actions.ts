"use server";

import type { ExpenseCategory } from "@/generated/prisma/enums";
import type { ExpenseWhereInput } from "@/generated/prisma/models";
import { requireRole } from "@/lib/admin-auth";
import {
  getDhakaMonthOptions,
  getDhakaMonthRange,
  toDhakaDay,
} from "@/lib/dhaka-time";
import { findDuplicateTrxIds } from "@/lib/duplicate-trx-ids";
import {
  resolveFinancePeriod,
  type FinancePeriodFilters,
} from "@/lib/finance-period";
import { CLOSED_ORDER_STATUSES, getOrderDue } from "@/lib/order-payments";
import { prisma } from "@/lib/prisma";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { EXPENSE_CATEGORY_LABELS } from "@/utils/expense-category";

const EXPENSE_PAGE_SIZE = 20;

export interface ExpenseFilters extends FinancePeriodFilters {
  search?: string;
  category?: string;
  page?: number;
}

function sumByMonth(rows: { date: Date; amount: number }[]) {
  const totals = new Map<string, number>();

  rows.forEach(({ date, amount }) => {
    const month = toDhakaDay(date).slice(0, 7);
    totals.set(month, (totals.get(month) ?? 0) + amount);
  });

  return totals;
}

// Always the last 12 months, so the trend stays visible under any filter.
async function getMonthlyChart() {
  const months = getDhakaMonthOptions(12).reverse();
  const since = { gte: getDhakaMonthRange(months[0].value)!.gte };

  const [payments, expenses] = await Promise.all([
    prisma.payment.findMany({
      where: { date: since },
      select: { date: true, amount: true },
    }),
    prisma.expense.findMany({
      where: { date: since },
      select: { date: true, amount: true },
    }),
  ]);

  const incomeByMonth = sumByMonth(payments);
  const expensesByMonth = sumByMonth(expenses);

  return months.map(({ value, label }) => ({
    month: label,
    income: incomeByMonth.get(value) ?? 0,
    expenses: expensesByMonth.get(value) ?? 0,
  }));
}

async function getUnpaidOrders() {
  const orders = await prisma.order.findMany({
    where: { status: { notIn: CLOSED_ORDER_STATUSES } },
    orderBy: { orderDate: "asc" },
    select: {
      id: true,
      orderId: true,
      customerName: true,
      phoneNumber: true,
      status: true,
      orderPaymentMethod: true,
      TrxID: true,
      TrxNumber: true,
      orderDate: true,
      shippingCost: true,
      discount: true,
      orderItems: {
        select: { price: true, quantity: true, discountPercentage: true },
      },
      payments: { select: { amount: true } },
    },
  });

  const unpaid = orders
    .map((order) => ({ order, due: getOrderDue(order) }))
    .filter(({ due }) => due > 0);

  const duplicateTrxIds = await findDuplicateTrxIds(
    unpaid.flatMap(({ order }) => (order.TrxID ? [order.TrxID] : [])),
  );

  return unpaid.map(({ order, due }) => ({
    id: order.id,
    orderId: order.orderId,
    customerName: order.customerName,
    phoneNumber: order.phoneNumber,
    status: order.status,
    paymentMethod: order.orderPaymentMethod,
    TrxID: order.TrxID,
    TrxNumber: order.TrxNumber,
    orderDate: order.orderDate,
    total: calculateOrderTotal(order).finalTotal,
    due,
    hasDuplicateTrxId:
      !!order.TrxID && duplicateTrxIds.has(order.TrxID.toUpperCase()),
  }));
}

async function getSupplierDues() {
  const bills = await prisma.expense.findMany({
    where: { paidAmount: { lt: prisma.expense.fields.amount } },
    orderBy: { date: "asc" },
    select: {
      id: true,
      title: true,
      supplier: true,
      date: true,
      amount: true,
      paidAmount: true,
    },
  });

  // Names are typed by hand, so "Rahim" and "rahim" are one supplier.
  const suppliers = new Map<
    string,
    { name: string; due: number; bills: typeof bills }
  >();

  bills.forEach((bill) => {
    const name = bill.supplier ?? "Unnamed supplier";
    const key = name.toLowerCase();
    const supplier = suppliers.get(key) ?? { name, due: 0, bills: [] };

    supplier.due += bill.amount - bill.paidAmount;
    supplier.bills.push(bill);
    suppliers.set(key, supplier);
  });

  return [...suppliers.values()].sort((a, b) => b.due - a.due);
}

export async function getFinanceOverview(filters: FinancePeriodFilters) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const date = resolveFinancePeriod(filters);

  const [income, expenses, categories, chart, unpaidOrders, supplierDues] =
    await Promise.all([
      prisma.payment.aggregate({ where: { date }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { date }, _sum: { amount: true } }),
      prisma.expense.groupBy({
        by: ["category"],
        where: { date },
        _sum: { amount: true },
      }),
      getMonthlyChart(),
      getUnpaidOrders(),
      getSupplierDues(),
    ]);

  const totalIncome = income._sum.amount ?? 0;
  const totalExpenses = expenses._sum.amount ?? 0;

  return {
    income: totalIncome,
    expenses: totalExpenses,
    netProfit: totalIncome - totalExpenses,
    customerDue: unpaidOrders.reduce((sum, { due }) => sum + due, 0),
    supplierDue: supplierDues.reduce((sum, { due }) => sum + due, 0),
    categories: categories
      .map(({ category, _sum }) => ({
        category,
        label: EXPENSE_CATEGORY_LABELS[category],
        amount: _sum.amount ?? 0,
      }))
      .sort((a, b) => b.amount - a.amount),
    chart,
    unpaidOrders,
    supplierDues,
  };
}

export async function getFinanceDues() {
  await requireRole(["ADMIN", "MODERATOR"]);

  const [unpaidOrders, supplierDues] = await Promise.all([
    getUnpaidOrders(),
    getSupplierDues(),
  ]);

  return {
    customerDue: unpaidOrders.reduce((sum, { due }) => sum + due, 0),
    supplierDue: supplierDues.reduce((sum, { due }) => sum + due, 0),
  };
}

export async function getExpenses(filters: ExpenseFilters) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const page = filters.page && filters.page > 0 ? filters.page : 1;

  const where: ExpenseWhereInput = {
    date: resolveFinancePeriod(filters),
    ...(filters.category &&
      filters.category in EXPENSE_CATEGORY_LABELS && {
        category: filters.category as ExpenseCategory,
      }),
    ...(filters.search && {
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { supplier: { contains: filters.search, mode: "insensitive" } },
        { note: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
  };

  const [expenses, total, suppliers] = await Promise.all([
    prisma.expense.findMany({
      where,
      include: { createdBy: { select: { name: true } } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * EXPENSE_PAGE_SIZE,
      take: EXPENSE_PAGE_SIZE,
    }),
    prisma.expense.count({ where }),
    prisma.expense.findMany({
      where: { supplier: { not: null } },
      distinct: ["supplier"],
      orderBy: { supplier: "asc" },
      select: { supplier: true },
    }),
  ]);

  return {
    expenses,
    total,
    page,
    pageSize: EXPENSE_PAGE_SIZE,
    supplierNames: suppliers.flatMap(({ supplier }) =>
      supplier ? [supplier] : [],
    ),
  };
}
