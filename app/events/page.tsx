import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { events, getCityDate, isUpcomingEvent } from "@/constants/content";
import {
  getPublishedAdminPortalEntities,
  mergePortalEntities,
} from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Події Тернополя",
  description:
    "Афіша Тернополя: концерти, фестивалі, виставки, майстер-класи та дитячі події.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const adminEvents = await getPublishedAdminPortalEntities("event");
  const allEvents = mergePortalEntities(adminEvents, events);
  const today = getCityDate();
  const upcoming = allEvents.filter((item) => isUpcomingEvent(item, today));

  return (
    <ModulePage
      eyebrow={upcoming.length ? "Події" : "Архів"}
      title={upcoming.length ? "Афіша Тернополя" : "Архів подій"}
      description={
        upcoming.length
          ? "Підтверджені події з датою, місцем і посиланням на організатора. Уточнюйте зміни програми перед відвідуванням."
          : "Наразі немає підтверджених майбутніх подій. Нижче — анонси, що вже завершилися."
      }
      items={upcoming.length ? upcoming : allEvents}
    />
  );
}
