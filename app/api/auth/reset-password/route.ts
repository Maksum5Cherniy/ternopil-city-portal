import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { enforceAuthLimit } from "@/lib/auth-rate-limit";
import { isDatabaseConfigured, resetPasswordWithToken } from "@/lib/database";
import { hashPassword } from "@/lib/password";
import { resetPasswordSchema } from "@/schemas/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);

  if (originError) {
    return originError;
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Сервіс акаунтів тимчасово недоступний. Спробуйте пізніше." },
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

  const limit = await enforceAuthLimit("reset-token", parsed.data.token, 10, 60 * 60);

  if (limit) {
    return limit;
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
