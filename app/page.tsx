import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPinned,
  Megaphone,
  Newspaper,
  Plus,
  Search,
  Send,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  latestNews,
  marketHighlights,
  popularLocations,
  popularPlaces,
  upcomingEvents,
} from "@/constants/content";
import { uk } from "@/config/dictionaries/uk";
import { SITE } from "@/config/site.config";
import { getPublishedAdminPortalEntities, mergePortalEntities } from "@/lib/public-content";
import type { HomeCard } from "@/types";

const quickLinks = [
  { href: "/news", label: uk.home.latestNews, icon: Newspaper },
  { href: "/places", label: uk.home.popularPlaces, icon: Store },
  { href: "/locations", label: "Локації", icon: MapPinned },
  { href: "/events", label: uk.home.upcomingEvents, icon: CalendarDays },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.title,
  url: SITE.url,
  inLanguage: SITE.language,
  description: SITE.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-xl font-semibold tracking-normal sm:text-2xl">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-strong"
      >
        <span>{uk.common.viewAll}</span>
        <ArrowRight aria-hidden size={16} />
      </Link>
    </div>
  );
}

function CompactCardList({ items }: { items: HomeCard[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group rounded-lg border border-border bg-surface p-4 transition hover:border-primary hover:shadow-[var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {item.badge ? <Badge variant="accent">{item.badge}</Badge> : null}
                {item.meta ? (
                  <span className="text-xs font-semibold text-muted">{item.meta}</span>
                ) : null}
              </div>
              <h3 className="mt-2 text-base font-semibold text-foreground group-hover:text-primary">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
            </div>
            <ArrowRight
              aria-hidden
              size={18}
              className="mt-1 shrink-0 text-muted transition group-hover:text-primary"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const [adminNewsItems, adminPlaceItems, adminHomeItems, adminAdItems] = await Promise.all([
    getPublishedAdminPortalEntities("news", 6),
    getPublishedAdminPortalEntities("place", 6),
    getPublishedAdminPortalEntities("home", 6),
    getPublishedAdminPortalEntities("ad", 6),
  ]);
  const homepageNews = mergePortalEntities(latestNews, adminNewsItems).slice(0, 3);
  const homepagePlaces = mergePortalEntities(popularPlaces, adminPlaceItems).slice(0, 3);
  const homepageBlocks = adminHomeItems.slice(0, 3);
  const homepageAds = adminAdItems.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate overflow-hidden border-b border-border">
        <Image
          src={SITE.assets.heroImage.src}
          alt={SITE.assets.heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(13_27_61/0.94),rgb(13_27_61/0.74)_46%,rgb(13_27_61/0.16))]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgb(13_27_61/0.32))]" />
        <div className="relative mx-auto grid min-h-[600px] w-full max-w-[1180px] content-end px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl pb-4 text-white">
            <Badge variant="warning" className="border-accent bg-accent text-[#0D1B3D]">
              {uk.home.eyebrow}
            </Badge>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
              {uk.home.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/88 sm:text-lg">
              {uk.home.description}
            </p>

            <form
              action="/search"
              className="mt-7 flex w-full max-w-2xl flex-col gap-3 rounded-lg border border-white/24 bg-white/14 p-2 backdrop-blur sm:flex-row"
            >
              <label htmlFor="home-search" className="sr-only">
                {uk.common.search}
              </label>
              <div className="flex min-h-12 flex-1 items-center gap-2 rounded-md bg-white px-3 text-[#0D1B3D]">
                <Search aria-hidden size={18} className="shrink-0 text-[#5d6680]" />
                <input
                  id="home-search"
                  name="q"
                  type="search"
                  placeholder={uk.common.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#0B1220] outline-none placeholder:text-[#5d6680]"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-[#0D1B3D] transition hover:bg-[#f1ae16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Search aria-hidden size={18} />
                <span>{uk.common.submitSearch}</span>
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/24 bg-white/12 px-3 text-sm font-semibold text-white transition hover:border-accent hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <Icon aria-hidden size={17} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <SectionHeader title={uk.home.latestNews} href="/news" />
            <CompactCardList items={homepageNews} />
          </div>

          <Card className="bg-surface-subtle shadow-none">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-info-soft text-info">
                <MapPinned aria-hidden size={22} />
              </span>
              <div>
                <h2 className="text-xl font-semibold">{uk.home.cityMap}</h2>
                <p className="text-sm text-muted">Заклади, події, сервіси і корисні точки.</p>
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative h-64 bg-[linear-gradient(90deg,var(--surface-subtle)_1px,transparent_1px),linear-gradient(var(--surface-subtle)_1px,transparent_1px)] bg-[size:34px_34px]">
                <div className="absolute left-[18%] top-[24%] h-3 w-3 rounded-md bg-accent ring-4 ring-accent-soft" />
                <div className="absolute left-[44%] top-[50%] h-3 w-3 rounded-md bg-info ring-4 ring-info-soft" />
                <div className="absolute left-[70%] top-[35%] h-3 w-3 rounded-md bg-success ring-4 ring-success-soft" />
                <div className="absolute bottom-5 left-5 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted shadow-[var(--shadow)]">
                  49.5535, 25.5948
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <LinkButton
                href="/map"
                variant="primary"
                leftIcon={<MapPinned aria-hidden size={18} />}
              >
                {uk.common.route}
              </LinkButton>
              <LinkButton
                href="/places"
                variant="secondary"
                leftIcon={<Building2 aria-hidden size={18} />}
              >
                {uk.home.popularPlaces}
              </LinkButton>
            </div>
          </Card>
        </div>
      </section>

      {homepageBlocks.length > 0 ? (
        <section className="border-b border-border bg-surface py-10 sm:py-14">
          <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Вибране на головній" href="/search" />
            <CompactCardList items={homepageBlocks} />
          </div>
        </section>
      ) : null}

      <section className="border-y border-border bg-surface py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <SectionHeader title={uk.home.popularPlaces} href="/places" />
            <CompactCardList items={homepagePlaces} />
          </div>
          <div>
            <SectionHeader title="Локації" href="/locations" />
            <CompactCardList items={popularLocations} />
          </div>
          <div>
            <SectionHeader title={uk.home.upcomingEvents} href="/events" />
            <CompactCardList items={upcomingEvents} />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Card className="border-accent/50 bg-surface shadow-[var(--shadow)]">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-accent text-[#0D1B3D]">
                <Megaphone aria-hidden size={23} />
              </span>
              <div>
                <Badge variant="warning">Реклама</Badge>
                <h2 className="mt-3 text-2xl font-semibold">Реклама на Де Тернопіль</h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Розміщення закладів, банерів, промо-блоків, подій і локальних пропозицій для
                  аудиторії Тернополя.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Головна", "Заклади", "Барахолка", "Події"].map((label) => (
                    <Badge key={label}>{label}</Badge>
                  ))}
                </div>
                <LinkButton
                  href={SITE.contactTelegramUrl}
                  variant="accent"
                  className="mt-5"
                  leftIcon={<Send aria-hidden size={17} />}
                >
                  {SITE.contactTelegram}
                </LinkButton>
              </div>
            </div>
          </Card>

          <div>
            <SectionHeader title="Промо-блоки" href="/contacts" />
            {homepageAds.length > 0 ? (
              <CompactCardList items={homepageAds} />
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-surface-subtle p-6">
                <p className="text-sm leading-6 text-muted">
                  Місце для актуальних рекламних пропозицій, партнерських анонсів і промо-матеріалів
                  після публікації з адмінпанелі.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-background py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Card className="border-primary/30 bg-primary-soft shadow-none">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-info text-white">
                <Store aria-hidden size={22} />
              </span>
              <div>
                <h2 className="text-xl font-semibold">{uk.home.businessBlock.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {uk.home.businessBlock.description}
                </p>
              </div>
            </div>
            <LinkButton
              href="/places"
              variant="primary"
              className="mt-5"
              rightIcon={<ArrowRight aria-hidden size={17} />}
            >
              {uk.home.businessBlock.action}
            </LinkButton>
          </Card>

          <Card className="shadow-none">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent-strong">
                    <Megaphone aria-hidden size={22} />
                  </span>
                  <h2 className="text-xl font-semibold">{uk.home.marketHighlights}</h2>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                  {uk.home.listingBlock.description}
                </p>
              </div>
              <LinkButton href="/market" variant="accent" leftIcon={<Plus aria-hidden size={18} />}>
                {uk.common.addListing}
              </LinkButton>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {marketHighlights.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-border bg-surface-subtle p-4 transition hover:border-info focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <div className="text-xs font-semibold text-info">{item.meta}</div>
                  <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
