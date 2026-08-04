import type { Metadata } from "next";
import { Flag, ListChecks, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import ModerationConsole from "@/components/moderation/ModerationConsole";
import { getCurrentServerSession, hasServerRole } from "@/lib/auth-session";
import { getModerationDashboard } from "@/lib/database";

export const metadata: Metadata = {
  title: "Модерація",
  description: "Черга модерації порталу Де Тернопіль.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function ModerationDenied({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto w-full max-w-[860px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="rounded-lg border border-accent/40 bg-accent-soft p-6">
        <Badge variant="warning">Moderator</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-8 text-muted">{description}</p>
      </div>
    </section>
  );
}

export default async function ModerationPage() {
  const session = await getCurrentServerSession();

  if (session.status === "signedOut" || session.status === "invalid") {
    redirect("/login?next=/moderation");
  }

  if (session.status === "databaseMissing") {
    return (
      <ModerationDenied
        title="База даних не налаштована"
        description="Підключіть Neon Store у Vercel, щоб працювала черга модерації."
      />
    );
  }

  if (session.status === "blocked") {
    return (
      <ModerationDenied
        title="Профіль заблокований"
        description="Цей акаунт не може відкривати модерацію."
      />
    );
  }

  if (!session.user.emailVerified || !hasServerRole(session, "moderator")) {
    return (
      <ModerationDenied
        title="Недостатньо прав"
        description="Доступ до модерації дозволений тільки підтвердженим користувачам із роллю moderator або admin."
      />
    );
  }

  const data = await getModerationDashboard();

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Badge variant="warning">Moderator</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Черга модерації</h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
        Модератори перевіряють оголошення, заявки власників, скарги й зміни закладів. Кожна дія
        записується в журнал.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-5">
          <ListChecks aria-hidden size={24} className="text-primary" />
          <div className="mt-3 text-2xl font-semibold">{data.listings.length}</div>
          <p className="text-sm text-muted">оголошень очікують рішення</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <ShieldAlert aria-hidden size={24} className="text-accent-strong" />
          <div className="mt-3 text-2xl font-semibold">{data.ownerClaims.length}</div>
          <p className="text-sm text-muted">заявок власників очікують рішення</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <Flag aria-hidden size={24} className="text-accent-strong" />
          <div className="mt-3 text-2xl font-semibold">{data.reports.length}</div>
          <p className="text-sm text-muted">скарг очікують рішення</p>
        </div>
      </div>
      <ModerationConsole data={data} />
    </section>
  );
}
