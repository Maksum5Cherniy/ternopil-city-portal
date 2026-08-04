import { NextResponse } from "next/server";
import { getCurrentServerSession } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getCurrentServerSession();

  if (session.status !== "authenticated") {
    return NextResponse.json({ user: null, status: session.status }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
