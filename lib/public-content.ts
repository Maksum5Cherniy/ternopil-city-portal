import "server-only";

import type { PortalEntity } from "@/constants/content";
import {
  getPublishedAdminContentItems,
  type AdminContentItemSummary,
  type AdminContentType,
} from "@/lib/database";

const publicTypeMeta: Record<AdminContentType, { label: string; basePath: string }> = {
  news: { label: "Новини", basePath: "/news" },
  place: { label: "Заклад", basePath: "/places" },
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

  if (item.href) {
    return item.href;
  }

  if (item.type === "news" || item.type === "place") {
    return `${meta.basePath}/${item.id}`;
  }

  return meta.basePath;
}

function toPortalEntity(item: AdminContentItemSummary): PortalEntity {
  const meta = publicTypeMeta[item.type];
  const href = publicHref(item);
  const description = item.summary || item.notes || "Опублікований матеріал редакції порталу.";

  return {
    slug: slugFromHref(href, meta.basePath, item.id),
    title: item.title,
    description,
    href,
    meta: meta.label,
    badge: "Опубліковано",
    category: item.type,
    content: item.notes || item.summary || item.title,
    date: new Date(item.updatedAt).toISOString().slice(0, 10),
  };
}

export function mergePortalEntities(
  primaryItems: PortalEntity[],
  fallbackItems: PortalEntity[],
): PortalEntity[] {
  return Array.from(
    new Map([...primaryItems, ...fallbackItems].map((item) => [item.href, item])).values(),
  );
}

export async function getPublishedAdminPortalEntities(
  type?: AdminContentType,
  limit = 50,
): Promise<PortalEntity[]> {
  const items = await getPublishedAdminContentItems({ type, limit }).catch((error) => {
    console.error("Failed to load published admin content", error);

    return [];
  });

  return items.map(toPortalEntity);
}
