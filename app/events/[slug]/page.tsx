import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/content/DetailPage";
import { events, findPortalEntity } from "@/constants/content";
import {
  getPublishedAdminPortalEntities,
  mergePortalEntities,
} from "@/lib/public-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return events.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const adminEvents = await getPublishedAdminPortalEntities("event");
  const item = findPortalEntity(mergePortalEntities(adminEvents, events), slug);

  return {
    title: item?.title,
    description: item?.description,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const adminEvents = await getPublishedAdminPortalEntities("event");
  const item = findPortalEntity(mergePortalEntities(adminEvents, events), slug);

  if (!item) {
    notFound();
  }

  return (
    <DetailPage
      item={item}
      backHref="/events"
      backLabel="До подій"
      schemaType="Event"
    />
  );
}
