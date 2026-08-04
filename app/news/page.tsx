import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { newsItems } from "@/constants/content";
import { getPublishedAdminPortalEntities, mergePortalEntities } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Новини Тернополя",
  description: "Останні новини, міські оновлення, добірки та важливі матеріали Тернополя.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const adminNewsItems = await getPublishedAdminPortalEntities("news");
  const items = mergePortalEntities(newsItems, adminNewsItems);

  return (
    <ModulePage
      eyebrow="Новини"
      title="Новини Тернополя"
      description="Редакційні матеріали, міські оновлення, добірки та популярні публікації про Тернопіль."
      items={items}
    />
  );
}
