import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { listings } from "@/constants/content";
import { getListingCardsFromDatabase } from "@/lib/database";

export const metadata: Metadata = {
  title: "Барахолка Тернополя",
  description:
    "Міська барахолка Тернополя з оголошеннями, модерацією, скаргами та статусом продано.",
};

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const databaseListings = await getListingCardsFromDatabase();
  const items = databaseListings.length > 0 ? databaseListings : listings;

  return (
    <ModulePage
      eyebrow="Барахолка"
      title="Оголошення Тернополя"
      description="Міський маркетплейс без внутрішнього чату: контакти телефоном, Telegram або Instagram, прозорі статуси та модерація."
      items={items}
    />
  );
}
