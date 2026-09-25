import {
  getUpcomingEvents,
  locations,
  places,
  type PortalEntity,
} from "@/constants/content";

export type CityMapPointType = "place" | "location" | "event";

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

function entityToPoint(
  item: PortalEntity,
  type: CityMapPointType,
): CityMapPoint | null {
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

export function getCityMapPoints(allPlaces = places) {
  return [
    ...allPlaces.map((item) => entityToPoint(item, "place")),
    ...locations.map((item) => entityToPoint(item, "location")),
    ...getUpcomingEvents().map((item) => entityToPoint(item, "event")),
  ].filter((item): item is CityMapPoint => Boolean(item));
}
