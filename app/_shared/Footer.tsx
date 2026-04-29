"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>

              <span className="text-xl font-bold tracking-tight text-foreground">
                Quick<span className="text-primary">Cart</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground">
              QuickCart is a smart e-commerce dashboard for managing Shopify
              orders, products, customers, and store analytics in one place.
            </p>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <InstagramLogoIcon className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <XLogoIcon className="h-4 w-4" />
                <span className="sr-only">X</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <FacebookLogoIcon className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Platform</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/dashboard"
                  className="transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/orders"
                  className="transition-colors hover:text-primary"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/products"
                  className="transition-colors hover:text-primary"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/customers"
                  className="transition-colors hover:text-primary"
                >
                  Customers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/docs"
                  className="transition-colors hover:text-primary"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/analytics"
                  className="transition-colors hover:text-primary"
                >
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations/shopify"
                  className="transition-colors hover:text-primary"
                >
                  Shopify Integration
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="transition-colors hover:text-primary"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Newsletter</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Get product updates, dashboard tips, and e-commerce insights
              directly in your inbox.
            </p>

            <form className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} QuickCart Commerce Dashboard. All
            rights reserved.
          </p>

          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}