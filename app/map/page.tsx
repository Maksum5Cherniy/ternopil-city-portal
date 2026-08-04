import type { Metadata } from "next";
import { MapPinned } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Карта Тернополя",
  description: "Карта Тернополя з майбутніми шарами закладів, локацій, подій і корисних точок.",
};

const mapLayers = ["Заклади", "Локації", "Події", "Аптеки", "Парковки", "Банкомати"];

export default function MapPage() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Badge variant="primary">Карта</Badge>
      <div className="mt-4 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">Карта Тернополя</h1>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
            Корисні точки міста з групуванням за розділами: заклади, локації, події, сервіси та
            маршрути для швидкої орієнтації.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {mapLayers.map((layer) => (
              <Badge key={layer}>{layer}</Badge>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="relative h-[420px] bg-[linear-gradient(90deg,var(--surface-subtle)_1px,transparent_1px),linear-gradient(var(--surface-subtle)_1px,transparent_1px)] bg-[size:38px_38px]">
            <div className="absolute left-[25%] top-[28%] grid h-10 w-10 place-items-center rounded-lg bg-primary text-white shadow-[var(--shadow)]">
              <MapPinned aria-hidden size={20} />
            </div>
            <div className="absolute left-[62%] top-[46%] grid h-10 w-10 place-items-center rounded-lg bg-accent text-[#0D1B3D] shadow-[var(--shadow)]">
              <MapPinned aria-hidden size={20} />
            </div>
            <div className="absolute bottom-5 left-5 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted shadow-[var(--shadow)]">
              Центр Тернополя
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
