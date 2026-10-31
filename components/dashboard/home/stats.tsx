import { CheckCircle2, LucideIcon, ShoppingBag, Truck, XCircle } from "lucide-react";

export interface OrderStats {
  total: number;
  inProgress: number; // Everything not yet delivered, cancelled or returned
  delivered: number;
  closed: number; // Cancelled & returned
}

interface StatsSectionProps {
  stats: OrderStats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const cards: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Total orders", value: stats.total, icon: ShoppingBag },
    { label: "In progress", value: stats.inProgress, icon: Truck },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle2 },
    { label: "Cancelled or returned", value: stats.closed, icon: XCircle },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
        >
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground sm:text-sm">{label}</dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight text-foreground tabular-nums">
              {value}
            </dd>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Icon className="size-5" />
          </span>
        </div>
      ))}
    </dl>
  );
}
