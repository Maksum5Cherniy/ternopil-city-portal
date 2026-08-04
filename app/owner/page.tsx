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
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import OwnerClaimForm from "@/components/owner/OwnerClaimForm";
import { getCurrentServerSession } from "@/lib/auth-session";
import { getOwnerDashboard } from "@/lib/database";

export const metadata: Metadata = {
  title: "Кабінет власника",
  description: "Кабінет власника закладу на порталі Де Тернопіль.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

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

function OwnerBlockedState({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto w-full max-w-[860px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="rounded-lg border border-accent/40 bg-accent-soft p-6">
        <Badge variant="warning">Owner</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-8 text-muted">{description}</p>
      </div>
    </section>
  );
}

export default async function OwnerPage() {
  const session = await getCurrentServerSession();

  if (session.status === "signedOut" || session.status === "invalid") {
    redirect("/login?next=/owner");
  }

  if (session.status === "databaseMissing") {
    return (
      <OwnerBlockedState
        title="База даних не налаштована"
        description="Підключіть Neon Store у Vercel, щоб власники могли подавати заявки та керувати закладами."
      />
    );
  }

  if (session.status === "blocked") {
    return (
      <OwnerBlockedState
        title="Профіль заблокований"
        description="Цей акаунт не може подавати заявки власника або керувати закладами."
      />
    );
  }

  if (!session.user.emailVerified) {
    return (
      <OwnerBlockedState
        title="Підтвердіть email"
        description="Перед подачею заявки власника закладу потрібно підтвердити електронну адресу в особистому кабінеті."
      />
    );
  }

  const dashboard = await getOwnerDashboard(session.user.uid);
  const isOwner = session.user.roles.includes("owner") || session.user.roles.includes("admin");

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Badge variant="primary">{isOwner ? "Owner" : "Заявка"}</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
            Кабінет власника закладу
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
            Власник подає заявку на заклад, після підтвердження керує даними, фото, меню, подіями,
            відгуками, працівниками та статистикою. Важливі зміни йдуть через модерацію.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow)]">
          <h2 className="text-xl font-semibold">Подати заявку</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Опишіть заклад і контактні дані. Модератор перевірить заявку та видасть роль owner.
          </p>
          <div className="mt-5">
            <OwnerClaimForm />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-xl font-semibold">Мої заявки</h2>
          <div className="mt-4 grid gap-3">
            {dashboard.claims.length > 0 ? (
              dashboard.claims.map((claim) => (
                <div key={claim.id} className="rounded-md border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{claim.placeName}</h3>
                    <Badge variant={claim.status === "approved" ? "primary" : "warning"}>
                      {claim.status}
                    </Badge>
                  </div>
                  {claim.moderationComment ? (
                    <p className="mt-2 text-sm text-muted">{claim.moderationComment}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted">Заявок ще немає.</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ownerSections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.title}
                className={`rounded-lg border border-border bg-surface p-5 ${
                  isOwner ? "" : "opacity-60"
                }`}
              >
                <Icon aria-hidden size={24} className="text-primary" />
                <h2 className="mt-3 font-semibold">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{section.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
