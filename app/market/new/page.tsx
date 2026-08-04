import type { Metadata } from "next";
import ListingForm from "@/components/market/ListingForm";

export const metadata: Metadata = {
  title: "Додати оголошення",
  description: "Створення оголошення на міській барахолці Де Тернопіль.",
  robots: { index: false, follow: false },
};

export default function NewListingPage() {
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
