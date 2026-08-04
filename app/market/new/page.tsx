import type { Metadata } from "next";
import ListingForm from "@/components/market/ListingForm";
import { Badge } from "@/components/ui/Badge";
import { getCurrentServerSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Додати оголошення",
  description: "Створення оголошення на міській барахолці Де Тернопіль.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function BlockedListingState({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto grid w-full max-w-[960px] gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">Додати оголошення</h1>
        <p className="mt-4 text-base leading-8 text-muted">
          Оголошення потрапляє на модерацію, має обмеження фото, строк активності, статуси та
          контакти без внутрішнього чату.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow)]">
        <Badge variant="warning">Потрібна дія</Badge>
        <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      </div>
    </section>
  );
}

export default async function NewListingPage() {
  const session = await getCurrentServerSession();

  if (session.status === "signedOut" || session.status === "invalid") {
    redirect("/login?next=/market/new");
  }

  if (session.status === "databaseMissing") {
    return (
      <BlockedListingState
        title="База даних не налаштована"
        description="Підключіть Neon Store у Vercel, щоб користувачі могли створювати оголошення."
      />
    );
  }

  if (session.status === "blocked") {
    return (
      <BlockedListingState
        title="Профіль заблокований"
        description="Цей профіль не може створювати оголошення."
      />
    );
  }

  if (!session.user.emailVerified) {
    return (
      <BlockedListingState
        title="Підтвердіть email"
        description="Перед публікацією оголошень потрібно підтвердити електронну адресу в особистому кабінеті."
      />
    );
  }

  if (session.user.sellerStatus === "suspended") {
    return (
      <BlockedListingState
        title="Продажі призупинено"
        description="Адміністрація призупинила створення оголошень для цього профілю. Перевірте сповіщення або зверніться через контакти."
      />
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-[960px] gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">Додати оголошення</h1>
        <p className="mt-4 text-base leading-8 text-muted">
          Оголошення потрапляє на модерацію, має обмеження фото, строк активності, статуси та
          контакти без внутрішнього чату.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow)]">
        <ListingForm />
      </div>
    </section>
  );
}
