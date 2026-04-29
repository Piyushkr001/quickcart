"use client";

import Link from "next/link";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

type AuthUser = {
  name?: string;
  email?: string;
  role?: "admin" | "user";
};

type NavbarProps = {
  user?: AuthUser | null;
};

export default function Navbar({ user = null }: NavbarProps) {
  const isSignedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  const routes = isAdmin
    ? [
        { name: "Admin Dashboard", href: "/admin/dashboard", icon: ShieldCheck },
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

  const dashboardHref = isAdmin ? "/admin/dashboard" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Images/Logo/quickcart-logo-light.svg" alt="Logo" width={180} height={60} className="object-contain w-full h-full dark:hidden block" />
          <Image src="/Images/Logo/quickcart-logo-dark.svg" alt="Logo" width={180} height={60} className="object-contain w-full h-full hidden dark:block" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {isSignedIn &&
            routes.map((route) => (
              <Link
                key={route.name}
                href={route.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {route.name}
              </Link>
            ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isSignedIn ? (
            <>
              <Button
                render={<Link href="/admin/login" />}
                variant="outline"
                nativeButton={false}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin Login
              </Button>

              <Button
                render={<Link href="/login" />}
                variant="ghost"
                nativeButton={false}
              >
                <LogIn className="mr-2 h-4 w-4" />
                User Sign In
              </Button>

              <Button render={<Link href="/register" />} nativeButton={false}>
                <UserPlus className="mr-2 h-4 w-4" />
                User Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button render={<Link href={dashboardHref} />} nativeButton={false}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {isAdmin ? "Admin Panel" : "Open Dashboard"}
              </Button>

              <Button
                render={<Link href="/account" />}
                variant="ghost"
                size="icon"
                nativeButton={false}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>

              <Button
                render={<Link href="/logout" />}
                variant="ghost"
                size="icon"
                nativeButton={false}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>

          <SheetContent side="right" className="border-border bg-background">
            <div className="mt-8 flex flex-col gap-6 p-5">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>

                <span className="text-xl font-bold tracking-tight text-foreground">
                  Quick<span className="text-primary">Cart</span>
                </span>
              </Link>

              {isSignedIn && (
                <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                  <p className="font-medium text-foreground">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    Role: {isAdmin ? "Admin" : "User"}
                  </p>
                </div>
              )}

              {isSignedIn && (
                <nav className="flex flex-col gap-4">
                  {routes.map((route) => {
                    const Icon = route.icon;

                    return (
                      <Link
                        key={route.name}
                        href={route.href}
                        className="flex items-center gap-3 text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Icon className="h-5 w-5" />
                        {route.name}
                      </Link>
                    );
                  })}
                </nav>
              )}

              {!isSignedIn ? (
                <div className="flex flex-col gap-3">
                  <Button
                    render={<Link href="/admin/login" />}
                    variant="outline"
                    className="w-full justify-start"
                    nativeButton={false}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Login
                  </Button>

                  <Button
                    render={<Link href="/login" />}
                    variant="ghost"
                    className="w-full justify-start"
                    nativeButton={false}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    User Sign In
                  </Button>

                  <Button
                    render={<Link href="/register" />}
                    className="w-full justify-start"
                    nativeButton={false}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    User Sign Up
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    render={<Link href={dashboardHref} />}
                    className="w-full justify-start"
                    nativeButton={false}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {isAdmin ? "Admin Panel" : "Open Dashboard"}
                  </Button>

                  <Button
                    render={<Link href="/account" />}
                    variant="outline"
                    className="w-full justify-start"
                    nativeButton={false}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Button>

                  <Button
                    render={<Link href="/logout" />}
                    variant="ghost"
                    className="w-full justify-start"
                    nativeButton={false}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}