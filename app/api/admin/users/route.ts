import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import { toPublicUser, updateUserAdministration } from "@/lib/database";
import { adminUserUpdateSchema } from "@/schemas/admin";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const originError = rejectCrossOriginMutation(request);

  if (originError) {
    return originError;
  }
  const session = await getCurrentServerSession();

  if (session.status !== "authenticated" || !hasServerRole(session, "admin")) {
    return NextResponse.json(
      { error: "Доступ дозволений тільки адміністратору." },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = adminUserUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  if (parsed.data.userId === session.user.uid && parsed.data.isBlocked) {
    return NextResponse.json({ error: "Не можна заблокувати власний акаунт." }, { status: 400 });
  }

  const user = await updateUserAdministration({
    actorId: session.user.uid,
    userId: parsed.data.userId,
    roles: parsed.data.roles,
    isBlocked: parsed.data.isBlocked,
    blockedReason: parsed.data.blockedReason,
    sellerStatus: parsed.data.sellerStatus,
  });

  if (!user) {
    return NextResponse.json({ error: "Користувача не знайдено." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user: toPublicUser(user) });
}
