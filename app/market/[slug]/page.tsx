import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/content/DetailPage";
import { ModulePage } from "@/components/content/ModulePage";
import ReportListingForm from "@/components/market/ReportListingForm";
import { listingCategories, type PortalEntity } from "@/constants/content";
import {
  getListingCardsFromDatabase,
  getPublicListingBySlug,
  type PublicListingDetail,
} from "@/lib/database";
import type { HomeCard } from "@/types";

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

function formatCondition(condition: string) {
  const labels: Record<string, string> = {
    new: "Новий",
    likeNew: "Як новий",
    used: "Вживаний",
    needsRepair: "Потребує ремонту",
  };

  return labels[condition] || condition;
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
    condition: formatCondition(item.condition),
    phone: item.phone,
    telegram: item.telegram,
    instagram: item.instagram,
    contactPreference: item.preferredContact,
    content: contacts
      ? `${item.description}\n\nПродавець: ${item.authorName}. Стан: ${formatCondition(
          item.condition,
        )}. Контакти: ${contacts}.`
      : `${item.description}\n\nПродавець: ${item.authorName}. Стан: ${formatCondition(
          item.condition,
        )}.`,
  };
}

export function generateStaticParams() {
  return listingCategories.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = listingCategories.find((item) => item.slug === slug);

  if (category) {
    return {
      title: category.title,
      description: `Оголошення категорії ${category.title} у Тернополі.`,
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
    const categoryListings = (await getListingCardsFromDatabase(100).catch(() => [])) as Array<
      HomeCard & { category?: string }
    >;

    return (
      <ModulePage
        eyebrow="Категорія барахолки"
        title={category.title}
        description={`Оголошення Тернополя у категорії "${category.title}" з фільтрами за ціною, станом і районом.`}
        items={categoryListings.filter((item) => item.category === category.slug)}
      />
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
