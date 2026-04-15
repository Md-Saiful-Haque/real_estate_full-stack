import { getSession } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { getUserDashboardMe, getStaffDashboardStats } from "@/lib/dashboard-data";
import Link from "next/link";

export const metadata = { title: "Overview" };

export default async function DashboardHomePage() {
  const session = await getSession();
  if (!session?.user) return null;
  const role = session.user.role;

  const staff = role === "admin" || role === "manager";
  const data = staff
    ? await getStaffDashboardStats()
    : await getUserDashboardMe(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Overview</h1>
      <p className="mt-1 text-sm text-muted">
        Snapshot of your activity on NestFinder
        {staff ? " and live platform metrics" : ""}.
      </p>

      {!staff && "inquiryCount" in data && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Viewing requests", value: String(data.inquiryCount) },
            { label: "Reviews written", value: String(data.reviewCount) },
            {
              label: "Member since",
              value: data.memberSince
                ? new Date(data.memberSince).toLocaleDateString()
                : "—",
            },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-card-border bg-card p-6 shadow-sm"
            >
              <p className="text-sm text-muted">{c.label}</p>
              <p className="mt-2 text-2xl font-bold text-primary">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {staff && "inventoryValue" in data && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total users", value: String(data.users) },
            { label: "Live listings", value: String(data.properties) },
            { label: "Inquiries", value: String(data.inquiries) },
            {
              label: "Inventory value",
              value: formatPrice(data.inventoryValue),
            },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-card-border bg-card p-6 shadow-sm"
            >
              <p className="text-sm text-muted">{c.label}</p>
              <p className="mt-2 text-2xl font-bold text-primary">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-dashed border-card-border bg-card/50 p-6">
        <p className="text-sm text-muted">
          Use the sidebar to manage your profile, viewings, and reviews. Administrators and managers can open analytics
          and listing tools from the same menu.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/explore"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Browse listings
          </Link>
          <Link href="/assistant" className="rounded-xl border border-card-border px-4 py-2 text-sm font-semibold">
            Open AI assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
