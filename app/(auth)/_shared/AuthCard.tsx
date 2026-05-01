"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Module-level flag — ensures GSI is only initialized once per page load
let gsiScriptLoaded = false;
let gsiInitialized = false;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type Role = "user" | "admin";

interface AuthCardProps {
  mode: "signin" | "signup";
  defaultRole?: Role;
}

export default function AuthCard({
  mode,
  defaultRole = "user",
}: AuthCardProps) {
  const router = useRouter();
  const isSignIn = mode === "signin";

  const [role, setRole] = useState<Role>(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const redirectAfterAuth = (userRole: Role) => {
    router.push(userRole === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  // ── Email / Password submit ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isSignIn ? "/api/auth/login" : "/api/auth/register";
      const body = isSignIn
        ? { email, password, role }
        : { name, email, password, role, adminKey: role === "admin" ? adminKey : undefined };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(
        isSignIn ? "Signed in successfully! Redirecting…" : "Account created! Redirecting…"
      );

      const userRole = data.user?.role ?? data.role ?? role;
      setTimeout(() => redirectAfterAuth(userRole as Role), 800);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google sign-in ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      // Load the GSI script only once
      if (!gsiScriptLoaded && !document.getElementById("google-identity-script")) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.id = "google-identity-script";
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = () => { gsiScriptLoaded = true; resolve(); };
          script.onerror = () => reject(new Error("Failed to load Google script"));
          document.head.appendChild(script);
        });
      } else {
        gsiScriptLoaded = true; // script tag already exists from a prev render
      }

      // Initialize only once — re-calling initialize() triggers GSI warnings
      if (!gsiInitialized) {
        window.google?.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
          callback: async (response) => {
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential: response.credential, role }),
            });

            const data = await res.json();

            if (!res.ok) {
              setError(data.error || "Google login failed.");
              setGoogleLoading(false);
              return;
            }

            setSuccess("Google sign-in successful! Redirecting…");
            const userRole = data.user?.role ?? role;
            setTimeout(() => redirectAfterAuth(userRole as Role), 800);
          },
        });
        gsiInitialized = true;
      }

      window.google?.accounts.id.prompt();
    } catch {
      setError("Google Sign-In is unavailable right now.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.14 0 0 / 0.9), oklch(0.11 0 0 / 0.95))",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <Image
            src="/Images/Logo/quickcart-logo-dark.svg"
            alt="QuickCart"
            width={140}
            height={40}
            className="object-contain h-8 w-auto"
          />
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">
          {isSignIn ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-sm text-white/50">
          {isSignIn
            ? "Sign in to your QuickCart account"
            : "Join QuickCart and get started"}
        </p>
      </div>

      {/* ── Role toggle ─────────────────────────────────────────────────────── */}
      <div className="px-8 mb-6">
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: "oklch(0.08 0 0 / 0.8)" }}
        >
          <button
            type="button"
            id="role-user-btn"
            onClick={() => setRole("user")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              role === "user"
                ? "bg-white/10 text-white shadow"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <User className="h-4 w-4" />
            User
          </button>
          <button
            type="button"
            id="role-admin-btn"
            onClick={() => setRole("admin")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              role === "admin"
                ? "bg-white/10 text-white shadow"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </button>
        </div>
      </div>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="px-8 pb-8 flex flex-col gap-4">
        {/* Name (signup only) */}
        {!isSignIn && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-white/70 text-xs font-medium uppercase tracking-wider">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-xl h-11"
            />
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-white/70 text-xs font-medium uppercase tracking-wider">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-xl h-11"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-white/70 text-xs font-medium uppercase tracking-wider">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={isSignIn ? "Your password" : "At least 8 characters"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isSignIn ? 1 : 8}
              autoComplete={isSignIn ? "current-password" : "new-password"}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-xl h-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Admin key (signup only, admin role) */}
        {!isSignIn && role === "admin" && (
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="admin-key"
              className="text-amber-400/80 text-xs font-medium uppercase tracking-wider"
            >
              Admin Registration Key
            </Label>
            <Input
              id="admin-key"
              type="password"
              placeholder="Enter the admin secret keyword"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
              className="bg-amber-500/5 border-amber-500/20 text-white placeholder:text-white/25 focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 rounded-xl h-11"
            />
            <p className="text-amber-400/60 text-xs mt-0.5">
              🔒 Max 3 admins allowed. Contact the platform owner for the key.
            </p>
          </div>
        )}

        {/* Error / Success */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm text-red-300 border border-red-500/20"
            style={{ background: "oklch(0.25 0.15 15 / 0.3)" }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="rounded-xl px-4 py-3 text-sm text-emerald-300 border border-emerald-500/20"
            style={{ background: "oklch(0.25 0.12 160 / 0.3)" }}
          >
            {success}
          </div>
        )}

        {/* Submit */}
        <Button
          id="auth-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl font-semibold text-sm mt-1"
          style={{
            background: "linear-gradient(135deg, oklch(0.55 0.24 264), oklch(0.50 0.22 280))",
            boxShadow: "0 4px 24px oklch(0.55 0.24 264 / 0.35)",
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isSignIn ? "Signing in…" : "Creating account…"}
            </span>
          ) : isSignIn ? (
            `Sign in as ${role === "admin" ? "Admin" : "User"}`
          ) : (
            `Create ${role === "admin" ? "Admin" : "User"} Account`
          )}
        </Button>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google */}
        <button
          id="google-signin-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full h-11 rounded-xl border border-white/10 flex items-center justify-center gap-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Sign {isSignIn ? "in" : "up"} with Google
        </button>

        {/* Toggle sign-in / sign-up */}
        <p className="text-center text-sm text-white/40 mt-2">
          {isSignIn ? (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-white/70 hover:text-white font-medium transition-colors underline underline-offset-2"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white/70 hover:text-white font-medium transition-colors underline underline-offset-2"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
