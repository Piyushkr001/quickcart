import Navbar from "./_shared/Navbar";
import Hero from "./_shared/Hero";
import Footer from "./_shared/Footer";
import Image from "next/image";
import {
  ArrowRight,
  ShoppingCart,
  BarChart3,
  Users,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      name: "Order Management",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Product Sync",
      image:
        "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Sales Analytics",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const benefits = [
    {
      icon: RefreshCw,
      title: "Real-time Shopify Sync",
      desc: "Automatically sync products, orders, and customer data from your Shopify store.",
    },
    {
      icon: BarChart3,
      title: "Powerful Analytics",
      desc: "Track revenue, top products, order trends, and customer insights from one dashboard.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Admin Access",
      desc: "Protect your dashboard with authentication, role-based access, and secure API handling.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="grow">
        <Hero />

        {/* Platform Features Section */}
        <section className="bg-muted/20 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  Everything to Manage Your Store
                </h2>
                <p className="text-base text-muted-foreground md:text-lg">
                  QuickCart gives you a complete admin dashboard to monitor
                  orders, products, customers, and revenue from your Shopify
                  store.
                </p>
              </div>

              <button className="group flex w-fit items-center font-medium text-primary hover:underline">
                Explore dashboard
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="group relative aspect-4/5 cursor-pointer overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                  <Image
                    src={feature.image}
                    alt={feature.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/30 to-transparent p-8 dark:from-black/90">
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      {feature.name}
                    </h3>
                    <div className="flex items-center text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                      Learn More
                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-t border-border/50 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Built for Modern E-commerce Teams
              </h2>
              <p className="text-muted-foreground md:text-lg">
                From real-time syncing to secure analytics, QuickCart helps
                store owners make faster and smarter decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="mb-3 text-xl font-semibold">
                      {benefit.title}
                    </h3>

                    <p className="text-muted-foreground">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="bg-muted/20 py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:grid-cols-3 md:p-10">
              {[
                {
                  icon: ShoppingCart,
                  label: "Orders Tracked",
                  value: "10K+",
                },
                {
                  icon: Users,
                  label: "Customer Records",
                  value: "5K+",
                },
                {
                  icon: Zap,
                  label: "Sync Speed",
                  value: "Real-time",
                },
              ].map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-4 rounded-2xl bg-muted/40 p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}