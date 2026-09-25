"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { eventCategories, type PortalEntity } from "@/constants/content";
import { filterEvents } from "@/lib/event-filters";

export default function EventExplorer({ items }: { items: PortalEntity[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [onDate, setOnDate] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = useMemo(() => {
    return filterEvents(items, { query, category, onDate, freeOnly });
  }, [items, query, category, onDate, freeOnly]);

  return (
    <div className="mt-8">
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 shadow-[var(--shadow)] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
        <label className="grid gap-1 text-sm font-semibold">
          Пошук події
          <span className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-3">
            <Search aria-hidden size={17} className="text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Назва або місце"
              className="min-w-0 flex-1 bg-transparent text-sm font-normal outline-none"
            />
          </span>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Категорія
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-11 rounded-md border border-border bg-background px-3 text-sm font-normal"
          >
            <option value="all">Усі категорії</option>
            {eventCategories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Дата
          <input
            value={onDate}
            onChange={(event) => setOnDate(event.target.value)}
            type="date"
            className="min-h-11 rounded-md border border-border bg-background px-3 text-sm font-normal"
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(event) => setFreeOnly(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Вхід вільний
        </label>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted" role="status">
          Знайдено подій: {filtered.length}
        </p>
        {query || category !== "all" || onDate || freeOnly ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setOnDate("");
              setFreeOnly(false);
            }}
            className="text-sm font-semibold text-primary underline"
          >
            Скинути фільтри
          </button>
        ) : null}
      </div>
      {filtered.length ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col rounded-lg border border-border bg-surface p-5 transition hover:border-primary hover:shadow-[var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">
                  {eventCategories.find((type) => type.slug === item.category)
                    ?.title || "Подія"}
                </Badge>
                {item.price ? (
                  <span className="text-xs font-semibold text-primary">
                    {item.price}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-4 text-lg font-semibold group-hover:text-primary">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {item.description}
              </p>
              <div className="mt-4 grid gap-1 text-xs font-semibold text-muted">
                <span className="flex items-center gap-1">
                  <CalendarDays aria-hidden size={15} />
                  {item.meta || item.date}
                </span>
                {item.address ? (
                  <span className="flex items-center gap-1">
                    <MapPin aria-hidden size={15} />
                    {item.address}
                  </span>
                ) : null}
              </div>
              <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-primary">
                Подробиці <ArrowRight aria-hidden size={16} />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-subtle p-8 text-center">
          <CalendarDays aria-hidden size={28} className="mx-auto text-muted" />
          <p className="mt-3 text-sm text-muted">
            {items.length
              ? "За вибраними умовами подій немає. Спробуйте іншу дату чи категорію."
              : "Зараз немає підтверджених майбутніх подій. Минулі анонси зібрано нижче."}
          </p>
        </div>
      )}
    </div>
  );
}
