import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/content/DetailPage";
import { ModulePage } from "@/components/content/ModulePage";
import ReviewForm from "@/components/content/ReviewForm";
import { findPortalEntity, placeCategories, places } from "@/constants/content";
import { getPublicReviews } from "@/lib/database";
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

  const reviews = await getPublicReviews(item.href);

  return (
    <DetailPage item={item} backHref="/places" backLabel="До закладів" schemaType="LocalBusiness">
      <ReviewForm targetHref={item.href} targetTitle={item.title} />

      <section className="mt-6 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold">Відгуки</h2>
        <div className="mt-4 grid gap-3">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <article key={review.id} className="rounded-md border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold">{review.userName || "Користувач"}</h3>
                  <span className="text-sm font-semibold text-accent-strong">
                    {review.rating} / 5
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{review.text}</p>
                {review.ownerReply ? (
                  <p className="mt-3 rounded-md bg-surface-subtle px-3 py-2 text-sm leading-6">
                    {review.ownerReply}
                  </p>
                ) : null}
              </article>
            ))
          ) : (
            <p className="rounded-md border border-dashed border-border bg-surface-subtle px-3 py-4 text-sm text-muted">
              Схвалених відгуків ще немає.
            </p>
          )}
        </div>
      </section>
    </DetailPage>
  );
}
