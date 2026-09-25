import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Політика конфіденційності",
  description:
    "Які дані обробляє міський портал Де Тернопіль і як звернутися щодо них.",
};

const sections = [
  {
    title: "Дані профілю",
    text: "Під час реєстрації ми отримуємо ім’я, email і пароль. У базі зберігається захищений відбиток пароля, статус підтвердження email, роль та налаштування профілю. Для входу використовується захищений cookie сеансу; звичайний сеанс діє до п’яти днів.",
  },
  {
    title: "Публікації та звернення",
    text: "Якщо ви публікуєте оголошення чи відгук або подаєте заявку власника, ми обробляємо вказані вами тексти, контакти й пов’язані дані для показу матеріалу та модерації. Ім’я автора й контакти, які ви додали до опублікованого оголошення, можуть бачити інші відвідувачі. Не розміщуйте особисту інформацію, яку не хочете оприлюднювати.",
  },
  {
    title: "Захист і зберігання",
    text: "Для захисту від зловживань ми ведемо записи про спроби входу, дії модераторів, скарги й статуси матеріалів. Доступ до цих даних обмежений ролями. Відомості профілю, публікацій та службові записи зберігаються в базі Neon; листи підтвердження та відновлення надсилаються через Resend. Сайт розміщений на Sites.",
  },
  {
    title: "Ваш браузер",
    text: "Список обраного й вибір теми зберігаються у вашому браузері. Обране прив’язане до ідентифікатора профілю на цьому пристрої; на іншому пристрої воно автоматично не з’явиться. Інтерактивна карта завантажує картографічні плитки OpenStreetMap. Геолокація запитується лише після натискання «Моє місце».",
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-[840px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">
        Політика конфіденційності
      </h1>
      <p className="mt-5 text-base leading-8 text-muted">
        Як {SITE.title} використовує дані, потрібні для роботи порталу.
      </p>
      <div className="mt-8 grid gap-5">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-2 leading-7 text-muted">{section.text}</p>
          </section>
        ))}
      </div>
      <p className="mt-7 leading-7 text-muted">
        Щоб запитати про свої дані, виправити їх або попросити видалити профіль,{" "}
        <Link href="/contacts" className="font-semibold text-primary underline">
          зверніться до команди порталу
        </Link>
        . Для підтвердження запиту ми можемо попросити довести, що профіль
        належить вам.
      </p>
    </section>
  );
}
