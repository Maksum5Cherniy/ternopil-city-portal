import type { Metadata } from "next";
import { ModulePage } from "@/components/content/ModulePage";
import { events } from "@/constants/content";

export const metadata: Metadata = {
  title: "Події Тернополя",
  description: "Афіша Тернополя: концерти, фестивалі, виставки, майстер-класи та дитячі події.",
};

export default function EventsPage() {
  return (
    <ModulePage
      eyebrow="Події"
      title="Афіша Тернополя"
      description="Події з датами, місцями, організаторами, цінами та зручним переходом до деталей."
      items={events}
    />
  );
}
