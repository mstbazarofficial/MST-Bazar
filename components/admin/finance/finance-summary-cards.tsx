import type { getFinanceOverview } from "@/actions/admin/finance-actions";
import { formatPrice } from "@/utils/format-price";
import { HandCoins, Receipt, TrendingUp, Wallet } from "lucide-react";

type Overview = Awaited<ReturnType<typeof getFinanceOverview>>;

// Math.abs because formatPrice rounds down, which would turn -10.5 into -11.
export function formatSigned(amount: number) {
  return `${amount < 0 ? "-" : ""}${formatPrice(Math.abs(amount))}`;
}

export function FinanceSummaryCards({ overview }: { overview: Overview }) {
  const cards = [
    {
      label: "Income",
      value: formatPrice(overview.income),
      detail: "Money received in this period",
      icon: Wallet,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Expenses",
      value: formatPrice(overview.expenses),
      detail: "Bills dated in this period",
      icon: Receipt,
      iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Net Profit",
      value: formatSigned(overview.netProfit),
      detail: "Income minus expenses",
      icon: TrendingUp,
      iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      label: "Total Due",
      value: formatPrice(overview.customerDue + overview.supplierDue),
      detail: `Customers owe ${formatPrice(overview.customerDue)} · You owe suppliers ${formatPrice(overview.supplierDue)}`,
      icon: HandCoins,
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, detail, icon: Icon, iconClass }) => (
        <div
          key={label}
          className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4 shadow-sm"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
          >
            <Icon className="size-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
