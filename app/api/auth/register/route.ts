import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createServerSession, setSessionCookie } from "@/lib/auth-session";
import {
  createEmailVerificationToken,
  createUser,
  isDatabaseConfigured,
  syncAdminRoleFromEnv,
  toPublicUser,
} from "@/lib/database";
import { sendEmailVerification } from "@/lib/email";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/schemas/auth";

export const runtime = "nodejs";

function isUniqueEmailError(error: unknown) {
  return error instanceof Error && /duplicate key|unique/i.test(error.message);
}

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

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await createUser({
      id: randomUUID(),
      email: parsed.data.email,
      passwordHash,
      displayName: parsed.data.displayName,
    });
    const userWithEnvRoles = await syncAdminRoleFromEnv(user);
    const verificationToken = await createEmailVerificationToken(user.id);
    const emailResult = await sendEmailVerification({
      email: user.email,
      displayName: user.display_name,
      token: verificationToken,
    });
    const token = await createServerSession(user.id);
    const response = NextResponse.json(
      {
        ok: true,
        emailSent: emailResult.sent,
        user: toPublicUser(userWithEnvRoles),
        message: emailResult.sent
          ? "Профіль створено. Перевірте пошту і підтвердьте email."
          : "Профіль створено, але email-провайдер ще не налаштований.",
      },
      { status: 201 },
    );

    setSessionCookie(response, token);

    return response;
  } catch (error) {
    if (isUniqueEmailError(error)) {
      return NextResponse.json({ error: "Цей email вже використовується." }, { status: 409 });
    }

    return NextResponse.json({ error: "Не вдалося створити профіль." }, { status: 500 });
  }
}
