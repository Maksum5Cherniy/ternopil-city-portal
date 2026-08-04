import { NextResponse } from "next/server";
import { loginSchema } from "@/schemas/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

  return NextResponse.json({
    ok: true,
    message:
      "Якщо профіль існує, запит на відновлення прийнято. Після підключення поштового сервісу тут буде автоматичний лист.",
  });
}
