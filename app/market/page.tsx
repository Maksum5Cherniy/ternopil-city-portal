import type { Metadata } from "next";
import { Package, ShieldCheck, SlidersHorizontal } from "lucide-react";
import MarketExplorer, { type MarketItem } from "@/components/market/MarketExplorer";
import { Badge } from "@/components/ui/Badge";
import { listingCategories, listings } from "@/constants/content";
import { getListingCardsFromDatabase } from "@/lib/database";

export const metadata: Metadata = {
  title: "Барахолка Тернополя",
  description:
    "Міська барахолка Тернополя з оголошеннями, фільтрами, модерацією, скаргами та статусом продано.",
};

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const databaseListings = (await getListingCardsFromDatabase()) as MarketItem[];
  const items = databaseListings.length > 0 ? databaseListings : (listings as MarketItem[]);
  const activeCount = items.filter((item) => (item.status || "active") === "active").length;

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <Badge variant="primary">Барахолка</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
            Оголошення Тернополя
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
            Локальні оголошення з модерацією, категоріями, статусами, ціною, районом і контактами
            продавця без внутрішнього чату.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "активних", value: activeCount, icon: Package },
            { label: "категорій", value: listingCategories.length, icon: SlidersHorizontal },
            { label: "модерація", value: "так", icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-lg border border-border bg-surface p-4">
                <Icon aria-hidden size={18} className="text-primary" />
                <div className="mt-3 text-2xl font-semibold">{item.value}</div>
                <div className="text-sm text-muted">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <MarketExplorer items={items} />
      </div>
    </section>
  );
}
