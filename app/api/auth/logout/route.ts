import { NextResponse } from "next/server";
import { deleteAuthCookie } from "@/lib/jwt";

export async function POST() {
  await deleteAuthCookie();
  return NextResponse.json({ message: "Logged out successfully." });
}
