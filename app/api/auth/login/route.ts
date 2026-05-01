import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { signToken, setAuthCookie } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password and role are required." },
        { status: 400 }
      );
    }

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    // ── Find user ─────────────────────────────────────────────────────────────
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ── Role mismatch guard ───────────────────────────────────────────────────
    if (user.role !== role) {
      return NextResponse.json(
        {
          error: `This account is registered as a ${user.role}. Please use the correct login portal.`,
        },
        { status: 403 }
      );
    }

    // ── Check account is active ───────────────────────────────────────────────
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Your account has been deactivated." },
        { status: 403 }
      );
    }

    // ── Verify password ───────────────────────────────────────────────────────
    if (!user.password) {
      return NextResponse.json(
        {
          error:
            "This account uses Google Sign-In. Please login with Google instead.",
        },
        { status: 400 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ── Issue JWT ─────────────────────────────────────────────────────────────
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      message: "Logged in successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
