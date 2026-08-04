import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { verifyEmailToken } from "@/lib/database";

export const metadata: Metadata = {
  title: "Підтвердження email",
  description: "Підтвердження електронної адреси для профілю Де Тернопіль.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token: rawToken } = await searchParams;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  const user = token ? await verifyEmailToken(token) : null;

  return (
    <section className="mx-auto w-full max-w-[760px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow)]">
        <Badge variant={user ? "primary" : "warning"}>{user ? "Email" : "Помилка"}</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
          {user ? "Email підтверджено" : "Посилання недійсне"}
        </h1>
        <p className="mt-4 text-base leading-8 text-muted">
          {user
            ? "Профіль активовано. Тепер можна створювати оголошення, подавати заявки власника закладу і користуватися доступними ролями."
            : "Токен підтвердження відсутній, протермінований або вже використаний. Увійдіть у профіль і надішліть лист повторно."}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/profile"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
          >
            Перейти в кабінет
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-semibold"
          >
            Увійти
          </Link>
        </div>
      </div>
    </section>
  );
}
