"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

type UserLite = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function DashboardTopNav({ user }: { user: UserLite }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <header className="flex items-center justify-end border-b border-card-border bg-card px-4 py-3 sm:px-6">
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-full border border-card-border px-2 py-1.5 text-sm font-medium"
        >
          <span className="hidden sm:inline">{user.name ?? user.email}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
            {(user.name ?? user.email ?? "?")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </button>
        {open && (
          <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-card-border bg-background py-2 shadow-lg">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-card"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
