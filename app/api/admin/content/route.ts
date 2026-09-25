import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import {
  deleteAdminContentItem,
  updateAdminContentStatus,
  upsertAdminContentItem,
} from "@/lib/database";
import {
  adminContentDeleteSchema,
  adminContentStatusUpdateSchema,
  adminContentUpsertSchema,
} from "@/schemas/admin";

export const runtime = "nodejs";

async function requireAdmin() {
  const session = await getCurrentServerSession();

  if (session.status !== "authenticated" || !hasServerRole(session, "admin")) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Доступ дозволений тільки адміністратору." },
        { status: 403 },
      ),
    };
  }

  return { session, response: null };
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);

  if (originError) {
    return originError;
  }
  const { session, response } = await requireAdmin();

  if (response) {
    return response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = adminContentUpsertSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const item = await upsertAdminContentItem({
    actorId: session.user.uid,
    ...parsed.data,
  });

  return NextResponse.json({ ok: true, item });
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOriginMutation(request);

  if (originError) {
    return originError;
  }
  const { session, response } = await requireAdmin();

  if (response) {
    return response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = adminContentStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const item = await updateAdminContentStatus({
    actorId: session.user.uid,
    id: parsed.data.id,
    status: parsed.data.status,
  });

  if (!item) {
    return NextResponse.json({ error: "Запис не знайдено." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item });
}

export async function DELETE(request: Request) {
  const originError = rejectCrossOriginMutation(request);

  if (originError) {
    return originError;
  }
  const { session, response } = await requireAdmin();

  if (response) {
    return response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = adminContentDeleteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const item = await deleteAdminContentItem({
    actorId: session.user.uid,
    id: parsed.data.id,
  });

  if (!item) {
    return NextResponse.json({ error: "Запис не знайдено." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, item });
}
