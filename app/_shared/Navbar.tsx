"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  BarChart3,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  User,
  UserPlus,
  Users,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/Modetoggle";

// ─── Types ─────────────────────────────────────────────────────────────────────
type AuthUser = {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

// ─── Avatar initials helper ────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Avatar component ──────────────────────────────────────────────────────────
function UserAvatar({ user }: { user: AuthUser }) {
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white select-none ring-2 ring-primary/30"
      style={{
        background:
          user.role === "admin"
            ? "linear-gradient(135deg, oklch(0.55 0.24 264), oklch(0.45 0.22 290))"
            : "linear-gradient(135deg, oklch(0.50 0.20 180), oklch(0.45 0.18 200))",
      }}
      title={user.name}
    >
      {getInitials(user.name)}
    </div>
  );
}

// ─── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Fetch session on mount + route changes ────────────────────────────────
  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession, pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = () => setProfileOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [profileOpen]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    setProfileOpen(false);
    setMobileOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const isSignedIn = Boolean(user);
  const isAdmin = user?.role === "admin";
  const dashboardHref = isAdmin ? "/admin/dashboard" : "/dashboard";

  const routes = isAdmin
    ? [
        { name: "Dashboard", href: "/admin/dashboard", icon: ShieldCheck },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Products", href: "/dashboard/products", icon: Package },
        { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        {/* ── Logo ──────────────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/Images/Logo/quickcart-logo-light.svg"
            alt="QuickCart"
            width={160}
            height={48}
            className="object-contain h-14 w-auto dark:hidden block"
            priority
          />
          <Image
            src="/Images/Logo/quickcart-logo-dark.svg"
            alt="QuickCart"
            width={160}
            height={48}
            className="object-contain h-14 w-auto hidden dark:block"
            priority
          />
        </Link>

        {/* ── Desktop Nav Links (signed-in only) ────────────────────────────── */}
        <nav className="hidden items-center gap-6 lg:flex">
          {isSignedIn &&
            routes.map((route) => (
              <Link
                key={route.name}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {route.name}
              </Link>
            ))}
        </nav>

        {/* ── Right-side actions ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Session loading skeleton */}
          {sessionLoading && (
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            </div>
          )}

          {/* ── Signed OUT actions ─────────────────────────────────────────── */}
          {!sessionLoading && !isSignedIn && (
            <div className="hidden items-center gap-2 md:flex">
              <Button
                render={<Link href="/admin/login" />}
                variant="outline"
                size="sm"
                nativeButton={false}
                className="gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </Button>

              <Button
                render={<Link href="/login" />}
                variant="ghost"
                size="sm"
                nativeButton={false}
                className="gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Button>

              <Button
                render={<Link href="/register" />}
                size="sm"
                nativeButton={false}
                className="gap-1.5 bg-linear-to-r from-blue-500 via-teal-400 to-emerald-500 hover:from-blue-600 hover:via-teal-500 hover:to-emerald-600 hover:text-gray-300"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Sign Up
              </Button>
            </div>
          )}

          {/* ── Signed IN actions ──────────────────────────────────────────── */}
          {!sessionLoading && isSignedIn && user && (
            <div className="hidden items-center gap-2 md:flex">
              {/* Dashboard CTA */}
              <Button
                render={<Link href={dashboardHref} />}
                size="sm"
                nativeButton={false}
                className="gap-1.5"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                {isAdmin ? "Admin Panel" : "Dashboard"}
              </Button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  id="navbar-profile-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen((prev) => !prev);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-muted transition-colors"
                  aria-label="Open profile menu"
                >
                  <UserAvatar user={user} />
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-background shadow-lg overflow-hidden z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <span
                        className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          isAdmin
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        }`}
                      >
                        {isAdmin ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        {isAdmin ? "Admin" : "User"}
                      </span>
                    </div>

                    {/* Menu items */}
                    <div className="p-1">
                      <Link
                        href={dashboardHref}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        {isAdmin ? "Admin Panel" : "Dashboard"}
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Account Settings
                      </Link>
                    </div>

                    <div className="border-t border-border p-1">
                      <button
                        id="navbar-logout-btn"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      >
                        {loggingOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        {loggingOut ? "Signing out…" : "Sign Out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode toggle — always visible */}
          <ModeToggle />

          {/* ── Mobile hamburger ────────────────────────────────────────────── */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="md:hidden"
              render={<Button variant="ghost" size="icon" />}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>

            <SheetContent side="right" className="border-border bg-background w-72">
              <div className="mt-6 flex flex-col gap-5 p-4">
                {/* Logo in sheet */}
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    Quick<span className="text-primary">Cart</span>
                  </span>
                </Link>

                {/* Session loading */}
                {sessionLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading session…
                  </div>
                )}

                {/* User card (signed in) */}
                {!sessionLoading && isSignedIn && user && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                    <UserAvatar user={user} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {isAdmin ? "🛡 Admin" : "👤 User"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Nav links (signed in) */}
                {!sessionLoading && isSignedIn && (
                  <nav className="flex flex-col gap-1">
                    {routes.map((route) => {
                      const Icon = route.icon;
                      return (
                        <Link
                          key={route.name}
                          href={route.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                            pathname === route.href
                              ? "bg-muted text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {route.name}
                        </Link>
                      );
                    })}
                  </nav>
                )}

                {/* Auth buttons (signed out) */}
                {!sessionLoading && !isSignedIn && (
                  <div className="flex flex-col gap-2">
                    <Button
                      render={<Link href="/admin/login" />}
                      variant="outline"
                      className="w-full justify-start gap-2"
                      nativeButton={false}
                      onClick={() => setMobileOpen(false)}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Login
                    </Button>
                    <Button
                      render={<Link href="/login" />}
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      nativeButton={false}
                      onClick={() => setMobileOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                    <Button
                      render={<Link href="/register" />}
                      className="w-full justify-start gap-2"
                      nativeButton={false}
                      onClick={() => setMobileOpen(false)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Button>
                  </div>
                )}

                {/* Signed-in action buttons */}
                {!sessionLoading && isSignedIn && (
                  <div className="flex flex-col gap-2 border-t border-border pt-4 mt-auto">
                    <Button
                      render={<Link href={dashboardHref} />}
                      className="w-full justify-start gap-2"
                      nativeButton={false}
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {isAdmin ? "Admin Panel" : "Open Dashboard"}
                    </Button>
                    <Button
                      render={<Link href="/account" />}
                      variant="outline"
                      className="w-full justify-start gap-2"
                      nativeButton={false}
                      onClick={() => setMobileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Account
                    </Button>
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      {loggingOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      {loggingOut ? "Signing out…" : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}