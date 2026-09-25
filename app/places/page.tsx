import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { places } from "@/constants/content";
import {
  getPublishedAdminPortalEntities,
  mergePortalEntities,
} from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Заклади Тернополя",
  description:
    "Каталог закладів Тернополя з адресами, джерелами та картою міста.",
};

export const dynamic = "force-dynamic";

export default async function PlacesPage() {
  const adminPlaceItems = await getPublishedAdminPortalEntities("place");
  const items = mergePortalEntities(adminPlaceItems, places);

  return (
    <ModulePage
      eyebrow="Заклади"
      title="Заклади Тернополя"
      description="Перевірені заклади Тернополя з адресами, контактами й посиланнями на першоджерела. Дані закладів можуть змінюватися — уточнюйте їх перед візитом."
      items={items}
    />
  );
}
