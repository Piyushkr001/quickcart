import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        userId: session.userId,
        email: session.email,
        role: session.role,
        name: session.name,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
