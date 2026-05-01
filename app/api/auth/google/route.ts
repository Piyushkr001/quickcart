import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { signToken, setAuthCookie } from "@/lib/jwt";
import { randomUUID } from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { credential, role } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { error: "Google credential is required." },
        { status: 400 }
      );
    }

    if (!["user", "admin"].includes(role || "user")) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    // ── Verify the Google token ───────────────────────────────────────────────
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googlePayload = ticket.getPayload();
    if (!googlePayload) {
      return NextResponse.json(
        { error: "Invalid Google token." },
        { status: 401 }
      );
    }

    const { sub: googleId, email, name, picture } = googlePayload;

    if (!email) {
      return NextResponse.json(
        { error: "Google account has no email." },
        { status: 400 }
      );
    }

    // ── Check for existing user ───────────────────────────────────────────────
    let user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (user) {
      // Existing user — check role mismatch
      if (role && user.role !== role) {
        return NextResponse.json(
          {
            error: `This account is registered as a ${user.role}. Please use the correct portal.`,
          },
          { status: 403 }
        );
      }

      // Update googleId if missing
      if (!user.googleId) {
        await db
          .update(users)
          .set({ googleId, updatedAt: new Date() })
          .where(eq(users.id, user.id));
      }
    } else {
      // New user — create account
      const userId = randomUUID();
      const newRole = (role as "user" | "admin") ?? "user";

      await db.insert(users).values({
        id: userId,
        name: name ?? email.split("@")[0],
        email: email.toLowerCase(),
        googleId,
        image: picture,
        role: newRole,
      });

      user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Failed to retrieve user after creation." },
        { status: 500 }
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
      message: "Google login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("[GOOGLE AUTH ERROR]", err);
    return NextResponse.json(
      { error: "Google authentication failed." },
      { status: 500 }
    );
  }
}
