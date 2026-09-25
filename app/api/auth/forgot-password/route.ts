import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { enforceAuthLimit, getClientAddress } from "@/lib/auth-rate-limit";
import { createPasswordResetToken, getUserByEmail, isDatabaseConfigured } from "@/lib/database";
import { sendPasswordResetEmail } from "@/lib/email";
import { loginSchema } from "@/schemas/auth";

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

  const parsed = loginSchema.pick({ email: true }).safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const accountLimit = await enforceAuthLimit("reset-email", parsed.data.email, 3, 60 * 60);

  if (accountLimit) {
    return accountLimit;
  }

  const clientAddress = getClientAddress(request);

  if (clientAddress) {
    const addressLimit = await enforceAuthLimit("reset-address", clientAddress, 20, 60 * 60);

    if (addressLimit) {
      return addressLimit;
    }
  }

  const user = await getUserByEmail(parsed.data.email);

  if (user && !user.is_blocked) {
    const token = await createPasswordResetToken(user.id);
    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      displayName: user.display_name,
      token,
    });

    if (!emailResult.sent) {
      console.error("Password recovery email was not delivered", emailResult.reason);
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Якщо профіль із цією адресою існує, на пошту надійде посилання для відновлення.",
  });
}
