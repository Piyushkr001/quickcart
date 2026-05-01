import { redirect } from "next/navigation";
import { getSession } from "@/lib/jwt";
import AuthCard from "@/app/(auth)/_shared/AuthCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign Up — QuickCart",
  description: "Register a new admin account for QuickCart.",
};

export default async function AdminRegisterPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  return <AuthCard mode="signup" defaultRole="admin" />;
}
