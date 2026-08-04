"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, CircleSlash, EyeOff, Star } from "lucide-react";
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

  const moderateReport = async (reportId: string, status: "reviewed" | "dismissed" | "blocked") => {
    setMessage("");

    const response = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, status }),
    });

    if (!response.ok) {
      setMessage(await readError(response, "Не вдалося оновити скаргу."));
      return;
    }

    setMessage("Скаргу оновлено.");
    router.refresh();
  };

  const moderateReview = async (
    reviewId: string,
    status: "approved" | "rejected" | "hidden" | "blocked",
  ) => {
    setMessage("");

    const response = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, status }),
    });

    if (!response.ok) {
      setMessage(await readError(response, "Не вдалося оновити відгук."));
      return;
    }

    setMessage("Відгук оновлено.");
    router.refresh();
  };

  return (
    <div className="mt-8 grid gap-4 xl:grid-cols-2">
      {message ? (
        <p className="rounded-md border border-primary/30 bg-primary-soft px-3 py-2 text-sm text-primary-strong xl:col-span-2">
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
          <h2 className="text-xl font-semibold">Відгуки</h2>
        </div>
        {data.reviews.length > 0 ? (
          data.reviews.map((review) => (
            <div key={review.id} className="border-b border-border p-4 last:border-b-0">
              <div className="flex flex-wrap items-center gap-2">
                <Star aria-hidden size={17} className="text-accent-strong" />
                <h3 className="font-semibold">{review.targetTitle}</h3>
                <Badge variant="warning">{review.status}</Badge>
                <Badge>{review.rating} / 5</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                {review.userName || "Користувач"} · {review.userEmail || "email приховано"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{review.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moderateReview(review.id, "approved")}
                  className="min-h-10 rounded-md bg-primary px-3 text-sm font-semibold text-white"
                >
                  Схвалити
                </button>
                <button
                  type="button"
                  onClick={() => moderateReview(review.id, "rejected")}
                  className="min-h-10 rounded-md border border-accent bg-accent-soft px-3 text-sm font-semibold text-accent-strong"
                >
                  Відхилити
                </button>
                <button
                  type="button"
                  onClick={() => moderateReview(review.id, "hidden")}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold"
                >
                  <EyeOff aria-hidden size={17} />
                  Приховати
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted">Відгуків немає.</p>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border p-4">
          <h2 className="text-xl font-semibold">Скарги</h2>
        </div>
        {data.reports.length > 0 ? (
          data.reports.map((report) => (
            <div key={report.id} className="border-b border-border p-4 last:border-b-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{report.entityTitle || report.entityId}</h3>
                <Badge variant="warning">{report.status}</Badge>
              </div>
              <p className="mt-1 text-xs font-semibold text-primary">
                {report.entityType}
                {report.reporterEmail ? ` · ${report.reporterEmail}` : ""}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{report.reason}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moderateReport(report.id, "reviewed")}
                  className="min-h-10 rounded-md bg-primary px-3 text-sm font-semibold text-white"
                >
                  Опрацьовано
                </button>
                <button
                  type="button"
                  onClick={() => moderateReport(report.id, "dismissed")}
                  className="min-h-10 rounded-md border border-border px-3 text-sm font-semibold"
                >
                  Відхилити
                </button>
                <button
                  type="button"
                  onClick={() => moderateReport(report.id, "blocked")}
                  className="min-h-10 rounded-md border border-accent bg-accent-soft px-3 text-sm font-semibold text-accent-strong"
                >
                  Блок
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted">Скарг немає.</p>
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
