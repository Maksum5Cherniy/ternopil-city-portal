"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, CircleSlash, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { getModerationDashboard } from "@/lib/database-core";

type ModerationData = Awaited<ReturnType<typeof getModerationDashboard>>;

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;

  return body?.error || fallback;
}

export default function ModerationConsole({ data }: { data: ModerationData }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const moderateListing = async (
    listingId: string,
    moderationStatus: "approved" | "rejected" | "hidden",
  ) => {
    setMessage("");

    const response = await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, moderationStatus }),
    });

    if (!response.ok) {
      setMessage(await readError(response, "Не вдалося оновити оголошення."));
      return;
    }

    setMessage("Оголошення оновлено.");
    router.refresh();
  };

  const moderateClaim = async (claimId: string, status: "approved" | "rejected") => {
    setMessage("");

    const response = await fetch("/api/admin/owner-claims", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimId, status }),
    });

    if (!response.ok) {
      setMessage(await readError(response, "Не вдалося оновити заявку."));
      return;
    }

    setMessage("Заявку оновлено.");
    router.refresh();
  };

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      {message ? (
        <p className="rounded-md border border-primary/30 bg-primary-soft px-3 py-2 text-sm text-primary-strong lg:col-span-2">
          {message}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border p-4">
          <h2 className="text-xl font-semibold">Оголошення</h2>
        </div>
        {data.listings.length > 0 ? (
          data.listings.map((item) => (
            <div key={item.id} className="border-b border-border p-4 last:border-b-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-semibold text-primary">Оголошення</div>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {item.authorName} · {item.authorEmail}
                  </p>
                  <Badge variant="warning">{item.moderationStatus}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moderateListing(item.id, "approved")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary bg-primary px-3 text-sm font-semibold text-white"
                  >
                    <CheckCircle2 aria-hidden size={17} />
                    Схвалити
                  </button>
                  <button
                    type="button"
                    onClick={() => moderateListing(item.id, "rejected")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-accent bg-accent-soft px-3 text-sm font-semibold text-accent-strong"
                  >
                    <CircleSlash aria-hidden size={17} />
                    Відхилити
                  </button>
                  <button
                    type="button"
                    onClick={() => moderateListing(item.id, "hidden")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold"
                  >
                    <EyeOff aria-hidden size={17} />
                    Приховати
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted">Черга оголошень порожня.</p>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border p-4">
          <h2 className="text-xl font-semibold">Заявки власників</h2>
        </div>
        {data.ownerClaims.length > 0 ? (
          data.ownerClaims.map((claim) => (
            <div key={claim.id} className="border-b border-border p-4 last:border-b-0">
              <h3 className="font-semibold">{claim.placeName}</h3>
              <p className="mt-1 text-sm text-muted">{claim.phone || claim.businessEmail}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moderateClaim(claim.id, "approved")}
                  className="min-h-10 rounded-md bg-primary px-3 text-sm font-semibold text-white"
                >
                  Схвалити
                </button>
                <button
                  type="button"
                  onClick={() => moderateClaim(claim.id, "rejected")}
                  className="min-h-10 rounded-md border border-accent bg-accent-soft px-3 text-sm font-semibold text-accent-strong"
                >
                  Відхилити
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted">Заявок немає.</p>
        )}
      </div>
    </div>
  );
}
