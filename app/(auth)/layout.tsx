import type { Metadata } from "next";
import Navbar from "../_shared/Navbar";
import Footer from "../_shared/Footer";

export const metadata: Metadata = {
  title: "QuickCart — Authentication",
  description: "Sign in or create your QuickCart account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.18),transparent_70%),radial-gradient(ellipse_60%_50%_at_100%_80%,hsl(var(--primary)/0.10),transparent_60%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.25),transparent_70%),radial-gradient(ellipse_60%_50%_at_100%_80%,hsl(var(--primary)/0.14),transparent_60%)]" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute top-1/4 -left-40 -z-10 h-80 w-80 animate-pulse rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-40 -z-10 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl [animation-delay:1.5s]" />

      <Navbar />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 md:px-6">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <Footer />
    </div>
  );
}