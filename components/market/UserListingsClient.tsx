"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive, ExternalLink, RefreshCcw, Trash2, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { UserListingSummary } from "@/lib/database-core";
import type { ListingStatus } from "@/types";

const statusLabels: Record<string, string> = {
  pending: "На модерації",
  active: "Опубліковано",
  rejected: "Відхилено",
  hidden: "Приховано",
  blocked: "Заблоковано",
  sold: "Продано",
  archived: "Архів",
  deleted: "Видалено",
};

const moderationLabels: Record<string, string> = {
  pending: "Очікує рішення",
  approved: "Схвалено",
  rejected: "Відхилено",
  hidden: "Приховано",
  blocked: "Заблоковано",
};

function statusVariant(status: string) {
  return status === "active" || status === "approved" ? "primary" : "warning";
}

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;

  return body?.error || fallback;
}

export default function UserListingsClient({ listings }: { listings: UserListingSummary[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const updateStatus = async (
    listingId: string,
    status: Extract<ListingStatus, "pending" | "sold" | "archived" | "deleted">,
  ) => {
    setMessage("");
    setPendingAction(`${listingId}:${status}`);

    try {
      const response = await fetch(`/api/listings/${listingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Не вдалося оновити оголошення."));
      }

      setMessage("Оголошення оновлено.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося оновити оголошення.");
    } finally {
      setPendingAction(null);
    }
  };

  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface-subtle p-8 text-center">
        <h2 className="text-xl font-semibold">Оголошень ще немає</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Після створення оголошення тут з’явиться його статус модерації та доступні дії.
        </p>
        <Link
          href="/market/new"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          Створити оголошення
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {message ? (
        <p className="rounded-md border border-primary/30 bg-primary-soft px-3 py-2 text-sm text-primary-strong">
          {message}
        </p>
      ) : null}

      {listings.map((listing) => {
        const isPublic = listing.status === "active" && listing.moderationStatus === "approved";
        const canArchive = listing.status === "active" || listing.status === "sold";
        const canMarkSold = listing.status === "active";
        const canResubmit =
          listing.status === "archived" ||
          listing.status === "rejected" ||
          listing.moderationStatus === "rejected";

        return (
          <article key={listing.id} className="rounded-lg border border-border bg-surface p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={statusVariant(listing.status)}>
                    {statusLabels[listing.status] || listing.status}
                  </Badge>
                  <Badge variant={statusVariant(listing.moderationStatus)}>
                    {moderationLabels[listing.moderationStatus] || listing.moderationStatus}
                  </Badge>
                  <span className="text-xs font-semibold text-muted">
                    {Number(listing.price).toLocaleString("uk-UA")} {listing.currency}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold">{listing.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{listing.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-muted">
                  <span>Категорія: {listing.categoryId}</span>
                  <span>Створено: {new Date(listing.createdAt).toLocaleDateString("uk-UA")}</span>
                  <span>Активне до: {new Date(listing.expiresAt).toLocaleDateString("uk-UA")}</span>
                </div>
                {listing.moderationComment ? (
                  <p className="mt-3 rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-accent-strong">
                    Причина модерації: {listing.moderationComment}
                  </p>
                ) : null}
              </div>

              <div className="flex min-w-fit flex-wrap gap-2 lg:justify-end">
                {isPublic ? (
                  <Link
                    href={listing.publicHref}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold"
                  >
                    <ExternalLink aria-hidden size={16} />
                    Відкрити
                  </Link>
                ) : null}
                {canMarkSold ? (
                  <button
                    type="button"
                    disabled={pendingAction === `${listing.id}:sold`}
                    onClick={() => updateStatus(listing.id, "sold")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <BadgeCheck aria-hidden size={16} />
                    Продано
                  </button>
                ) : null}
                {canArchive ? (
                  <button
                    type="button"
                    disabled={pendingAction === `${listing.id}:archived`}
                    onClick={() => updateStatus(listing.id, "archived")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold disabled:opacity-60"
                  >
                    <Archive aria-hidden size={16} />
                    Архів
                  </button>
                ) : null}
                {canResubmit ? (
                  <button
                    type="button"
                    disabled={pendingAction === `${listing.id}:pending`}
                    onClick={() => updateStatus(listing.id, "pending")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary bg-primary-soft px-3 text-sm font-semibold text-primary-strong disabled:opacity-60"
                  >
                    <RefreshCcw aria-hidden size={16} />
                    На модерацію
                  </button>
                ) : null}
                {listing.status !== "deleted" ? (
                  <button
                    type="button"
                    disabled={pendingAction === `${listing.id}:deleted`}
                    onClick={() => updateStatus(listing.id, "deleted")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-accent bg-accent-soft px-3 text-sm font-semibold text-accent-strong disabled:opacity-60"
                  >
                    <Trash2 aria-hidden size={16} />
                    Видалити
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
