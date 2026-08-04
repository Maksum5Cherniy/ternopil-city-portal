import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { SITE } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Контакти",
  description: "Контакти команди міського порталу Тернополя.",
};

export default function ContactsPage() {
  return (
    <section className="mx-auto w-full max-w-[840px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">Контакти</h1>
      <p className="mt-5 text-base leading-8 text-muted">
        Для питань щодо партнерства, модерації матеріалів або роботи порталу використовуйте основний
        email.
      </p>
      <a
        href={`mailto:${SITE.contactEmail}`}
        className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md border border-primary bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong"
      >
        <Mail aria-hidden size={18} />
        <span>{SITE.contactEmail}</span>
      </a>
    </section>
  );
}
