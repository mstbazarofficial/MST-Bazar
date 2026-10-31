"use client";

import { deleteExpense } from "@/actions/admin/expense-mutations";
import type { getExpenses } from "@/actions/admin/finance-actions";
import { DataTablePagination } from "@/components/my-ui/data-table-pagination";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { TableEmptyRow } from "@/components/admin/layout/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModalParam } from "@/hooks/use-modal-param";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { EXPENSE_CATEGORY_LABELS } from "@/utils/expense-category";
import { formatDate } from "@/utils/format-date";
import { formatPrice } from "@/utils/format-price";
import { Pencil, Plus, Receipt, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ExpenseFormModal } from "./expense-form-modal";

export function ExpensesSection({
  data,
  search,
  category,
}: {
  data: Awaited<ReturnType<typeof getExpenses>>;
  search?: string;
  category?: string;
}) {
  const updateParams = useUpdateSearchParams();
  const [addOpen, setAddOpen] = useModalParam("add-expense");
  const [editId, setEditId] = useModalParam("edit-expense");

  const [searchInput, setSearchInput] = useState(search ?? "");
  const [prevSearch, setPrevSearch] = useState(search ?? "");

  if ((search ?? "") !== prevSearch) {
    setPrevSearch(search ?? "");
    setSearchInput(search ?? "");
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (search ?? "")) {
        updateParams({ search: searchInput || undefined });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, search, updateParams]);

  const editing = data.expenses.find((expense) => expense.id === editId);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h2 className="text-base font-semibold text-foreground sm:mr-auto">
          Expenses
        </h2>

        <div className="relative w-full bg-background sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search title, supplier or note..."
            className="w-full pl-9"
          />
        </div>

        <NativeSelect
          aria-label="Category"
          value={category ?? ""}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="sm:w-44"
        >
          <option value="">All categories</option>
          {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>

        <Button size="sm" onClick={() => setAddOpen("true")}>
          <Plus className="size-4" />
          Add Expense
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-52 pl-4">Expense</TableHead>
              <TableHead className="w-40">Category</TableHead>
              <TableHead className="w-32">Date</TableHead>
              <TableHead className="w-36">Saved By</TableHead>
              <TableHead className="w-32 text-right">Amount</TableHead>
              <TableHead className="w-32 text-right">Due</TableHead>
              <TableHead className="w-28 pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.expenses.length === 0 && (
              <TableEmptyRow
                colSpan={7}
                icon={Receipt}
                title="No expenses found."
              />
            )}

            {data.expenses.map((expense) => {
              const due = expense.amount - expense.paidAmount;

              return (
                <TableRow key={expense.id}>
                  <TableCell className="pl-4">
                    <p className="text-sm font-medium text-foreground">
                      {expense.title}
                    </p>
                    {(expense.supplier || expense.note) && (
                      <p className="text-xs text-muted-foreground">
                        {[expense.supplier, expense.note]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {EXPENSE_CATEGORY_LABELS[expense.category]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {expense.createdBy?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatPrice(expense.amount)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {due > 0 ? formatPrice(due) : "Paid"}
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        aria-label={`Edit ${expense.title}`}
                        onClick={() => setEditId(expense.id)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <DeleteDialog
                        title="Delete expense?"
                        description={`This will permanently delete "${expense.title}" and remove it from your totals.`}
                        action={() => deleteExpense(expense.id)}
                        successMessage="Expense deleted."
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Delete ${expense.title}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </DeleteDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {data.total > data.pageSize && (
        <DataTablePagination
          currentPage={data.page}
          pageSize={data.pageSize}
          totalItems={data.total}
          onPageChange={(page) => updateParams({ page: String(page) })}
          itemName="expenses"
        />
      )}

      <ExpenseFormModal
        key={editing?.id ?? "new"}
        open={addOpen === "true" || !!editing}
        onOpenChange={(open) => {
          if (open) return;
          if (editing) setEditId(null);
          else setAddOpen(null);
        }}
        expense={editing}
        supplierNames={data.supplierNames}
      />
    </section>
  );
}
