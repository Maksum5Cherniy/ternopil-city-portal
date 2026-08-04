import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Send,
  Star,
} from "lucide-react";
import FavoriteButton from "@/components/content/FavoriteButton";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import type { PortalEntity } from "@/constants/content";

function cleanHandle(value?: string) {
  return value?.trim().replace(/^@/, "");
}

export function DetailPage({
  item,
  backHref,
  backLabel,
  schemaType,
  children,
}: {
  item: PortalEntity;
  backHref: string;
  backLabel: string;
  schemaType: "Article" | "LocalBusiness" | "Event" | "Product" | "Place";
  children?: React.ReactNode;
}) {
  const telegramHandle = cleanHandle(item.telegram);
  const instagramHandle = cleanHandle(item.instagram);
  const routeHref = item.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates.lat},${item.coordinates.lng}`
    : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: item.title,
    description: item.description,
    url: item.href,
    ...(item.date ? { startDate: item.date } : {}),
    ...(item.address ? { address: item.address } : {}),
    ...(item.price ? { offers: { "@type": "Offer", price: item.price } } : {}),
  };

  return (
    <article className="mx-auto w-full max-w-[920px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-strong"
      >
        <ArrowLeft aria-hidden size={17} />
        <span>{backLabel}</span>
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="primary">{item.meta || item.category}</Badge>
        {item.status ? (
          <Badge variant={item.status === "sold" ? "accent" : "neutral"}>{item.status}</Badge>
        ) : null}
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-normal sm:text-5xl">{item.title}</h1>
      <p className="mt-5 text-lg leading-8 text-muted">{item.description}</p>

      <div className="mt-6 grid gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-muted sm:grid-cols-3">
        {item.date ? (
          <div className="flex items-center gap-2">
            <CalendarDays aria-hidden size={18} className="text-primary" />
            <span>{item.date}</span>
          </div>
        ) : null}
        {item.address ? (
          <div className="flex items-center gap-2">
            <MapPin aria-hidden size={18} className="text-primary" />
            <span>{item.address}</span>
          </div>
        ) : null}
        {typeof item.rating === "number" ? (
          <div className="flex items-center gap-2">
            <Star aria-hidden size={18} className="text-warning" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        ) : null}
        {item.price ? <div className="font-semibold text-foreground">{item.price}</div> : null}
        {item.condition ? (
          <div className="font-semibold text-foreground">{item.condition}</div>
        ) : null}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold">Опис</h2>
        <p className="mt-3 whitespace-pre-line text-base leading-8 text-muted">{item.content}</p>
      </div>

      <div className="mt-6 grid gap-4 rounded-lg border border-border bg-surface-subtle p-6 md:grid-cols-2">
        <div>
          <h2 className="font-semibold">Доступні дії</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Додати в обране, поскаржитися, перейти до маршруту або зв&apos;язатися через вказані
            контакти.
          </p>
          <div className="mt-4">
            <FavoriteButton
              item={{
                href: item.href,
                title: item.title,
                description: item.description,
                type: item.meta || item.category,
                meta: item.price || item.date || item.address,
                badge: item.badge,
              }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {routeHref ? (
              <LinkButton
                href={routeHref}
                variant="secondary"
                leftIcon={<Navigation aria-hidden size={17} />}
              >
                Маршрут
              </LinkButton>
            ) : null}
            {item.phone ? (
              <LinkButton
                href={`tel:${item.phone.replace(/\s+/g, "")}`}
                variant="secondary"
                leftIcon={<Phone aria-hidden size={17} />}
              >
                Подзвонити
              </LinkButton>
            ) : null}
            {telegramHandle ? (
              <LinkButton
                href={`https://t.me/${telegramHandle}`}
                variant="secondary"
                leftIcon={<Send aria-hidden size={17} />}
              >
                Telegram
              </LinkButton>
            ) : null}
            {instagramHandle ? (
              <LinkButton
                href={`https://www.instagram.com/${instagramHandle}/`}
                variant="secondary"
                leftIcon={<ExternalLink aria-hidden size={17} />}
              >
                Instagram
              </LinkButton>
            ) : null}
            {item.sourceUrl ? (
              <LinkButton
                href={item.sourceUrl}
                variant="subtle"
                leftIcon={<ExternalLink aria-hidden size={17} />}
              >
                {item.sourceLabel || "Джерело"}
              </LinkButton>
            ) : null}
          </div>
        </div>
        <div>
          <h2 className="font-semibold">Модерація</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Зміни й користувацький контент проходять перевірку перед публікацією.
          </p>
        </div>
      </div>

      {children}
    </article>
  );
}
