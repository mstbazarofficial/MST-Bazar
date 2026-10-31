import type { ExpenseCategory } from "@/generated/prisma/enums";

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  PRODUCT_PURCHASE: "Product Purchase",
  TRANSPORT: "Transport",
  PACKAGING: "Packaging",
  MARKETING: "Marketing",
  SALARY: "Salary",
  RENT: "Rent",
  OTHER: "Other",
};
