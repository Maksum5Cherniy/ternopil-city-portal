import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { uk } from "@/config/dictionaries/uk";

export const metadata: Metadata = {
  title: "Вхід",
  description: "Вхід користувача в міський портал Тернополя.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="mx-auto grid w-full max-w-[920px] gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">{uk.auth.loginTitle}</h1>
        <p className="mt-4 text-base leading-8 text-muted">{uk.auth.loginDescription}</p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow)]">
        <LoginForm />
      </div>
    </section>
  );
}
