import { PageHeader } from "@/components/admin/layout/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="space-y-8 flex items-center justify-center h-screen w-full">
        <h2>Comming soon</h2>
      </div>
    </>
  );
}
