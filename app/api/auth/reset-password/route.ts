import { NextResponse } from "next/server";
import { isDatabaseConfigured, resetPasswordWithToken } from "@/lib/database";
import { hashPassword } from "@/lib/password";
import { resetPasswordSchema } from "@/schemas/auth";

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

  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await resetPasswordWithToken(parsed.data.token, passwordHash);

  if (!user) {
    return NextResponse.json(
      { error: "Посилання відновлення недійсне або вже протерміноване." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Пароль оновлено. Тепер можна увійти з новим паролем.",
  });
}
