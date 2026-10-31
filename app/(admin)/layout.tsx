import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminQueryProvider } from "@/context/admin-query-provider";
import { requireRole } from "@/lib/admin-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | MST Bazar Admin",
    default: "Dashboard | MST Bazar Admin",
  },
  description: "MST Bazar administration panel",
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
    <AdminQueryProvider>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        {/* Lock height and hide overflow on the inset container */}
        <SidebarInset className="flex flex-col h-svh overflow-hidden">
          {/* The actual scroll container; each page renders its own <main> */}
          <div className="flex-1 overflow-y-auto bg-dashboard-background **:data-[slot=skeleton]:bg-dashboard-skeleton">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminQueryProvider>
  );
}
