import { redirect } from "next/navigation";
import { getSession } from "@/lib/jwt";
import AuthCard from "@/app/(auth)/_shared/AuthCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — QuickCart",
  description: "Create your QuickCart account.",
};

export default async function RegisterPage() {
  // Redirect already-authenticated users
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  return <AuthCard mode="signup" defaultRole="user" />;
}
