"use client";

import { markExpensePaid } from "@/actions/admin/expense-mutations";
import type { getFinanceOverview } from "@/actions/admin/finance-actions";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/layout/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/format-date";
import { formatPrice } from "@/utils/format-price";
import { CheckCheck, CircleCheck } from "lucide-react";

type SupplierDue = Awaited<
  ReturnType<typeof getFinanceOverview>
>["supplierDues"][number];

export function SupplierDuesCard({ suppliers }: { suppliers: SupplierDue[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Supplier dues</CardTitle>
        <p className="text-sm text-muted-foreground">
          Unpaid bills. For a part payment, edit the expense.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {suppliers.length === 0 && (
          <EmptyState
            icon={CircleCheck}
            title="Nothing is owed to suppliers."
          />
        )}

        {suppliers.map((supplier) => (
          <div key={supplier.name} className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {supplier.name}
              </p>
              <p className="shrink-0 text-sm font-semibold text-foreground">
                {formatPrice(supplier.due)}
              </p>
            </div>

            {supplier.bills.map((bill) => {
              const due = bill.amount - bill.paidAmount;

              return (
                <div
                  key={bill.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">
                      {bill.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(bill.date)} · {formatPrice(due)} due of{" "}
                      {formatPrice(bill.amount)}
                    </p>
                  </div>

                  <DeleteDialog
                    title={`Mark ${formatPrice(due)} as paid?`}
                    description={`This marks "${bill.title}" as fully paid to ${supplier.name}.`}
                    action={() => markExpensePaid(bill.id)}
                    successMessage="Bill marked as paid."
                    errorMessage="Failed to update the bill."
                    confirmText="Mark as paid"
                    loadingText="Saving..."
                    confirmVariant="default"
                  >
                    <Button size="sm" variant="outline" className="shrink-0">
                      <CheckCheck className="size-3.5" />
                      Paid
                    </Button>
                  </DeleteDialog>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
