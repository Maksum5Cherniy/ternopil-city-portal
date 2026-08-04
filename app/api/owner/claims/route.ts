import { NextResponse } from "next/server";
import { getCurrentServerSession } from "@/lib/auth-session";
import { createOwnerClaim } from "@/lib/database";
import { ownerClaimSchema } from "@/schemas/owner";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCurrentServerSession();

  if (session.status !== "authenticated") {
    return NextResponse.json({ error: "Потрібно увійти в акаунт." }, { status: 401 });
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Підтвердіть email, щоб подати заявку власника закладу." },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = ownerClaimSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const id = await createOwnerClaim({
    userId: session.user.uid,
    placeName: parsed.data.placeName,
    businessEmail: parsed.data.businessEmail || undefined,
    phone: parsed.data.phone,
    address: parsed.data.address,
    website: parsed.data.website || undefined,
    message: parsed.data.message,
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
