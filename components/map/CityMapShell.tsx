"use client";

import dynamic from "next/dynamic";
import type { CityMapPoint } from "@/lib/map-points";

const CityMapClient = dynamic(() => import("@/components/map/CityMapClient"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[560px] place-items-center rounded-lg border border-border bg-surface-subtle text-sm font-semibold text-muted">
      Завантаження карти...
    </div>
  ),
});

export default function CityMapShell({
  points,
  tileServer,
}: {
  points: CityMapPoint[];
  tileServer: string;
}) {
  return <CityMapClient points={points} tileServer={tileServer} />;
}
