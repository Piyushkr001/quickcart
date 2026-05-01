import { redirect } from "next/navigation";
import { getSession } from "@/lib/jwt";
import AuthCard from "@/app/(auth)/_shared/AuthCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In — QuickCart",
  description: "Sign in to the QuickCart admin portal.",
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  return <AuthCard mode="signin" defaultRole="admin" />;
}
