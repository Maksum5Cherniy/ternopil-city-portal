import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/content/DetailPage";
import { findPortalEntity, locations } from "@/constants/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return locations.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = findPortalEntity(locations, slug);

  return {
    title: item?.title,
    description: item?.description,
  };
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = findPortalEntity(locations, slug);

  if (!item) {
    notFound();
  }

  return <DetailPage item={item} backHref="/locations" backLabel="До локацій" schemaType="Place" />;
}
