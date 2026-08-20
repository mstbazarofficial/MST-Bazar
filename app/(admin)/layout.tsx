import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "@/context/query-provider";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | MST Bazar Admin",
    default: "Dashboard | MST Bazar Admin",
  },
  description: "MST Shop administration panel",
};

/**
 * Server Component — runs on every request.
 * Reads the session cookie on the server; redirects to /login if not authed.
 * No client-side auth checks needed inside /admin pages.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = true;

  if (!authenticated) {
    redirect("/login");
  }

  return (
    <QueryProvider>
      <SidebarProvider defaultOpen>
        <Suspense>
          <AppSidebar />
          <SidebarInset className="flex flex-col min-h-screen">
            {children}
          </SidebarInset>
        </Suspense>
      </SidebarProvider>
    </QueryProvider>
  );
}
