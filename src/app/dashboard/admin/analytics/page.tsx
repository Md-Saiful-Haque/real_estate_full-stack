import { getStaffDashboardStats } from "@/lib/dashboard-data";
import { AnalyticsCharts } from "./AnalyticsCharts";

export const metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const stats = await getStaffDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
      <p className="mt-1 text-sm text-muted">Inquiry volume and listing mix pulled live from MongoDB.</p>
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
