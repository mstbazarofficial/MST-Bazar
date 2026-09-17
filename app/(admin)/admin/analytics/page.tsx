import {
  AnalyticsDashboard,
  AnalyticsDashboardSkeleton,
} from "@/components/admin/analytics/analytics-dashboard";
import { PageHeader } from "@/components/admin/layout/page-header";
import { getAnalyticsDashboard } from "@/lib/analytics/actions";
import { Suspense } from "react";

export const metadata = {
  title: "Analytics — Edugen Global",
};

async function AnalyticsData() {
  const initialData = await getAnalyticsDashboard("30d");
  return <AnalyticsDashboard initialData={initialData} />;
}

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader title={"Analytics"} />

      <section className="dashboard-container">
        <Suspense fallback={<AnalyticsDashboardSkeleton />}>
          <AnalyticsData />
        </Suspense>
      </section>
    </>
  );
}
