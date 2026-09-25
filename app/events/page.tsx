import type { Metadata } from "next";
import EventExplorer from "@/components/events/EventExplorer";
import { ModulePage } from "@/components/content/ModulePage";
import { Badge } from "@/components/ui/Badge";
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
  const upcoming = allEvents
    .filter((item) => isUpcomingEvent(item, today))
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const past = allEvents
    .filter((item) => !isUpcomingEvent(item, today))
    .sort((a, b) =>
      (b.endDate || b.date || "").localeCompare(a.endDate || a.date || ""),
    );

  return (
    <>
      <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-3xl">
          <Badge variant="primary">Події</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
            Афіша Тернополя
          </h1>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
            Підтверджені події з датою, місцем і посиланням на організатора.
            Уточнюйте зміни програми перед відвідуванням.
          </p>
        </div>
        <EventExplorer items={upcoming} />
      </section>
      {past.length > 0 ? (
        <div className="border-t border-border bg-surface-subtle">
          <ModulePage
            eyebrow="Архів"
            title="Минулі події"
            description="Анонси, що вже завершилися. Зберігаємо їх з датою й джерелом для довідки."
            items={past}
            headingLevel="h2"
          />
        </div>
      ) : null}
    </>
  );
}
