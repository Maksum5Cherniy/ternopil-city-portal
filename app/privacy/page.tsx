import type { Metadata } from "next";
import { SITE } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Політика конфіденційності",
  description: "Політика конфіденційності міського порталу Тернополя.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-[840px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">
        Політика конфіденційності
      </h1>
      <div className="mt-6 grid gap-5 text-base leading-8 text-muted">
        <p>
          {SITE.title} обробляє дані профілю для входу, публікації матеріалів, модерації, сповіщень
          і захисту від зловживань. Список обраного зберігається тільки в цьому браузері окремо для
          кожного профілю.
        </p>
        <p>
          Публічні матеріали можуть містити назву профілю, контактні дані, фото, тексти, рейтинги та
          іншу інформацію, яку користувач сам додає до порталу.
        </p>
        <p>
          Секретні ключі бази даних, службові облікові дані та приватні токени не зберігаються у
          клієнтському коді й не мають потрапляти до репозиторію.
        </p>
      </div>
    </section>
  );
}
