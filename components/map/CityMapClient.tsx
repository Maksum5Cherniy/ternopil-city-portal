"use client";

import L from "leaflet";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Crosshair, ExternalLink, LocateFixed, Navigation, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import type { CityMapPoint, CityMapPointType } from "@/lib/map-points";
import { cn } from "@/lib/utils";

const center: [number, number] = [49.5535, 25.5948];

const typeLabels: Record<CityMapPointType | "all", string> = {
  all: "Усі",
  place: "Заклади",
  location: "Локації",
  event: "Події",
  service: "Сервіси",
};

const markerClasses: Record<CityMapPointType, string> = {
  place: "city-map-marker-place",
  location: "city-map-marker-location",
  event: "city-map-marker-event",
  service: "city-map-marker-service",
};

function routeHref(point: CityMapPoint) {
  return `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
}

function createIcon(type: CityMapPointType, active: boolean) {
  return L.divIcon({
    className: "city-map-marker-wrap",
    html: `<span class="city-map-marker ${markerClasses[type]} ${active ? "city-map-marker-active" : ""}"></span>`,
    iconSize: active ? [24, 24] : [18, 18],
    iconAnchor: active ? [12, 12] : [9, 9],
    popupAnchor: [0, -12],
  });
}

function FlyToPoint({ point }: { point?: CityMapPoint }) {
  const map = useMap();

  useEffect(() => {
    if (point) {
      map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 15), { duration: 0.65 });
    }
  }, [map, point]);

  return null;
}

function LocateButton() {
  const map = useMap();
  const [status, setStatus] = useState("");

  function handleLocate() {
    if (!navigator.geolocation) {
      setStatus("Геолокація недоступна");
      return;
    }

    setStatus("Шукаємо...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus("");
        map.flyTo([position.coords.latitude, position.coords.longitude], 15, { duration: 0.75 });
      },
      () => setStatus("Не вдалося визначити"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="absolute right-3 top-3 z-[500] flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleLocate}
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-foreground shadow-[var(--shadow)] transition hover:border-primary hover:text-primary"
      >
        <LocateFixed aria-hidden size={17} />
        <span>Моє місце</span>
      </button>
      {status ? (
        <span className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-semibold text-muted shadow-[var(--shadow)]">
          {status}
        </span>
      ) : null}
    </div>
  );
}

export default function CityMapClient({
  points,
  tileServer,
}: {
  points: CityMapPoint[];
  tileServer: string;
}) {
  const [activeType, setActiveType] = useState<CityMapPointType | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(points[0]?.id || "");

  const filteredPoints = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return points.filter((point) => {
      const matchesType = activeType === "all" || point.type === activeType;
      const matchesQuery =
        !normalizedQuery ||
        [point.title, point.description, point.address, point.meta, point.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesType && matchesQuery;
    });
  }, [activeType, points, query]);

  const selectedPoint =
    filteredPoints.find((point) => point.id === selectedId) || filteredPoints[0] || points[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
      <aside className="rounded-lg border border-border bg-surface p-4 shadow-[var(--shadow)]">
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
          <Search aria-hidden size={17} className="text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Пошук на карті"
            className="min-h-11 flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(typeLabels) as Array<CityMapPointType | "all">).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setActiveType(type);
                setSelectedId("");
              }}
              className={cn(
                "min-h-9 rounded-md border px-3 text-sm font-semibold transition",
                activeType === type
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface-subtle text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>

        <div className="mt-4 grid max-h-[466px] gap-2 overflow-y-auto pr-1">
          {filteredPoints.length > 0 ? (
            filteredPoints.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelectedId(point.id)}
                className={cn(
                  "rounded-md border p-3 text-left transition hover:border-primary hover:bg-primary-soft",
                  selectedPoint?.id === point.id
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-surface-subtle",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={point.type === "event" ? "warning" : "primary"}>
                    {typeLabels[point.type]}
                  </Badge>
                  {point.meta ? (
                    <span className="text-xs font-semibold text-muted">{point.meta}</span>
                  ) : null}
                </div>
                <h2 className="mt-2 text-base font-semibold">{point.title}</h2>
                <p className="mt-1 text-sm leading-5 text-muted">{point.description}</p>
                {point.address ? (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <Crosshair aria-hidden size={14} />
                    {point.address}
                  </p>
                ) : null}
              </button>
            ))
          ) : (
            <div className="rounded-md border border-dashed border-border bg-surface-subtle p-4 text-sm text-muted">
              Нічого не знайдено. Змініть фільтр або пошуковий запит.
            </div>
          )}
        </div>
      </aside>

      <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow)]">
        <div className="relative h-[560px] min-h-[560px]">
          <MapContainer
            center={center}
            zoom={13}
            minZoom={11}
            maxZoom={18}
            zoomControl={false}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={tileServer}
            />
            <FlyToPoint point={selectedPoint} />
            <LocateButton />
            {filteredPoints.map((point) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                icon={createIcon(point.type, point.id === selectedPoint?.id)}
                eventHandlers={{ click: () => setSelectedId(point.id) }}
              >
                <Popup>
                  <div className="min-w-[220px]">
                    <div className="text-xs font-semibold uppercase text-primary">
                      {typeLabels[point.type]}
                    </div>
                    <h3 className="mt-1 text-base font-semibold">{point.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-muted">{point.description}</p>
                    {point.address ? (
                      <p className="mt-2 text-xs font-semibold text-foreground">{point.address}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {point.href ? (
                        <Link
                          href={point.href}
                          className="inline-flex min-h-9 items-center gap-1 rounded-md border border-border bg-surface px-2.5 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
                        >
                          <ExternalLink aria-hidden size={14} />
                          Відкрити
                        </Link>
                      ) : null}
                      <Link
                        href={routeHref(point)}
                        className="inline-flex min-h-9 items-center gap-1 rounded-md border border-primary bg-primary px-2.5 text-xs font-semibold text-white transition hover:bg-primary-strong"
                      >
                        <Navigation aria-hidden size={14} />
                        Маршрут
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {selectedPoint ? (
          <div className="border-t border-border bg-surface p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary">{typeLabels[selectedPoint.type]}</Badge>
                  {selectedPoint.badge ? (
                    <Badge variant="warning">{selectedPoint.badge}</Badge>
                  ) : null}
                </div>
                <h2 className="mt-2 text-lg font-semibold">{selectedPoint.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">{selectedPoint.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPoint.href ? (
                  <LinkButton
                    href={selectedPoint.href}
                    variant="secondary"
                    leftIcon={<ExternalLink aria-hidden size={17} />}
                  >
                    Деталі
                  </LinkButton>
                ) : null}
                <LinkButton
                  href={routeHref(selectedPoint)}
                  variant="primary"
                  leftIcon={<Navigation aria-hidden size={17} />}
                >
                  Маршрут
                </LinkButton>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
