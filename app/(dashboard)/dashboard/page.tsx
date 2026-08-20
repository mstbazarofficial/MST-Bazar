"use client";

import QuickLinkSection from "@/components/dashboard/home/quick-link";
import StatsSection from "@/components/dashboard/home/stats";
import WelcomeSection from "@/components/dashboard/home/welcome";

// --- Stat Card ---
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  color?: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  color = "text-primary",
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-start gap-4">
      <div
        className={`mt-0.5 h-10 w-10 rounded-xl flex items-center justify-center bg-primary/8 shrink-0`}
      >
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-foreground leading-none">
          {value}
        </span>
        <span className="text-sm text-muted-foreground mt-1">{label}</span>
        {sub && (
          <span className="text-xs text-muted-foreground/70 mt-1">{sub}</span>
        )}
      </div>
    </div>
  );
}

// --- Order Row ---
interface Order {
  id: string;
  date: string;
  status: "Delivered" | "Processing" | "Shipped" | "Cancelled";
  total: string;
  items: number;
}

const statusStyles: Record<Order["status"], string> = {
  Delivered: "bg-emerald-500/10 text-emerald-600",
  Processing: "bg-amber-500/10 text-amber-600",
  Shipped: "bg-blue-500/10 text-blue-600",
  Cancelled: "bg-destructive/10 text-destructive",
};

const recentOrders: Order[] = [
  {
    id: "#ORD-8821",
    date: "Aug 17, 2026",
    status: "Delivered",
    total: "৳ 1,240",
    items: 3,
  },
  {
    id: "#ORD-8819",
    date: "Aug 14, 2026",
    status: "Shipped",
    total: "৳ 680",
    items: 1,
  },
  {
    id: "#ORD-8801",
    date: "Aug 9, 2026",
    status: "Processing",
    total: "৳ 3,150",
    items: 5,
  },
  {
    id: "#ORD-8790",
    date: "Aug 3, 2026",
    status: "Delivered",
    total: "৳ 520",
    items: 2,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeSection />

      <StatsSection
        stats={{
          total: 120,
          delivered: 80,
          inProgress: 30,
          pending: 10,
        }}
      />

      <QuickLinkSection />
    </div>
  );
}
