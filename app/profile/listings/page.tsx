import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserListingsClient from "@/components/market/UserListingsClient";
import { Badge } from "@/components/ui/Badge";
import { getCurrentServerSession } from "@/lib/auth-session";
import { getUserListings } from "@/lib/database";

export const metadata: Metadata = {
  title: "Мої оголошення",
  description: "Керування власними оголошеннями на барахолці Де Тернопіль.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function ListingsBlockedState({ title, description }: { title: string; description: string }) {
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

export default async function ProfileListingsPage() {
  const session = await getCurrentServerSession();

  if (session.status === "signedOut" || session.status === "invalid") {
    redirect("/login?next=/profile/listings");
  }

  if (session.status === "databaseMissing") {
    return (
      <ListingsBlockedState
        title="База даних не налаштована"
        description="Ваші оголошення тимчасово недоступні. Спробуйте пізніше."
      />
    );
  }

  if (session.status === "blocked") {
    return (
      <ListingsBlockedState
        title="Профіль заблокований"
        description="Цей акаунт не може керувати оголошеннями."
      />
    );
  }

  if (!session.user.emailVerified) {
    return (
      <ListingsBlockedState
        title="Підтвердіть email"
        description="Керування оголошеннями доступне після підтвердження електронної адреси."
      />
    );
  }

  const listings = await getUserListings(session.user.uid);

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="primary">Барахолка</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
            Мої оголошення
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
            Тут продавець бачить статус модерації, причину відхилення, дату завершення та керує
            життєвим циклом оголошення.
          </p>
        </div>
        <Link
          href="/market/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          Створити оголошення
        </Link>
      </div>

      <div className="mt-8">
        <UserListingsClient listings={listings} />
      </div>
    </section>
  );
}
