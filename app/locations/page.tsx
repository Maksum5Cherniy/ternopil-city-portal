import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { locations } from "@/constants/content";

export const metadata: Metadata = {
  title: "Локації Тернополя",
  description: "Парки, водойми, історичні місця, фотолокації та маршрути Тернополя.",
};

export default function LocationsPage() {
  return (
    <ModulePage
      eyebrow="Локації"
      title="Цікаві локації Тернополя"
      description="Міські місця для прогулянок, фото, відпочинку з дітьми та коротких маршрутів навколо центру і Тернопільського ставу."
      items={locations}
    />
  );
}
