import type { getDashboardOverview } from "@/actions/admin/dashboard-actions";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/utils/format-price";
import {
  CalendarDays,
  Clock,
  HandCoins,
  ReceiptText,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

type Overview = Awaited<ReturnType<typeof getDashboardOverview>>;

function formatOrderCount(count: number) {
  return `${count.toLocaleString()} ${count === 1 ? "order" : "orders"}`;
}

export function QuickStats({ overview }: { overview: Overview }) {
  const items = [
    {
      label: "TODAY'S SALES",
      value: formatPrice(overview.todaySales.amount),
      detail: formatOrderCount(overview.todaySales.orders),
      href: "/admin/orders",
      icon: ShoppingCart,
      borderColor: "border-l-emerald-500",
      iconColor: "text-emerald-500/25",
    },
    {
      label: "THIS MONTH'S SALES",
      value: formatPrice(overview.monthSales.amount),
      detail: formatOrderCount(overview.monthSales.orders),
      href: "/admin/orders",
      icon: CalendarDays,
      borderColor: "border-l-blue-500",
      iconColor: "text-blue-500/25",
    },
    {
      label: "PENDING ORDERS",
      value: overview.pendingOrders.toLocaleString(),
      detail: "Waiting for confirmation",
      href: "/admin/orders?status=PENDING",
      icon: Clock,
      borderColor: "border-l-purple-500",
      iconColor: "text-purple-500/25",
    },
    {
      label: "CUSTOMERS OWE",
      value: formatPrice(overview.customerDue),
      detail: "Open orders not yet paid",
      href: "/admin/finance",
      icon: HandCoins,
      borderColor: "border-l-amber-500",
      iconColor: "text-amber-500/25",
    },
    {
      label: "YOU OWE SUPPLIERS",
      value: formatPrice(overview.supplierDue),
      detail: "Unpaid supplier bills",
      href: "/admin/finance",
      icon: ReceiptText,
      borderColor: "border-l-rose-500",
      iconColor: "text-rose-500/25",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className="group">
          <Card
            className={`h-full border-y border-r border-border/60 border-l-4 ${item.borderColor} bg-card shadow-xs transition-shadow group-hover:shadow-sm`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  {item.label}
                </span>
                <item.icon className={`size-5 ${item.iconColor}`} />
              </div>

              <div className="mt-1.5 text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {item.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.detail}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
