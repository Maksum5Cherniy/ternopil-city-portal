import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import { createSystemNotification, deleteAdminNotification } from "@/lib/database";
import { adminNotificationDeleteSchema, systemNotificationSchema } from "@/schemas/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

  const parsed = systemNotificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const result = await createSystemNotification({
    actorId: session.user.uid,
    ...parsed.data,
  });

  return NextResponse.json({
    ok: true,
    sentCount: result.sentCount,
    notificationIds: result.notificationIds,
    message: `Сповіщення надіслано: ${result.sentCount}.`,
  });
}

export async function DELETE(request: Request) {
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

  const parsed = adminNotificationDeleteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const notification = await deleteAdminNotification({
    actorId: session.user.uid,
    id: parsed.data.id,
  });

  if (!notification) {
    return NextResponse.json({ error: "Сповіщення не знайдено." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, notification });
}
