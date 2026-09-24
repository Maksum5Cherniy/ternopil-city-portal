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
  const items = mergePortalEntities(adminNewsItems, newsItems);

  return (
    <ModulePage
      eyebrow="Новини"
      title={adminNewsItems.length ? "Новини Тернополя" : "Архів новин"}
      description={
        adminNewsItems.length
          ? "Редакційні матеріали та міські оновлення Тернополя."
          : "Матеріали попередніх місяців. Перевіряйте дату публікації та першоджерело перед використанням інформації."
      }
      items={items}
    />
  );
}
