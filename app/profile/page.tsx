import type { Metadata } from "next";
import ProfileClient from "@/components/auth/ProfileClient";
import { uk } from "@/config/dictionaries/uk";

export const metadata: Metadata = {
  title: "Особистий кабінет",
  description: "Особистий кабінет користувача міського порталу Тернополя.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">{uk.profile.title}</h1>
        <p className="mt-4 text-base leading-8 text-muted">{uk.profile.description}</p>
      </div>
      <ProfileClient />
    </section>
  );
}
