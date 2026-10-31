"use client";

import {
  FinanceDuesSkeleton,
  FinanceExpensesSkeleton,
  FinanceOverviewSkeleton,
} from "@/app/(admin)/admin/finance/skeleton";
import { ExpenseCategoryCard } from "@/components/admin/finance/expense-category-card";
import { ExpensesSection } from "@/components/admin/finance/expenses-section";
import { FinanceMonthlyChart } from "@/components/admin/finance/finance-monthly-chart";
import { FinanceMonthlyTable } from "@/components/admin/finance/finance-monthly-table";
import { FinancePeriodFilter } from "@/components/admin/finance/finance-period-filter";
import { FinanceSummaryCards } from "@/components/admin/finance/finance-summary-cards";
import { SupplierDuesCard } from "@/components/admin/finance/supplier-dues-card";
import { UnpaidOrdersCard } from "@/components/admin/finance/unpaid-orders-card";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { adminFetch } from "@/lib/admin-fetch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "expenses", label: "Expenses" },
  { value: "customer-dues", label: "Customer Dues" },
  { value: "supplier-dues", label: "Supplier Dues" },
];

export function FinancePageClient() {
  const searchParams = useSearchParams();
  const updateParams = useUpdateSearchParams();

  const requestedTab = searchParams.get("tab");
  const tab = TABS.some(({ value }) => value === requestedTab)
    ? requestedTab
    : "overview";

  const filters = useMemo(
    () => ({
      period: searchParams.get("period") ?? undefined,
      month: searchParams.get("month") ?? undefined,
      year: searchParams.get("year") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
    }),
    [searchParams],
  );

  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const page = Number(searchParams.get("page")) || 1;

  // Both dues tabs read their lists from the overview.
  const { data: overview } = useQuery({
    queryKey: ["admin-finance", filters],
    queryFn: () => adminFetch("financeOverview", filters),
    placeholderData: keepPreviousData,
    enabled: tab !== "expenses",
  });

  const expenseFilters = { ...filters, search, category, page };
  const { data: expenses } = useQuery({
    queryKey: ["admin-expenses", expenseFilters],
    queryFn: () => adminFetch("expenses", expenseFilters),
    placeholderData: keepPreviousData,
    enabled: tab === "expenses",
  });

  return (
    <>
      <PageHeader title="Finance" />

      <Tabs
        value={tab}
        onValueChange={(next) =>
          updateParams({ tab: next === "overview" ? undefined : String(next) })
        }
        className="sticky top-14 z-5 border-b bg-card pt-1"
      >
        <TabsList
          variant="line"
          className="w-full flex-wrap justify-start px-2 group-data-horizontal/tabs:h-auto sm:px-4"
        >
          {TABS.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-9 flex-none px-3 after:inset-x-0 after:-bottom-0.75 after:h-0.5 after:bg-primary"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        {(tab === "overview" || tab === "expenses") && (
          <FinancePeriodFilter filters={filters} />
        )}

        {tab === "overview" &&
          (overview ? (
            <>
              <FinanceSummaryCards overview={overview} />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <FinanceMonthlyChart data={overview.chart} />
                </div>
                <div className="lg:col-span-4">
                  <ExpenseCategoryCard categories={overview.categories} />
                </div>
              </div>

              <FinanceMonthlyTable data={overview.chart} />
            </>
          ) : (
            <FinanceOverviewSkeleton />
          ))}

        {tab === "expenses" &&
          (expenses ? (
            <ExpensesSection
              data={expenses}
              search={search}
              category={category}
            />
          ) : (
            <FinanceExpensesSkeleton />
          ))}

        {tab === "customer-dues" &&
          (overview ? (
            <UnpaidOrdersCard orders={overview.unpaidOrders} />
          ) : (
            <FinanceDuesSkeleton
              title="Unpaid orders"
              description="All open orders with money still to collect, oldest first"
            />
          ))}

        {tab === "supplier-dues" &&
          (overview ? (
            <SupplierDuesCard suppliers={overview.supplierDues} />
          ) : (
            <FinanceDuesSkeleton
              title="Supplier dues"
              description="Unpaid bills. For a part payment, edit the expense."
            />
          ))}
      </main>
    </>
  );
}
