import type { Metadata } from "next";
import { MapPinned, Navigation, Search } from "lucide-react";
import CityMapShell from "@/components/map/CityMapShell";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/config/site.config";
import { places } from "@/constants/content";
import { getCityMapPoints } from "@/lib/map-points";
import {
  getPublishedAdminPortalEntities,
  mergePortalEntities,
} from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Карта Тернополя",
  description: "Інтерактивна карта закладів і міських локацій Тернополя.",
};

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const adminPlaces = await getPublishedAdminPortalEntities("place");
  const points = getCityMapPoints(mergePortalEntities(adminPlaces, places));
  const placeCount = points.filter((point) => point.type === "place").length;
  const locationCount = points.filter(
    (point) => point.type === "location",
  ).length;

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div>
          <Badge variant="primary">Карта</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
            Карта Тернополя
          </h1>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
            Заклади та місця для прогулянок із пошуком, фільтрами й маршрутом.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "закладів", value: placeCount, icon: MapPinned },
            { label: "локацій", value: locationCount, icon: Navigation },
            { label: "точок на карті", value: points.length, icon: Search },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <Icon aria-hidden size={18} className="text-primary" />
                <div className="mt-3 text-2xl font-semibold">{item.value}</div>
                <div className="text-sm text-muted">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <CityMapShell points={points} tileServer={SITE.mapTileServer} />
      </div>
    </section>
  );
}
