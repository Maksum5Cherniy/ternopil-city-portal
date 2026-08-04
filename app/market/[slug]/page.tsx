import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/content/DetailPage";
import { ModulePage } from "@/components/content/ModulePage";
import { findPortalEntity, listingCategories, listings } from "@/constants/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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

  if (!item) {
    notFound();
  }

  return (
    <DetailPage item={item} backHref="/market" backLabel="До барахолки" schemaType="Product" />
  );
}
