"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, PackageOpen, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { listingCategories } from "@/constants/content";
import { cn } from "@/lib/utils";
import type { HomeCard } from "@/types";

export type MarketItem = HomeCard & {
  category?: string;
  status?: string;
  condition?: string;
  price?: string;
};

const statusOptions = [
  { value: "active", label: "Активні" },
  { value: "all", label: "Усі" },
  { value: "sold", label: "Продані" },
  { value: "free", label: "Безкоштовно" },
];

function statusLabel(status?: string) {
  if (status === "sold") {
    return "Продано";
  }

  if (status === "pending") {
    return "Модерація";
  }

  if (status === "archived") {
    return "Архів";
  }

  return "Активне";
}

export default function MarketExplorer({ items }: { items: MarketItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("active");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const itemStatus = item.status || "active";
      const itemPrice = `${item.price || item.badge || item.meta || ""}`.toLowerCase();
      const matchesStatus =
        status === "all" ||
        (status === "active" && itemStatus === "active") ||
        (status === "sold" && itemStatus === "sold") ||
        (status === "free" && (item.category === "free" || itemPrice.includes("0 грн")));
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery =
        !normalizedQuery ||
        [item.title, item.description, item.meta, item.badge, item.category, item.condition]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesCategory && matchesQuery;
    });
  }, [category, items, query, status]);

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-border bg-surface p-4 shadow-[var(--shadow)]">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
            <Search aria-hidden size={17} className="text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Пошук товару, району або опису"
              className="min-h-11 flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-11 rounded-md border border-border bg-background px-3 text-sm font-semibold outline-none transition focus:border-primary"
            aria-label="Категорія оголошення"
          >
            <option value="all">Усі категорії</option>
            {listingCategories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>

          <LinkButton href="/market/new" variant="accent" leftIcon={<Plus aria-hidden size={17} />}>
            Додати
          </LinkButton>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition",
                status === option.value
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface-subtle text-foreground hover:border-primary hover:text-primary",
              )}
            >
              <SlidersHorizontal aria-hidden size={15} />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const categoryTitle =
              listingCategories.find((categoryItem) => categoryItem.slug === item.category)
                ?.title || item.category;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-[230px] flex-col rounded-lg border border-border bg-surface p-5 transition hover:border-primary hover:shadow-[var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {item.badge ? <Badge variant="accent">{item.badge}</Badge> : null}
                  <Badge variant={item.status === "sold" ? "warning" : "primary"}>
                    {statusLabel(item.status)}
                  </Badge>
                </div>
                <h2 className="mt-4 text-lg font-semibold group-hover:text-primary">
                  {item.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{item.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
                  {categoryTitle ? <span>{categoryTitle}</span> : null}
                  {item.meta ? <span>{item.meta}</span> : null}
                  {item.condition ? <span>{item.condition}</span> : null}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Відкрити
                  <ArrowRight aria-hidden size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-surface-subtle p-8 text-center">
          <PackageOpen aria-hidden size={30} className="mx-auto text-muted" />
          <p className="mt-3 text-sm text-muted">Оголошень за цими фільтрами немає.</p>
        </div>
      )}
    </div>
  );
}
