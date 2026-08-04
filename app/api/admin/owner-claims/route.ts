import { NextResponse } from "next/server";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import { moderateOwnerClaim } from "@/lib/database";
import { ownerClaimModerationSchema } from "@/schemas/admin";

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

  const parsed = ownerClaimModerationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const claim = await moderateOwnerClaim({
    actorId: session.user.uid,
    claimId: parsed.data.claimId,
    status: parsed.data.status,
    comment: parsed.data.comment,
  });

  if (!claim) {
    return NextResponse.json({ error: "Заявку не знайдено." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
