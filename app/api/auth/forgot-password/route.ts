import { NextResponse } from "next/server";
import { createPasswordResetToken, getUserByEmail, isDatabaseConfigured } from "@/lib/database";
import { sendPasswordResetEmail } from "@/lib/email";
import { loginSchema } from "@/schemas/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "База даних ще не налаштована. Підключіть Neon Store у Vercel." },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = loginSchema.pick({ email: true }).safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const user = await getUserByEmail(parsed.data.email);

  if (!user) {
    return NextResponse.json(
      {
        error: "Цей email не зареєстрований. Перевірте адресу або створіть профіль.",
        field: "email",
      },
      { status: 404 },
    );
  }

  if (user.is_blocked) {
    return NextResponse.json(
      { error: "Цей профіль заблокований. Зверніться до адміністратора." },
      { status: 403 },
    );
  }

  const token = await createPasswordResetToken(user.id);
  const emailResult = await sendPasswordResetEmail({
    email: user.email,
    displayName: user.display_name,
    token,
  });

  if (!emailResult.sent) {
    const message =
      emailResult.reason === "send-failed"
        ? "Лист відновлення не відправлено. Спробуйте ще раз або зверніться до адміністратора."
        : "Поштовий сервіс ще не налаштований. Лист відновлення не відправлено.";

    return NextResponse.json({ error: message }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    emailSent: true,
    message: "Ми надіслали лист із посиланням для відновлення пароля.",
  });
}
