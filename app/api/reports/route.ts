import { NextResponse } from "next/server";
import { getCurrentServerSession } from "@/lib/auth-session";
import { createReport, isDatabaseConfigured } from "@/lib/database";
import { reportCreateSchema } from "@/schemas/report";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "База даних ще не налаштована. Підключіть Neon Store у Vercel." },
      { status: 503 },
    );
  }

  const session = await getCurrentServerSession();

  if (session.status === "blocked") {
    return NextResponse.json(
      { error: "Заблокований профіль не може надсилати скарги." },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = reportCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const reportId = await createReport({
    reporterId: session.status === "authenticated" ? session.user.uid : undefined,
    entityType: parsed.data.entityType,
    entityId: parsed.data.entityId,
    reason: parsed.data.reason,
  });

  return NextResponse.json({ ok: true, reportId }, { status: 201 });
}
