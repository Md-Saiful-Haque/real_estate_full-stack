"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Calendar,
  Star,
  Users,
  Building2,
  Inbox,
  BarChart3,
  Settings,
  GitBranch,
} from "lucide-react";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

const userLinks = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My profile", Icon: User },
  { href: "/dashboard/bookings", label: "My viewings", Icon: Calendar },
  { href: "/dashboard/reviews", label: "My reviews", Icon: Star },
];

const adminLinks = [
  { href: "/dashboard/admin/users", label: "Manage users", Icon: Users },
  { href: "/dashboard/admin/properties", label: "Manage listings", Icon: Building2 },
  { href: "/dashboard/admin/inquiries", label: "Manage inquiries", Icon: Inbox },
  { href: "/dashboard/admin/analytics", label: "Analytics", Icon: BarChart3 },
  { href: "/dashboard/admin/settings", label: "Settings", Icon: Settings },
];

const managerLinks = [
  { href: "/dashboard/manager/analytics", label: "Analytics", Icon: BarChart3 },
  { href: "/dashboard/manager/pipeline", label: "Pipeline", Icon: GitBranch },
  { href: "/dashboard/manager/listings", label: "Team listings", Icon: Building2 },
  { href: "/dashboard/manager/coaching", label: "Coaching notes", Icon: Users },
];

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-card-border bg-card md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 border-b border-card-border px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          N
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Dashboard</p>
          <p className="text-xs capitalize text-muted">{role}</p>
        </div>
      </div>
      <nav className="flex flex-wrap gap-1 p-2 md:flex-col md:flex-nowrap">
        {userLinks.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
              pathname === href
                ? "bg-primary/15 text-primary"
                : "text-muted hover:bg-background hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
        {role === "admin" &&
          adminLinks.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-secondary/20 text-secondary"
                  : "text-muted hover:bg-background hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        {role === "manager" &&
          managerLinks.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === href
                  ? "bg-secondary/20 text-secondary"
                  : "text-muted hover:bg-background hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
      </nav>
      <div className="hidden p-4 text-xs text-muted md:block">
        <Link href="/explore" className="hover:text-primary">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
