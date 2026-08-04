import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Megaphone, Send, ShieldCheck, Store } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { SITE } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Контакти",
  description: "Контакти команди міського порталу Тернополя для реклами, партнерства і модерації.",
};

const contactTopics = [
  {
    title: "Реклама",
    description: "Банери, промо-блоки, спецпроєкти та розміщення закладу на головній.",
    icon: Megaphone,
  },
  {
    title: "Заклади",
    description: "Заявка власника, оновлення картки, меню, графік, фото та акції.",
    icon: Store,
  },
  {
    title: "Модерація",
    description: "Скарги, помилки в матеріалах, оголошеннях, відгуках або даних закладу.",
    icon: ShieldCheck,
  },
  {
    title: "Партнерство",
    description: "Спільні міські добірки, події, інформаційні кампанії та нові розділи.",
    icon: BadgeCheck,
  },
];

export default function ContactsPage() {
  return (
    <section className="mx-auto w-full max-w-[980px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Badge variant="primary">Зв&apos;язок</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Контакти</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-muted sm:text-lg">
        Для замовлення реклами, оновлення даних закладу, питань модерації або інших деталей
        звертайтеся до нас у Telegram.
      </p>

      <div className="mt-7 rounded-lg border border-primary/30 bg-primary-soft p-5 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-primary text-white">
                <Send aria-hidden size={22} />
              </span>
              <div>
                <h2 className="text-xl font-semibold">{SITE.contactTelegram}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Основний канал для реклами, партнерства і підтримки порталу.
                </p>
              </div>
            </div>
          </div>
          <LinkButton
            href={SITE.contactTelegramUrl}
            variant="primary"
            rightIcon={<ArrowRight aria-hidden size={17} />}
          >
            Написати в Telegram
          </LinkButton>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {contactTopics.map((topic) => {
          const Icon = topic.icon;

          return (
            <article key={topic.title} className="rounded-lg border border-border bg-surface p-5">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-info-soft text-info">
                <Icon aria-hidden size={21} />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{topic.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{topic.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
