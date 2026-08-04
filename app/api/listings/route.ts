import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentServerSession } from "@/lib/auth-session";
import { createListing, getRecentListingCount, isDatabaseConfigured } from "@/lib/database";
import { listingCreateSchema } from "@/schemas/listing";

export const runtime = "nodejs";

const listingLifetimeMs = 30 * 24 * 60 * 60 * 1000;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9а-яіїєґ]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSocialHandle(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return "";
  }

  return trimmed
    .replace(/^https?:\/\/(www\.)?(t\.me|telegram\.me|instagram\.com)\//i, "")
    .replace(/\/+$/g, "")
    .replace(/^@/, "");
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "База даних ще не налаштована. Підключіть Neon Store у Vercel." },
      { status: 503 },
    );
  }

  const session = await getCurrentServerSession();

  if (session.status !== "authenticated") {
    return NextResponse.json(
      { error: "Щоб створити оголошення, потрібно увійти." },
      { status: 401 },
    );
  }

  if (!session.user.emailVerified) {
    return NextResponse.json(
      { error: "Підтвердіть email, щоб створювати оголошення на барахолці." },
      { status: 403 },
    );
  }

  if (session.user.sellerStatus === "suspended") {
    return NextResponse.json(
      { error: "Публікацію оголошень для цього профілю призупинено." },
      { status: 403 },
    );
  }

  const recentListings = await getRecentListingCount(session.user.uid, 60);

  if (recentListings >= 5) {
    return NextResponse.json(
      { error: "Досягнуто ліміт публікацій. Спробуйте пізніше." },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некоректний JSON." }, { status: 400 });
  }

  const parsed = listingCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const id = randomUUID();
  const slugBase = slugify(parsed.data.title) || "listing";
  const slug = `${slugBase}-${id.slice(0, 8)}`;

  await createListing({
    id,
    slug,
    userId: session.user.uid,
    title: parsed.data.title,
    description: parsed.data.description,
    price: parsed.data.price,
    categoryId: parsed.data.categoryId,
    condition: parsed.data.condition,
    district: parsed.data.district,
    phone: parsed.data.phone?.trim(),
    telegram: normalizeSocialHandle(parsed.data.telegram),
    instagram: normalizeSocialHandle(parsed.data.instagram),
    preferredContact: parsed.data.preferredContact,
    expiresAt: new Date(Date.now() + listingLifetimeMs).toISOString(),
  });

  return NextResponse.json({ ok: true, slug }, { status: 201 });
}
