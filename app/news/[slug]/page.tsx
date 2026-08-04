import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/content/DetailPage";
import { findPortalEntity, newsItems } from "@/constants/content";
import { getPublishedAdminPortalEntities, mergePortalEntities } from "@/lib/public-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const adminNewsItems = await getPublishedAdminPortalEntities("news");
  const item = findPortalEntity(mergePortalEntities(adminNewsItems, newsItems), slug);

  if (!item) {
    return {};
  }

  return {
    title: item.title,
    description: item.description,
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const adminNewsItems = await getPublishedAdminPortalEntities("news");
  const item = findPortalEntity(mergePortalEntities(adminNewsItems, newsItems), slug);

  if (!item) {
    notFound();
  }

  return <DetailPage item={item} backHref="/news" backLabel="До новин" schemaType="Article" />;
}
