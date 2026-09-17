import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "@/context/query-provider";
import { requireRole } from "@/lib/admin-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | MST Bazar Admin",
    default: "Dashboard | MST Bazar Admin",
  },
  description: "MST Shop administration panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["ADMIN", "MODERATOR"]);

  return (
    <QueryProvider>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        {/* Lock height and hide overflow on the inset container */}
        <SidebarInset className="flex flex-col h-svh overflow-hidden">
          {/* Main becomes the actual scroll container */}
          <main className="flex-1 overflow-y-auto bg-dashboard-background">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  );
}
