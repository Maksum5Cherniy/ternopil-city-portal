import { NextResponse } from "next/server";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import { moderateListing } from "@/lib/database";
import { listingModerationSchema } from "@/schemas/admin";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await getCurrentServerSession();

  if (session.status !== "authenticated" || !hasServerRole(session, "moderator")) {
    return NextResponse.json({ error: "Доступ дозволений тільки модератору." }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = listingModerationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const listing = await moderateListing({
    actorId: session.user.uid,
    listingId: parsed.data.listingId,
    moderationStatus: parsed.data.moderationStatus,
    comment: parsed.data.comment,
  });

  if (!listing) {
    return NextResponse.json({ error: "Оголошення не знайдено." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
