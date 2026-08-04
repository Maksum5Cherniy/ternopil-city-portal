import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Відновлення пароля",
  description: "Відновлення пароля користувача порталу Де Тернопіль.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto grid w-full max-w-[820px] gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">Відновлення пароля</h1>
        <p className="mt-4 text-base leading-8 text-muted">
          Вкажіть email профілю, і Firebase Authentication надішле лист для зміни пароля.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow)]">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
