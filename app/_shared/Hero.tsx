import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShoppingCart,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-16 md:pt-24 lg:pt-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          
          {/* Text Content */}
          <div className="z-10 flex-1 space-y-8 text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground backdrop-blur">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-primary" />
              Smart Commerce Dashboard
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-7xl">
              Manage Your Store <br className="hidden lg:inline" />
              <span className="text-primary">Smarter & Faster</span>
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-[620px] text-base text-muted-foreground sm:text-lg md:text-xl lg:mx-0">
              Connect your Shopify store, sync products and orders, track
              revenue, and manage customers from one powerful dashboard.
            </p>

            {/* CTA */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="h-12 w-full px-8 text-base sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full px-8 text-base sm:w-auto"
              >
                View Dashboard
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
                <ShoppingCart className="h-4 w-4 text-primary" />
                Order Sync
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
                <BarChart3 className="h-4 w-4 text-primary" />
                Analytics
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Secure Admin
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative w-full max-w-[520px] flex-1 lg:max-w-none">
            
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-muted shadow-xl md:aspect-4/3 lg:aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
                alt="QuickCart dashboard"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                className="object-cover"
                priority
              />

              {/* Overlay (light + dark aware) */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent dark:from-black/70 dark:via-black/20" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 left-4 right-4 rounded-xl border border-border bg-background/90 p-4 shadow-xl backdrop-blur-md sm:left-auto sm:right-auto sm:w-[260px] md:bottom-10 md:-left-10">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Live Store Insights
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Orders, revenue & products
                  </p>
                </div>
              </div>
            </div>

            {/* Top Badge */}
            <div className="absolute top-6 right-2 hidden rounded-xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md md:block lg:-right-6">
              <p className="text-sm font-semibold text-foreground">
                Shopify Connected
              </p>
              <p className="text-xs text-muted-foreground">
                Real-time sync enabled
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}