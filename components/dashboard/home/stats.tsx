import {
  CheckCircle2,
  Clock,
  LucideIcon,
  ShoppingBag,
  Truck,
} from "lucide-react";

export interface OrderStats {
  total: number;
  delivered: number;
  inProgress: number; // Combined SHIPPED & PROCESSING
  pending: number; // PENDING & CONFIRMED
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  sub?: string;
  color: string;
  bgColor: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  color,
  bgColor,
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-start gap-4 transition-all hover:border-border/80">
      <div
        className={`mt-0.5 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}
      >
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-foreground leading-none">
          {value}
        </span>
        <span className="text-sm font-medium text-muted-foreground mt-1.5">
          {label}
        </span>
        {sub && (
          <span className="text-xs text-muted-foreground/70 mt-1">{sub}</span>
        )}
      </div>
    </div>
  );
}

interface StatsSectionProps {
  stats: OrderStats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const cards = [
    {
      label: "Total Orders",
      value: stats.total,
      icon: ShoppingBag,
      color: "text-primary",
      bgColor: "bg-primary/10",
      sub: "All time",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      sub: "Completed",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Truck,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      sub: "Shipped & Processing",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      sub: "Awaiting confirmation",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
