"use server";

import { requireRole } from "@/lib/admin-auth";
import { getDhakaDayRange } from "@/lib/dhaka-time";
import { prisma } from "@/lib/prisma";
import {
  expenseSchema,
  type ExpenseInput,
} from "@/validation/expense.validation";
import { revalidatePath } from "next/cache";

export async function upsertExpense(input: ExpenseInput) {
  const user = await requireRole(["ADMIN", "MODERATOR"]);

  const parsed = expenseSchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: parsed.error.issues[0].message };

  const { id, ...data } = parsed.data;

  const fields = {
    ...data,
    supplier: data.supplier || null,
    note: data.note || null,
    date: getDhakaDayRange(data.date).gte,
  };

  try {
    if (id) {
      await prisma.expense.update({ where: { id }, data: fields });
    } else {
      await prisma.expense.create({
        data: { ...fields, createdById: user.id },
      });
    }

    revalidatePath("/admin/finance");

    return { success: true as const };
  } catch (error) {
    console.error("Failed to save expense", error);
    return {
      success: false as const,
      error: "Something went wrong while saving the expense.",
    };
  }
}

export async function deleteExpense(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  await prisma.expense.delete({ where: { id } });

  revalidatePath("/admin/finance");
}

export async function markExpensePaid(id: string) {
  await requireRole(["ADMIN", "MODERATOR"]);

  const expense = await prisma.expense.findUniqueOrThrow({ where: { id } });

  await prisma.expense.update({
    where: { id },
    data: { paidAmount: expense.amount },
  });

  revalidatePath("/admin/finance");
}
