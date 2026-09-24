import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { allSearchItems } from "@/constants/content";
import { uk } from "@/config/dictionaries/uk";
import { searchListingCardsFromDatabase } from "@/lib/database";
import { getPublishedAdminPortalEntities } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Пошук",
  description: "Глобальний пошук по новинах, закладах, локаціях, подіях та оголошеннях.",
};

const categories = ["Усі", "Новини", "Заклади", "Локації", "Події", "Барахолка"] as const;

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    type?: string | string[];
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = params?.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery || "")
    .trim()
    .slice(0, 120)
    .toLowerCase();
  const rawType = Array.isArray(params?.type) ? params.type[0] : params?.type;
  const selectedType = categories.find((category) => category === rawType) || "Усі";
  const adminItems = (await getPublishedAdminPortalEntities(undefined, 80)).map((item) => ({
    ...item,
    type:
      item.category === "news"
        ? "Новини"
        : item.category === "place"
          ? "Заклади"
          : item.category === "ad"
            ? "Реклама"
            : "Головна",
  }));
  const searchableItems = allSearchItems.filter((item) => item.type !== "Барахолка");
  const staticResults = query
    ? [...adminItems, ...searchableItems].filter((item) =>
        `${item.title} ${item.description} ${item.meta || ""}`.toLowerCase().includes(query),
      )
    : [...adminItems, ...searchableItems];
  const databaseListingItems = (await searchListingCardsFromDatabase(query).catch(() => [])).map(
    (item) => ({ ...item, type: "Барахолка" }),
  );
  const allResults = Array.from(
    new Map([...staticResults, ...databaseListingItems].map((item) => [item.href, item])).values(),
  );
  const results =
    selectedType === "Усі" ? allResults : allResults.filter((item) => item.type === selectedType);

  return (
    <section className="mx-auto w-full max-w-[920px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">{uk.common.search}</h1>
      <form action="/search" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="search-page-query" className="sr-only">
          {uk.common.search}
        </label>
        <div className="flex min-h-12 flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3">
          <Search aria-hidden size={18} className="text-muted" />
          <input
            id="search-page-query"
            name="q"
            type="search"
            maxLength={120}
            defaultValue={query}
            placeholder={uk.common.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
        </div>
        <label htmlFor="search-page-category" className="sr-only">
          Розділ
        </label>
        <select
          id="search-page-category"
          name="type"
          defaultValue={selectedType}
          className="min-h-12 rounded-md border border-border bg-surface px-3 text-sm text-foreground"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "Усі" ? "Усі розділи" : category}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white"
        >
          <Search aria-hidden size={18} />
          <span>{uk.common.submitSearch}</span>
        </button>
      </form>

      <p className="mt-7 text-sm text-muted" role="status">
        {results.length === 0
          ? "За цим запитом нічого не знайдено."
          : `Знайдено: ${results.length}`}
      </p>

      <div className="mt-4 grid gap-3">
        {results.map((item) => (
          <Link
            key={`${item.type}-${item.href}`}
            href={item.href}
            className="rounded-lg border border-border bg-surface p-4 transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div className="text-xs font-semibold text-primary">{item.type}</div>
            <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
