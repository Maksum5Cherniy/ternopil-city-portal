import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { getCurrentServerSession } from "@/lib/auth-session";
import { getUserNotifications } from "@/lib/database";

export const metadata: Metadata = {
  title: "Сповіщення",
  description: "Особисті сповіщення профілю на порталі Де Тернопіль.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function NotificationsBlockedState({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto w-full max-w-[860px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="rounded-lg border border-accent/40 bg-accent-soft p-6">
        <Badge variant="warning">Профіль</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-8 text-muted">{description}</p>
        <Link
          href="/profile"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          До профілю
        </Link>
      </div>
    </section>
  );
}

export default async function ProfileNotificationsPage() {
  const session = await getCurrentServerSession();

  if (session.status === "signedOut" || session.status === "invalid") {
    redirect("/login?next=/profile/notifications");
  }

  if (session.status === "databaseMissing") {
    return (
      <NotificationsBlockedState
        title="База даних не налаштована"
        description="Підключіть Neon Store у Vercel, щоб читати сповіщення профілю."
      />
    );
  }

  if (session.status === "blocked") {
    return (
      <NotificationsBlockedState
        title="Профіль заблокований"
        description="Цей акаунт не може відкривати особисті сповіщення."
      />
    );
  }

  const notifications = await getUserNotifications(session.user.uid);

  return (
    <section className="mx-auto w-full max-w-[920px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Badge variant="primary">Профіль</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Сповіщення</h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
        Тут з’являються рішення модерації, статуси заявок власника та системні повідомлення.
      </p>

      <div className="mt-8 grid gap-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary">
                  <Bell aria-hidden size={19} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{notification.title}</h2>
                    <Badge variant={notification.readAt ? "neutral" : "warning"}>
                      {notification.readAt ? "прочитано" : "нове"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{notification.body}</p>
                  <p className="mt-3 text-xs font-semibold text-muted">
                    {new Date(notification.createdAt).toLocaleString("uk-UA")}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface-subtle p-8 text-center">
            <Bell aria-hidden size={28} className="mx-auto text-muted" />
            <p className="mt-3 text-sm text-muted">Сповіщень ще немає.</p>
          </div>
        )}
      </div>
    </section>
  );
}
