import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { enforceAuthLimit } from "@/lib/auth-rate-limit";
import { getCurrentServerSession } from "@/lib/auth-session";
import { createEmailVerificationToken, getUserById, toPublicUser } from "@/lib/database";
import { sendEmailVerification } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);

  if (originError) {
    return originError;
  }
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

  const limit = await enforceAuthLimit("verify-user", user.id, 3, 60 * 60);

  if (limit) {
    return limit;
  }

  const token = await createEmailVerificationToken(user.id);
  const emailResult = await sendEmailVerification({
    email: user.email,
    displayName: user.display_name,
    token,
  });

  if (!emailResult.sent) {
    const message =
      emailResult.reason === "send-failed"
        ? "Лист не відправлено: домен email-відправника ще не підтверджений у Resend."
        : "Email-провайдер ще не налаштований. Лист не відправлено.";

    return NextResponse.json(
      {
        ok: false,
        emailSent: false,
        error: message,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    emailSent: true,
    message: "Лист підтвердження відправлено повторно.",
  });
}
