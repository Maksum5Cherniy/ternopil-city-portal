import { NextResponse } from "next/server";
import { createServerSession, setSessionCookie } from "@/lib/auth-session";
import {
  getUserByEmail,
  isDatabaseConfigured,
  markUserLastLogin,
  syncAdminRoleFromEnv,
  toPublicUser,
} from "@/lib/database";
import { verifyPassword } from "@/lib/password";
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

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const user = await getUserByEmail(parsed.data.email);
  const isPasswordValid = user
    ? await verifyPassword(parsed.data.password, user.password_hash)
    : false;

  if (!user || !isPasswordValid) {
    return NextResponse.json({ error: "Невірний email або пароль." }, { status: 401 });
  }

  if (user.is_blocked) {
    return NextResponse.json({ error: "Цей профіль заблокований." }, { status: 403 });
  }

  await markUserLastLogin(user.id);
  const userWithEnvRoles = await syncAdminRoleFromEnv(user);
  const token = await createServerSession(user.id);
  const publicUser = toPublicUser(userWithEnvRoles);
  const response = NextResponse.json({
    ok: true,
    user: publicUser,
    message: publicUser.emailVerified
      ? "Вхід виконано."
      : "Вхід виконано. Підтвердіть email, щоб створювати оголошення та подавати заявки.",
  });

  setSessionCookie(response, token);

  return response;
}
