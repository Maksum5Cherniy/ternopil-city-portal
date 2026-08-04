import { NextResponse } from "next/server";
import { createPasswordResetToken, getUserByEmail, isDatabaseConfigured } from "@/lib/database";
import { sendPasswordResetEmail } from "@/lib/email";
import { loginSchema } from "@/schemas/auth";

export const runtime = "nodejs";

const acceptedMessage =
  "Якщо профіль існує, ми надіслали лист із посиланням для відновлення пароля.";

function acceptedResponse() {
  return NextResponse.json({
    ok: true,
    message: acceptedMessage,
  });
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

  const parsed = loginSchema.pick({ email: true }).safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const user = await getUserByEmail(parsed.data.email);

  if (!user || user.is_blocked) {
    return acceptedResponse();
  }

  const token = await createPasswordResetToken(user.id);
  await sendPasswordResetEmail({
    email: user.email,
    displayName: user.display_name,
    token,
  });

  return acceptedResponse();
}
