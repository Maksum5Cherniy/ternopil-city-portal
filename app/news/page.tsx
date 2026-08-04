import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { newsItems } from "@/constants/content";

export const metadata: Metadata = {
  title: "Новини Тернополя",
  description: "Останні новини, міські оновлення, добірки та важливі матеріали Тернополя.",
};

export default function NewsPage() {
  return (
    <ModulePage
      eyebrow="Новини"
      title="Новини Тернополя"
      description="Редакційні матеріали, міські оновлення, добірки та популярні публікації про Тернопіль."
      items={newsItems}
    />
  );
}
