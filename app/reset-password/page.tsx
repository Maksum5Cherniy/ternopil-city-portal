import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Новий пароль",
  description: "Створення нового пароля для профілю Де Тернопіль.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token: rawToken } = await searchParams;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  return (
    <section className="mx-auto grid w-full max-w-[820px] gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">Новий пароль</h1>
        <p className="mt-4 text-base leading-8 text-muted">
          Введіть новий пароль для профілю. Посилання з листа діє 1 годину і може бути використане
          тільки один раз.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow)]">
        <ResetPasswordForm token={token} />
      </div>
    </section>
  );
}
