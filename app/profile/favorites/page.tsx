import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import FavoritesClient from "@/components/profile/FavoritesClient";
import { Badge } from "@/components/ui/Badge";
import { getCurrentServerSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Обране",
  description: "Збережені матеріали профілю на порталі Де Тернопіль.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function FavoritesBlockedState({ title, description }: { title: string; description: string }) {
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

export default async function ProfileFavoritesPage() {
  const session = await getCurrentServerSession();

  if (session.status === "signedOut" || session.status === "invalid") {
    redirect("/login?next=/profile/favorites");
  }

  if (session.status === "databaseMissing") {
    return (
      <FavoritesBlockedState
        title="База даних не налаштована"
        description="Профіль тимчасово недоступний. Спробуйте пізніше."
      />
    );
  }

  if (session.status === "blocked") {
    return (
      <FavoritesBlockedState
        title="Профіль заблокований"
        description="Цей акаунт не може відкривати особистий розділ."
      />
    );
  }

  return (
    <section className="mx-auto w-full max-w-[920px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Badge variant="primary">Профіль</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Обране</h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
        Збережені новини, заклади, події та оголошення з цього браузера.
      </p>

      <div className="mt-8">
        <FavoritesClient userId={session.user.uid} />
      </div>
    </section>
  );
}
