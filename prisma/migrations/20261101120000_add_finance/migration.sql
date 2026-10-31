-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('PRODUCT_PURCHASE', 'TRANSPORT', 'PACKAGING', 'MARKETING', 'SALARY', 'RENT', 'OTHER');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "autoRecorded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL,
    "supplier" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- CreateIndex
CREATE INDEX "Payment_date_idx" ON "Payment"("date");

-- Backfill: COD orders delivered before this release have no payment, so they
-- would count as unpaid and be missing from income. Mirrors calculateOrderTotal.
-- The order's last update is the closest record of when it was delivered.
WITH "ItemTotals" AS (
    SELECT "orderId",
           SUM(FLOOR("price" * (1 - "discountPercentage" / 100) + 0.5) * "quantity") AS "subtotal"
    FROM "OrderItem"
    GROUP BY "orderId"
),
"PaidTotals" AS (
    SELECT "orderId", SUM("amount") AS "paid"
    FROM "Payment"
    GROUP BY "orderId"
),
"Dues" AS (
    SELECT o."id",
           o."updatedAt",
           GREATEST(0, COALESCE(i."subtotal", 0) - o."discount" + o."shippingCost") - COALESCE(p."paid", 0) AS "due"
    FROM "Order" o
    LEFT JOIN "ItemTotals" i ON i."orderId" = o."id"
    LEFT JOIN "PaidTotals" p ON p."orderId" = o."id"
    WHERE o."status" = 'DELIVERED' AND o."orderPaymentMethod" = 'CASH_ON_DELIVERY'
)
INSERT INTO "Payment" ("id", "orderId", "amount", "method", "date", "note", "autoRecorded")
SELECT gen_random_uuid()::text, "id", "due", 'CASH_ON_DELIVERY', "updatedAt", 'Cash collected on delivery', true
FROM "Dues"
WHERE "due" > 0;
