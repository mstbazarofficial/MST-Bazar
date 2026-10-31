import { ExpenseCategory } from "@/generated/prisma/enums";
import { z } from "zod";

export const expenseSchema = z
  .object({
    id: z.string().optional(),
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title is too long"),
    category: z.enum(ExpenseCategory, { message: "Select a category" }),
    amount: z.number("Amount is required").positive("Amount must be above 0"),
    paidAmount: z.number().min(0, "Paid amount cannot be negative"),
    supplier: z.string().trim().max(100, "Supplier name is too long"),
    date: z.iso.date("Date is required"),
    note: z.string().trim().max(1000, "Note is too long"),
  })
  .refine((data) => data.paidAmount <= data.amount, {
    message: "Paid amount cannot be more than the bill",
    path: ["paidAmount"],
  })
  .refine((data) => data.paidAmount >= data.amount || !!data.supplier, {
    message: "Add the supplier so the due amount can be tracked",
    path: ["supplier"],
  });

export type ExpenseInput = z.input<typeof expenseSchema>;
