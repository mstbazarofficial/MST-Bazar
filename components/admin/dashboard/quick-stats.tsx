import { Card, CardContent } from "@/components/ui/card";
import { Clock, Layers, Package, ShoppingCart, Users } from "lucide-react";

type QuickStatsProps = {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    pendingOrders: number;
    totalCategories: number;
  };
};

export function QuickStats({ stats }: QuickStatsProps) {
  const items = [
    {
      label: "TOTAL PRODUCTS",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      borderColor: "border-l-amber-500",
      iconColor: "text-amber-500/25",
    },
    {
      label: "CATEGORIES",
      value: stats.totalCategories.toLocaleString(),
      icon: Layers,
      borderColor: "border-l-indigo-500",
      iconColor: "text-indigo-500/25",
    },
    {
      label: "TOTAL ORDERS",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      borderColor: "border-l-emerald-500",
      iconColor: "text-emerald-500/25",
    },
    {
      label: "PENDING ORDERS",
      value: stats.pendingOrders.toLocaleString(),
      icon: Clock,
      borderColor: "border-l-purple-500",
      iconColor: "text-purple-500/25",
    },
    {
      label: "CUSTOMERS",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      borderColor: "border-l-blue-500",
      iconColor: "text-blue-500/25",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <Card
          key={item.label}
          className={`border-y border-r border-border/60 border-l-4 ${item.borderColor} bg-card shadow-xs`}
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
