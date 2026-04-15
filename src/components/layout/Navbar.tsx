"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const exploreItems = [
  { href: "/explore", label: "All listings" },
  { href: "/explore?category=house", label: "Houses" },
  { href: "/explore?category=condo", label: "Condos & lofts" },
  { href: "/explore?category=commercial", label: "Commercial" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const loggedIn = status === "authenticated" && session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-card/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            N
          </span>
          <span className="hidden sm:inline">NestFinder</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-card-border/50"
          >
            Home
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-card-border/50"
              aria-expanded={exploreOpen}
              aria-haspopup="true"
            >
              Explore
              <ChevronDown className="h-4 w-4 opacity-70" />
            </button>
            {exploreOpen && (
              <div className="absolute left-0 top-full pt-1">
                <div className="min-w-[200px] rounded-xl border border-card-border bg-card py-2 shadow-lg">
                  {exploreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-background"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-card-border/50"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-card-border/50"
          >
            Contact
          </Link>
          <Link
            href="/blog"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-card-border/50"
          >
            Blog
          </Link>
          {loggedIn && (
            <>
              <Link
                href="/assistant"
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
              >
                <Sparkles className="h-4 w-4" />
                AI Assistant
              </Link>
              <Link
                href="/help"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-card-border/50"
              >
                Help
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-card-border/50"
              >
                Dashboard
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === "loading" ? (
            <span className="h-9 w-20 animate-pulse rounded-lg bg-card-border" />
          ) : loggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-card-border bg-background px-2 py-1.5 text-sm font-medium hover:bg-card-border/30"
              >
                <span className="hidden max-w-[120px] truncate sm:inline">
                  {session.user.name ?? session.user.email}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                  {(session.user.name ?? session.user.email ?? "?")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-card-border bg-card py-2 shadow-lg">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-background"
                    onClick={() => {
                      setProfileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-card-border/50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
              >
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            className="rounded-lg p-2 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-card-border bg-card px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <span className="px-3 py-1 text-xs font-semibold uppercase text-muted">
              Explore
            </span>
            {exploreItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 pl-6 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/about" className="rounded-lg px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="rounded-lg px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
            <Link href="/blog" className="rounded-lg px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
              Blog
            </Link>
            {loggedIn && (
              <>
                <Link href="/assistant" className="rounded-lg px-3 py-2 text-sm text-primary" onClick={() => setMobileOpen(false)}>
                  AI Assistant
                </Link>
                <Link href="/help" className="rounded-lg px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                  Help
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className="rounded-lg px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
              </>
            )}
            {!loggedIn && (
              <div className="mt-2 flex flex-col gap-2 border-t border-card-border pt-3">
                <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
