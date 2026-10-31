import { FinancePageClient } from "@/components/admin/finance/finance-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Finance" };

export default function AdminPage() {
  return <FinancePageClient />;
}
