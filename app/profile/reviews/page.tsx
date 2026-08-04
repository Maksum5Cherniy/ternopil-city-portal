import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { getCurrentServerSession } from "@/lib/auth-session";
import { getUserReviews } from "@/lib/database";

export const metadata: Metadata = {
  title: "Мої відгуки",
  description: "Власні відгуки та статуси модерації на порталі Де Тернопіль.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function ReviewsBlockedState({ title, description }: { title: string; description: string }) {
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

function reviewVariant(status: string) {
  return status === "approved" ? "primary" : status === "pending" ? "warning" : "neutral";
}

export default async function ProfileReviewsPage() {
  const session = await getCurrentServerSession();

  if (session.status === "signedOut" || session.status === "invalid") {
    redirect("/login?next=/profile/reviews");
  }

  if (session.status === "databaseMissing") {
    return (
      <ReviewsBlockedState
        title="База даних не налаштована"
        description="Підключіть Neon Store у Vercel, щоб читати власні відгуки."
      />
    );
  }

  if (session.status === "blocked") {
    return (
      <ReviewsBlockedState
        title="Профіль заблокований"
        description="Цей акаунт не може відкривати особисті відгуки."
      />
    );
  }

  const reviews = await getUserReviews(session.user.uid);

  return (
    <section className="mx-auto w-full max-w-[920px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Badge variant="primary">Профіль</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Мої відгуки</h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
        Відгуки до закладів, їхній статус модерації та відповіді власників.
      </p>

      <div className="mt-8 grid gap-3">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <article key={review.id} className="rounded-lg border border-border bg-surface p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{review.targetTitle}</h2>
                    <Badge variant={reviewVariant(review.status)}>{review.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-muted">
                    Оцінка: {review.rating} / 5 ·{" "}
                    {new Date(review.createdAt).toLocaleString("uk-UA")}
                  </p>
                </div>
                <Link
                  href={review.targetHref}
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  Відкрити
                </Link>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{review.text}</p>
              {review.moderationComment ? (
                <p className="mt-3 rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-accent-strong">
                  {review.moderationComment}
                </p>
              ) : null}
              {review.ownerReply ? (
                <p className="mt-3 rounded-md bg-surface-subtle px-3 py-2 text-sm leading-6">
                  {review.ownerReply}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface-subtle p-8 text-center">
            <MessageSquare aria-hidden size={28} className="mx-auto text-muted" />
            <p className="mt-3 text-sm text-muted">Відгуків ще немає.</p>
            <Link
              href="/places"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
            >
              Перейти до закладів
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
