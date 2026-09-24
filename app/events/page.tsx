import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { events, getUpcomingEvents } from "@/constants/content";

export const metadata: Metadata = {
  title: "Події Тернополя",
  description: "Афіша Тернополя: концерти, фестивалі, виставки, майстер-класи та дитячі події.",
};

export const dynamic = "force-dynamic";

export default function EventsPage() {
  const upcoming = getUpcomingEvents();

  return (
    <ModulePage
      eyebrow={upcoming.length ? "Події" : "Архів"}
      title={upcoming.length ? "Афіша Тернополя" : "Архів подій"}
      description={
        upcoming.length
          ? "Майбутні події Тернополя з датами та місцями проведення."
          : "Наразі немає підтверджених майбутніх подій. Тут можна переглянути минулі анонси."
      }
      items={upcoming.length ? upcoming : events}
    />
  );
}
