import type { Metadata } from "next";
import {
  BarChart3,
  Bell,
  Building2,
  ClipboardCheck,
  FileText,
  Flag,
  Home,
  Megaphone,
  Settings,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { uk } from "@/config/dictionaries/uk";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Адміністративна панель",
  description: "Адміністративна панель міського порталу Тернополя.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

const stats = [
  { label: "На модерації", value: "24" },
  { label: "Нові заявки", value: "7" },
  { label: "Скарги", value: "5" },
  { label: "Активні оголошення", value: "128" },
];

const adminSections = [
  { title: "Користувачі", description: "Профілі, блокування, статуси.", icon: Users },
  { title: "Ролі", description: "Admin, moderator, owner, user.", icon: ShieldCheck },
  { title: "Новини", description: "Чернетки, публікації, категорії.", icon: FileText },
  { title: "Заклади", description: "Каталог, заявки власників, зміни.", icon: Building2 },
  { title: "Модерація", description: "Оголошення, відгуки, скарги.", icon: ClipboardCheck },
  { title: "Скарги", description: "Розгляд порушень і блокування.", icon: Flag },
  { title: "Реклама", description: "Банери і промо-блоки.", icon: Megaphone },
  { title: "Головна", description: "Порядок секцій і добірки.", icon: Home },
  { title: "Категорії та теги", description: "Довідники для всіх модулів.", icon: Tags },
  { title: "Сповіщення", description: "Системні повідомлення.", icon: Bell },
  { title: "Статистика", description: "Перегляди, кліки, активність.", icon: BarChart3 },
  { title: "Налаштування", description: "SEO, бренд, системні параметри.", icon: Settings },
];

function AdminAccessDenied({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="rounded-lg border border-accent/40 bg-accent-soft p-6">
        <Badge variant="warning">403</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{description}</p>
      </div>
    </section>
  );
}

export default async function AdminPage() {
  const session = await getCurrentServerSession();

  if (session.status === "signedOut" || session.status === "invalid") {
    redirect("/login?next=/admin");
  }

  if (session.status === "databaseMissing") {
    return (
      <AdminAccessDenied
        title="Server-side доступ не налаштований"
        description="Адмінпанель закрита. Підключіть Neon Postgres Store у Vercel, щоб сервер міг перевіряти session cookie та роль admin."
      />
    );
  }

  if (session.status === "blocked") {
    return (
      <AdminAccessDenied
        title="Профіль заблокований"
        description="Цей акаунт не може відкривати адміністративну панель."
      />
    );
  }

  if (!hasServerRole(session, "admin")) {
    return (
      <AdminAccessDenied
        title="Недостатньо прав"
        description="Доступ до адміністративної панелі дозволений тільки користувачам із роллю admin."
      />
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="warning">Admin</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
            {uk.admin.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{uk.admin.description}</p>
        </div>
        <div className="rounded-lg border border-accent/40 bg-accent-soft p-4 text-sm leading-6 text-accent-strong lg:max-w-sm">
          Доступ підтверджено server-side: session cookie перевірено через Postgres, роль admin
          прочитано з таблиці users.
        </div>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface p-5">
            <div className="text-2xl font-semibold text-primary">{stat.value}</div>
            <div className="mt-1 text-sm text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;

          return (
            <article key={section.title} className="rounded-lg border border-border bg-surface p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-soft text-primary">
                  <Icon aria-hidden size={22} />
                </span>
                <div>
                  <h2 className="font-semibold">{section.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted">{section.description}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
