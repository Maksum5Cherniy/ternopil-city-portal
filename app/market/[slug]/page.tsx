import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/content/DetailPage";
import { ModulePage } from "@/components/content/ModulePage";
import ReportListingForm from "@/components/market/ReportListingForm";
import {
  findPortalEntity,
  listingCategories,
  listings,
  type PortalEntity,
} from "@/constants/content";
import { getPublicListingBySlug, type PublicListingDetail } from "@/lib/database";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatListingPrice(price: number, currency: string) {
  const formatted = Number(price).toLocaleString("uk-UA");

  if (currency === "UAH") {
    return `${formatted} грн`;
  }

  return `${formatted} ${currency}`;
}

function databaseListingToPortalEntity(item: PublicListingDetail): PortalEntity {
  const categoryTitle =
    listingCategories.find((category) => category.slug === item.categoryId)?.title ||
    item.categoryId;
  const contacts = [
    item.phone ? `Телефон: ${item.phone}` : "",
    item.telegram ? `Telegram: ${item.telegram}` : "",
    item.instagram ? `Instagram: ${item.instagram}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    href: item.publicHref,
    meta: item.district || "Тернопіль",
    badge: categoryTitle,
    category: item.categoryId,
    price: formatListingPrice(item.price, item.currency),
    status: item.status,
    content: contacts
      ? `${item.description}\n\nПродавець: ${item.authorName}. Контакти: ${contacts}.`
      : `${item.description}\n\nПродавець: ${item.authorName}.`,
  };
}

export function generateStaticParams() {
  return [
    ...listingCategories.map((item) => ({ slug: item.slug })),
    ...listings.map((item) => ({ slug: item.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = listingCategories.find((item) => item.slug === slug);
  const item = findPortalEntity(listings, slug);

  if (category || item) {
    return {
      title: category?.title || item?.title,
      description: category
        ? `Оголошення категорії ${category.title} у Тернополі.`
        : item?.description,
      robots:
        item?.status === "sold" || item?.status === "archived"
          ? { index: false, follow: true }
          : undefined,
    };
  }

  const databaseItem = await getPublicListingBySlug(slug);

  return {
    title: databaseItem?.title,
    description: databaseItem?.description,
    robots:
      databaseItem?.status === "sold" || databaseItem?.status === "archived"
        ? { index: false, follow: true }
        : undefined,
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const category = listingCategories.find((item) => item.slug === slug);

  if (category) {
    return (
      <ModulePage
        eyebrow="Категорія барахолки"
        title={category.title}
        description={`Оголошення Тернополя у категорії "${category.title}" з фільтрами за ціною, станом і районом.`}
        items={listings.filter((item) => item.category === category.slug)}
      />
    );
  }

  const item = findPortalEntity(listings, slug);

  if (item) {
    return (
      <DetailPage item={item} backHref="/market" backLabel="До барахолки" schemaType="Product" />
    );
  }

  const databaseItem = await getPublicListingBySlug(slug);

  if (databaseItem) {
    return (
      <DetailPage
        item={databaseListingToPortalEntity(databaseItem)}
        backHref="/market"
        backLabel="До барахолки"
        schemaType="Product"
      >
        <ReportListingForm listingId={databaseItem.id} listingTitle={databaseItem.title} />
      </DetailPage>
    );
  }

  notFound();
}
