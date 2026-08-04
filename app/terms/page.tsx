import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Правила користування",
  description: "Правила користування міським порталом Тернополя.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-[840px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">Правила користування</h1>
      <div className="mt-6 grid gap-5 text-base leading-8 text-muted">
        <p>
          На порталі заборонені спам, образи, шахрайство, небезпечний контент, чужі персональні дані
          без дозволу та матеріали, що порушують законодавство України.
        </p>
        <p>
          Оголошення, відгуки, зміни закладів, скарги та заявки власників проходять перевірку
          відповідно до ролі користувача й стану модерації.
        </p>
        <p>
          Адміністрація може приховувати порушення, відхиляти матеріали, блокувати контент або
          обмежувати акаунт із фіксацією дії в журналі.
        </p>
      </div>
    </section>
  );
}
