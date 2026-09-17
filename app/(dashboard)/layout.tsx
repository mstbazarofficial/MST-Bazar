import type { Metadata } from "next";

import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";
import { DashboardNav } from "@/components/dashboard/layout/dashboard-nav";
import { QueryProvider } from "@/context/query-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | MST Bazar Dashboard",
    default: "My Account",
  },
  description: "User dashboard and profile management",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <DashboardHeader />
      <div className="min-h-[calc(100vh-4rem)] bg-dashboard-background">
        <div className="max-w-360 w-full mx-auto flex gap-6 px-4 py-6 md:px-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-22">
              <DashboardNav />
            </div>
          </aside>

          {/* Main content — flex-1 + min-w-0 is the fix for the overflow/squish issue */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </QueryProvider>
  );
}
