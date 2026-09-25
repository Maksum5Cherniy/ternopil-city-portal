import "server-only";

import type { PortalEntity } from "@/constants/content";
import {
  getPublishedAdminContentItems,
  type AdminContentItemSummary,
  type AdminContentType,
} from "@/lib/database";

const publicTypeMeta: Record<
  AdminContentType,
  { label: string; basePath: string }
> = {
  news: { label: "Новини", basePath: "/news" },
  place: { label: "Заклад", basePath: "/places" },
  event: { label: "Подія", basePath: "/events" },
  ad: { label: "Реклама", basePath: "/contacts" },
  home: { label: "Головна", basePath: "/" },
};

function slugFromHref(href: string, basePath: string, fallback: string) {
  if (!href.startsWith(`${basePath}/`)) {
    return fallback;
  }

  return (
    href
      .slice(basePath.length + 1)
      .split("/")
      .filter(Boolean)
      .at(0) || fallback
  );
}

function publicHref(item: AdminContentItemSummary) {
  const meta = publicTypeMeta[item.type];

  if (
    item.href &&
    (/^\/(?!\/)[^\\\s]*$/.test(item.href) ||
      /^https:\/\/[^\s]+$/i.test(item.href))
  ) {
    return item.href;
  }

  if (item.type === "news" || item.type === "place" || item.type === "event") {
    return `${meta.basePath}/${item.id}`;
  }

  return meta.basePath;
}

function toPortalEntity(item: AdminContentItemSummary): PortalEntity {
  const meta = publicTypeMeta[item.type];
  const href = publicHref(item);
  const description =
    item.summary || item.notes || "Опублікований матеріал редакції порталу.";

  return {
    slug: slugFromHref(href, meta.basePath, item.id),
    title: item.title,
    description,
    href,
    meta:
      item.type === "event" && item.eventDate
        ? `${item.eventDate} · ${meta.label}`
        : meta.label,
    badge: "Опубліковано",
    category: item.eventCategory || item.placeCategory || item.type,
    content: item.notes || item.summary || item.title,
    date:
      item.type === "event" && item.eventDate
        ? item.eventDate
        : new Date(item.updatedAt).toISOString().slice(0, 10),
    endDate: item.eventEndDate,
    address: item.eventLocation || item.placeAddress,
    price: item.eventPrice,
    phone: item.placePhone,
    coordinates:
      item.placeLatitude &&
      item.placeLongitude &&
      Number.isFinite(Number(item.placeLatitude)) &&
      Number.isFinite(Number(item.placeLongitude))
        ? { lat: Number(item.placeLatitude), lng: Number(item.placeLongitude) }
        : undefined,
    sourceUrl: item.sourceUrl,
    sourceLabel: item.sourceUrl ? "Першоджерело" : undefined,
  };
}

export function mergePortalEntities(
  primaryItems: PortalEntity[],
  fallbackItems: PortalEntity[],
): PortalEntity[] {
  const primaryHrefs = new Set(primaryItems.map((item) => item.href));
  return [
    ...primaryItems,
    ...fallbackItems.filter((item) => !primaryHrefs.has(item.href)),
  ];
}

export async function getPublishedAdminPortalEntities(
  type?: AdminContentType,
  limit = 50,
): Promise<PortalEntity[]> {
  const items = await getPublishedAdminContentItems({ type, limit }).catch(
    (error) => {
      console.error("Failed to load published admin content", error);

      return [];
    },
  );

  return items.map(toPortalEntity);
}
