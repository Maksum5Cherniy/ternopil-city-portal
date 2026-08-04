import { NextResponse } from "next/server";
import { getCurrentServerSession } from "@/lib/auth-session";
import { createEmailVerificationToken, getUserById, toPublicUser } from "@/lib/database";
import { sendEmailVerification } from "@/lib/email";

export const runtime = "nodejs";

export async function POST() {
  const session = await getCurrentServerSession();

  if (session.status !== "authenticated") {
    return NextResponse.json({ error: "Потрібно увійти в акаунт." }, { status: 401 });
  }

  const user = await getUserById(session.user.uid);

  if (!user) {
    return NextResponse.json({ error: "Профіль не знайдено." }, { status: 404 });
  }

  if (user.email_verified) {
    return NextResponse.json({
      ok: true,
      user: toPublicUser(user),
      message: "Email вже підтверджено.",
    });
  }

  const token = await createEmailVerificationToken(user.id);
  const emailResult = await sendEmailVerification({
    email: user.email,
    displayName: user.display_name,
    token,
  });

  return NextResponse.json({
    ok: true,
    emailSent: emailResult.sent,
    message: emailResult.sent
      ? "Лист підтвердження відправлено повторно."
      : "Email-провайдер ще не налаштований. Лист не відправлено.",
  });
}
