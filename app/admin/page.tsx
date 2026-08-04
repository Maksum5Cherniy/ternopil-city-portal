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
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";
import AdminConsole from "@/components/admin/AdminConsole";
import { Badge } from "@/components/ui/Badge";
import { uk } from "@/config/dictionaries/uk";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import { getAdminDashboard } from "@/lib/database";

export const metadata: Metadata = {
  title: "Адміністративна панель",
  description: "Адміністративна панель міського порталу Тернополя.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

const adminSections = [
  {
    id: "admin-users",
    title: "Користувачі",
    description: "Профілі, блокування, статуси.",
    icon: Users,
  },
  {
    id: "admin-roles",
    title: "Ролі",
    description: "Admin, moderator, owner, user.",
    icon: ShieldCheck,
  },
  {
    id: "admin-news",
    title: "Новини",
    description: "Чернетки, публікації, категорії.",
    icon: FileText,
  },
  {
    id: "admin-places",
    title: "Заклади",
    description: "Каталог, заявки власників, зміни.",
    icon: Building2,
  },
  {
    id: "admin-moderation",
    title: "Модерація",
    description: "Оголошення, відгуки, скарги.",
    icon: ClipboardCheck,
  },
  {
    id: "admin-reports",
    title: "Скарги",
    description: "Розгляд порушень і блокування.",
    icon: Flag,
  },
  { id: "admin-ads", title: "Реклама", description: "Банери і промо-блоки.", icon: Megaphone },
  { id: "admin-home", title: "Головна", description: "Порядок секцій і добірки.", icon: Home },
  {
    id: "admin-notifications",
    title: "Сповіщення",
    description: "Системні повідомлення.",
    icon: Bell,
  },
  {
    id: "admin-stats",
    title: "Статистика",
    description: "Перегляди, кліки, активність.",
    icon: BarChart3,
  },
  {
    id: "admin-settings",
    title: "Налаштування",
    description: "SEO, бренд, системні параметри.",
    icon: Settings,
  },
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

  const dashboard = await getAdminDashboard();
  const stats = [
    { label: "Користувачі", value: String(dashboard.stats.users) },
    { label: "На модерації", value: String(dashboard.stats.pendingListings) },
    { label: "Заявки власників", value: String(dashboard.stats.ownerClaims) },
    { label: "Скарги", value: String(dashboard.stats.pendingReports) },
    { label: "Відгуки", value: String(dashboard.stats.pendingReviews) },
    { label: "Активні оголошення", value: String(dashboard.stats.activeListings) },
    { label: "Заблоковані", value: String(dashboard.stats.blockedUsers) },
    { label: "Контент", value: String(dashboard.stats.contentItems) },
    { label: "Сповіщення", value: String(dashboard.stats.sentNotifications) },
  ];

  return (
    <section
      id="admin-top"
      className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
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

      <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
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
            <a
              key={section.title}
              href={`#${section.id}`}
              className="group flex min-h-[132px] flex-col rounded-lg border border-border bg-surface p-5 transition hover:border-primary hover:bg-primary-soft hover:shadow-[var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="flex flex-1 items-start gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-soft text-primary">
                  <Icon aria-hidden size={22} />
                </span>
                <div>
                  <h2 className="font-semibold">{section.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted">{section.description}</p>
                </div>
              </div>
              <span className="mt-4 text-sm font-semibold text-primary">Відкрити розділ</span>
            </a>
          );
        })}
      </div>

      <AdminConsole data={dashboard} />
    </section>
  );
}
