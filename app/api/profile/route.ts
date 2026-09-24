import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { getCurrentServerSession } from "@/lib/auth-session";
import { toPublicUser, updateUserProfile } from "@/lib/database";
import { profileSchema } from "@/schemas/auth";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  const originError = rejectCrossOriginMutation(request);

  if (originError) {
    return originError;
  }
  const session = await getCurrentServerSession();

  if (session.status !== "authenticated") {
    return NextResponse.json({ error: "Потрібно увійти в акаунт." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const user = await updateUserProfile(session.user.uid, parsed.data);

  if (!user) {
    return NextResponse.json({ error: "Профіль не знайдено." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user: toPublicUser(user) });
}
