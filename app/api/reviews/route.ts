import { rejectCrossOriginMutation } from "@/lib/request-security";
import { NextResponse } from "next/server";
import { getCurrentServerSession } from "@/lib/auth-session";
import { createReview, isDatabaseConfigured } from "@/lib/database";
import { reviewCreateSchema } from "@/schemas/review";

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

  const session = await getCurrentServerSession();

  if (session.status === "signedOut" || session.status === "invalid") {
    return NextResponse.json({ error: "Увійдіть, щоб залишити відгук." }, { status: 401 });
  }

  if (session.status === "blocked") {
    return NextResponse.json(
      { error: "Заблокований профіль не може залишати відгуки." },
      { status: 403 },
    );
  }

  if (session.status === "databaseMissing") {
    return NextResponse.json(
      { error: "Сервіс акаунтів тимчасово недоступний. Спробуйте пізніше." },
      { status: 503 },
    );
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Підтвердіть email, щоб залишати відгуки." },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = reviewCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const reviewId = await createReview({
    userId: session.user.uid,
    targetHref: parsed.data.targetHref,
    targetTitle: parsed.data.targetTitle,
    rating: parsed.data.rating,
    text: parsed.data.text,
  });

  return NextResponse.json({ ok: true, reviewId }, { status: 201 });
}
