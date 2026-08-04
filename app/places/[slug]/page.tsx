import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/content/DetailPage";
import { ModulePage } from "@/components/content/ModulePage";
import { findPortalEntity, placeCategories, places } from "@/constants/content";
import { getPublishedAdminPortalEntities, mergePortalEntities } from "@/lib/public-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    ...placeCategories.map((item) => ({ slug: item.slug })),
    ...places.map((item) => ({ slug: item.slug })),
  ];
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = placeCategories.find((item) => item.slug === slug);
  const adminPlaceItems = await getPublishedAdminPortalEntities("place");
  const item = findPortalEntity(mergePortalEntities(adminPlaceItems, places), slug);

  return {
    title: category?.title || item?.title,
    description: category ? `Заклади категорії ${category.title} у Тернополі.` : item?.description,
  };
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const category = placeCategories.find((item) => item.slug === slug);
  const adminPlaceItems = await getPublishedAdminPortalEntities("place");
  const allPlaces = mergePortalEntities(adminPlaceItems, places);

  if (category) {
    return (
      <ModulePage
        eyebrow="Категорія закладів"
        title={category.title}
        description={`Заклади Тернополя у категорії "${category.title}" з фільтрами, картою, відгуками і заявками власників.`}
        items={allPlaces.filter((item) => item.category === category.slug)}
      />
    );
  }

  const item = findPortalEntity(allPlaces, slug);

  if (!item) {
    notFound();
  }

  return (
    <DetailPage item={item} backHref="/places" backLabel="До закладів" schemaType="LocalBusiness" />
  );
}
