import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardTopNav } from "./DashboardTopNav";
import { DashboardSidebar } from "./DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <DashboardSidebar role={session.user.role} />
      <div className="flex flex-1 flex-col">
        <DashboardTopNav user={session.user} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
