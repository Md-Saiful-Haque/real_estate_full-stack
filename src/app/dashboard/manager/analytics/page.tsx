import { getStaffDashboardStats } from "@/lib/dashboard-data";
import { AnalyticsCharts } from "../../admin/analytics/AnalyticsCharts";

export const metadata = { title: "Manager analytics" };

export default async function ManagerAnalyticsPage() {
  const stats = await getStaffDashboardStats();
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Regional analytics</h1>
      <p className="mt-1 text-sm text-muted">Same metrics administrators see—use them to coach teams on lead flow.</p>
      <AnalyticsCharts
        monthly={stats.monthlyInquiries}
        categories={stats.categoryBreakdown}
        totals={{
          users: stats.users,
          properties: stats.properties,
          inquiries: stats.inquiries,
        }}
      />
    </div>
  );
}
