import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";
import { DashboardNav } from "@/components/dashboard/layout/dashboard-nav";
import { QueryProvider } from "@/context/query-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | MST Bazar Dashboard",
    default: "My Account",
  },
  description: "User dashboard and profile management",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="min-h-screen w-full bg-primary/5 flex flex-col">
        {/* Full Width Top Header */}
        <DashboardHeader />

        {/* Main Centered Body Layout */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Desktop Left Navigation Card */}
            <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
              <DashboardNav />
            </aside>

            {/* Page Content Area */}
            <main className="flex-1 min-w-0 w-full">{children}</main>
          </div>
        </div>
      </div>
    </QueryProvider>
  );
}
