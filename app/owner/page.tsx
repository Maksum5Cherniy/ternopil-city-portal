import type { Metadata } from "next";
import {
  BarChart3,
  CalendarPlus,
  ClipboardList,
  Images,
  MessageSquare,
  Store,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Кабінет власника",
  description: "Кабінет власника закладу на порталі Де Тернопіль.",
  robots: { index: false, follow: false },
};

const ownerSections = [
  { title: "Мій заклад", description: "Опис, контакти, графік, соцмережі.", icon: Store },
  { title: "Фотографії", description: "Логотип, обкладинка, галерея, меню.", icon: Images },
  { title: "Акції та події", description: "Промо, майбутні події, архів.", icon: CalendarPlus },
  {
    title: "Відгуки",
    description: "Відповіді власника без видалення негативу.",
    icon: MessageSquare,
  },
  { title: "Працівники", description: "Обмежені ролі для команди закладу.", icon: Users },
  { title: "Статистика", description: "Перегляди, дзвінки, маршрути, переходи.", icon: BarChart3 },
  { title: "Модерація", description: "Статус заявок і причини відхилення.", icon: ClipboardList },
];

export default function OwnerPage() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Badge variant="primary">Owner</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
        Кабінет власника закладу
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
        Власник подає заявку на заклад, після підтвердження керує даними, фото, меню, подіями,
        відгуками, працівниками та статистикою. Важливі зміни йдуть через модерацію.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ownerSections.map((section) => {
          const Icon = section.icon;

          return (
            <article key={section.title} className="rounded-lg border border-border bg-surface p-5">
              <Icon aria-hidden size={24} className="text-primary" />
              <h2 className="mt-3 font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{section.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
