import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { listings } from "@/constants/content";

export const metadata: Metadata = {
  title: "Барахолка Тернополя",
  description:
    "Міська барахолка Тернополя з оголошеннями, модерацією, скаргами та статусом продано.",
};

export default function MarketPage() {
  return (
    <ModulePage
      eyebrow="Барахолка"
      title="Оголошення Тернополя"
      description="Міський маркетплейс без внутрішнього чату: контакти телефоном, Telegram або Instagram, прозорі статуси та модерація."
      items={listings}
    />
  );
}
