import { NextResponse } from "next/server";
import { getCurrentServerSession } from "@/lib/auth-session";
import { updateOwnListingStatus } from "@/lib/database";
import { listingStatusUpdateSchema } from "@/schemas/listing";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getCurrentServerSession();

  if (session.status !== "authenticated") {
    return NextResponse.json({ error: "Потрібно увійти в акаунт." }, { status: 401 });
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Підтвердіть email, щоб керувати оголошеннями." },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = listingStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { id } = await params;
  const listing = await updateOwnListingStatus({
    userId: session.user.uid,
    listingId: id,
    status: parsed.data.status,
  });

  if (!listing) {
    return NextResponse.json(
      { error: "Оголошення не знайдено або воно не належить цьому профілю." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, listing });
}
