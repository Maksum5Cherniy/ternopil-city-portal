import type { PortalEntity } from "@/constants/content";

export type EventFilters = {
  query: string;
  category: string;
  onDate: string;
  freeOnly: boolean;
};

export function filterEvents(items: PortalEntity[], filters: EventFilters) {
  const term = filters.query.trim().toLocaleLowerCase("uk-UA");
  return items.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category)
      return false;
    if (
      filters.onDate &&
      !(
        item.date &&
        item.date <= filters.onDate &&
        (item.endDate || item.date) >= filters.onDate
      )
    )
      return false;
    if (
      filters.freeOnly &&
      !/безкоштовно|вхід вільний|вільний вхід/i.test(item.price || "")
    )
      return false;
    return (
      !term ||
      [item.title, item.description, item.address].some((part) =>
        part?.toLocaleLowerCase("uk-UA").includes(term),
      )
    );
  });
}
