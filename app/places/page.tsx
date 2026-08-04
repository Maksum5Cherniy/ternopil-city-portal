import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { places } from "@/constants/content";

export const metadata: Metadata = {
  title: "Заклади Тернополя",
  description: "Каталог закладів Тернополя з рейтингами, фільтрами, картою та кабінетом власника.",
};

export default function PlacesPage() {
  return (
    <ModulePage
      eyebrow="Заклади"
      title="Заклади Тернополя"
      description="Каталог кафе, ресторанів, сервісів, магазинів і міських бізнесів з рейтингами, контактами, фото та корисною інформацією."
      items={places}
    />
  );
}
