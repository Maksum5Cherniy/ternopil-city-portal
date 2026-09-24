import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import { updateSiteSettings } from "@/lib/database";
import { siteSettingsUpdateSchema } from "@/schemas/admin";

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

  const parsed = siteSettingsUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const settings = await updateSiteSettings({
    actorId: session.user.uid,
    settings: parsed.data.settings,
  });

  return NextResponse.json({ ok: true, settings });
}
