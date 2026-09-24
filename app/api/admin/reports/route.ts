import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import { moderateReport } from "@/lib/database";
import { reportModerationSchema } from "@/schemas/admin";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const originError = rejectCrossOriginMutation(request);

  if (originError) {
    return originError;
  }
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

  const parsed = reportModerationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const report = await moderateReport({
    actorId: session.user.uid,
    reportId: parsed.data.reportId,
    status: parsed.data.status,
    comment: parsed.data.comment,
  });

  if (!report) {
    return NextResponse.json({ error: "Скаргу не знайдено." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, report });
}
