import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  getCurrentServerSession,
  revokeCurrentServerSession,
} from "@/lib/auth-session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getCurrentServerSession();

  if (session.status !== "authenticated") {
    return NextResponse.json({ user: null, status: session.status }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}

export async function DELETE(request: Request) {
  const originError = rejectCrossOriginMutation(request);

  if (originError) {
    return originError;
  }
  const response = NextResponse.json({ ok: true });

  await revokeCurrentServerSession();
  clearSessionCookie(response);

  return response;
}
