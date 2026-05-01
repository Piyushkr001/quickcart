import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { users, adminMetadata } from "@/config/schema";
import { signToken, setAuthCookie } from "@/lib/jwt";
import { randomUUID } from "crypto";

const ADMIN_KEYWORD = "quickcart.com";
const MAX_ADMINS = 3;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, adminKey } = body;

    // ── Basic validation ─────────────────────────────────────────────────────
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    // ── Admin keyword check ──────────────────────────────────────────────────
    if (role === "admin") {
      if (adminKey !== ADMIN_KEYWORD) {
        return NextResponse.json(
          { error: "Invalid admin registration key." },
          { status: 403 }
        );
      }

      // Check admin count
      const meta = await db.query.adminMetadata.findFirst({
        where: eq(adminMetadata.id, 1),
      });

      if (meta && meta.adminCount >= MAX_ADMINS) {
        return NextResponse.json(
          { error: "Maximum admin limit (3) reached." },
          { status: 403 }
        );
      }
    }

    // ── Check if user already exists ─────────────────────────────────────────
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // ── Hash password ─────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = randomUUID();

    // ── Create user ───────────────────────────────────────────────────────────
    await db.insert(users).values({
      id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    // ── Update admin count ────────────────────────────────────────────────────
    if (role === "admin") {
      const meta = await db.query.adminMetadata.findFirst({
        where: eq(adminMetadata.id, 1),
      });
      if (!meta) {
        await db.insert(adminMetadata).values({ id: 1, adminCount: 1 });
      } else {
        await db
          .update(adminMetadata)
          .set({ adminCount: meta.adminCount + 1, updatedAt: new Date() })
          .where(eq(adminMetadata.id, 1));
      }
    }

    // ── Issue JWT ─────────────────────────────────────────────────────────────
    const token = await signToken({
      userId,
      email: email.toLowerCase(),
      role,
      name,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      { message: "Account created successfully.", role },
      { status: 201 }
    );
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
