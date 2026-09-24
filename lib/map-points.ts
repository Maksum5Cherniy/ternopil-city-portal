import {
  getUpcomingEvents,
  locations,
  placeCategories,
  places,
  type PortalEntity,
} from "@/constants/content";

export type CityMapPointType = "place" | "location" | "event" | "service";

export type CityMapPoint = {
  id: string;
  type: CityMapPointType;
  title: string;
  description: string;
  href?: string;
  meta?: string;
  badge?: string;
  address?: string;
  category: string;
  lat: number;
  lng: number;
  rating?: number;
};

const servicePoints: CityMapPoint[] = [
  {
    id: "service-tourist-center",
    type: "service",
    title: "Туристично-інформаційний центр",
    description: "Центральна точка для гостей міста, маршрутів і міських довідок.",
    href: "/contacts",
    meta: "Сервіс",
    badge: "Довідка",
    address: "центр Тернополя",
    category: "services",
    lat: 49.5538,
    lng: 25.594,
  },
  {
    id: "service-central-bus",
    type: "service",
    title: "Автовокзал",
    description: "Транспортна точка для міжміських поїздок і пересадок.",
    href: "/map",
    meta: "Транспорт",
    address: "вул. Торговиця",
    category: "transport",
    lat: 49.5482,
    lng: 25.5836,
  },
  {
    id: "service-podoliany-parking",
    type: "service",
    title: "Паркінг біля ТРЦ Подоляни",
    description: "Орієнтир для великих подій, покупок і зустрічей.",
    href: "/map",
    meta: "Парковка",
    address: "вул. Текстильна",
    category: "parking",
    lat: 49.5667,
    lng: 25.6193,
  },
];

function entityToPoint(item: PortalEntity, type: CityMapPointType): CityMapPoint | null {
  if (!item.coordinates) {
    return null;
  }

  return {
    id: `${type}-${item.slug}`,
    type,
    title: item.title,
    description: item.description,
    href: item.href,
    meta: item.meta,
    badge: item.badge,
    address: item.address,
    category: item.category,
    lat: item.coordinates.lat,
    lng: item.coordinates.lng,
    rating: item.rating,
  };
}

export function getCityMapPoints() {
  const placeCategorySlugs = new Set(placeCategories.map((item) => item.slug));

  return [
    ...places
      .filter((item) => !placeCategorySlugs.has(item.slug))
      .map((item) => entityToPoint(item, "place")),
    ...locations.map((item) => entityToPoint(item, "location")),
    ...getUpcomingEvents().map((item) => entityToPoint(item, "event")),
    ...servicePoints,
  ].filter((item): item is CityMapPoint => Boolean(item));
}
