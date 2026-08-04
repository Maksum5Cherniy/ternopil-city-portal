"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { AdminDashboardData, AdminUserSummary } from "@/lib/database-core";
import type { UserRole } from "@/types";

const roleOptions: Array<{ value: UserRole; label: string }> = [
  { value: "user", label: "user" },
  { value: "owner", label: "owner" },
  { value: "moderator", label: "moderator" },
  { value: "admin", label: "admin" },
];

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;

  return body?.error || fallback;
}

function statusVariant(status: string) {
  return status === "approved" || status === "active" ? "primary" : "warning";
}

export default function AdminConsole({ data }: { data: AdminDashboardData }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const updateUser = async (formData: FormData, user: AdminUserSummary) => {
    setMessage("");

    const roles = roleOptions
      .map((role) => role.value)
      .filter((role) => formData.get(`role-${user.id}-${role}`) === "on");
    const payload = {
      userId: user.id,
      roles: roles.length > 0 ? roles : ["user"],
      isBlocked: formData.get(`blocked-${user.id}`) === "on",
      blockedReason: String(formData.get(`blockedReason-${user.id}`) || ""),
      sellerStatus: String(formData.get(`sellerStatus-${user.id}`) || "active"),
    };

    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage(await readError(response, "Не вдалося оновити користувача."));
      return;
    }

    setMessage("Користувача оновлено.");
    router.refresh();
  };

  const moderateListing = async (
    listingId: string,
    moderationStatus: "approved" | "rejected" | "hidden" | "blocked",
  ) => {
    setMessage("");

    const response = await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, moderationStatus }),
    });

    if (!response.ok) {
      setMessage(await readError(response, "Не вдалося змінити статус оголошення."));
      return;
    }

    setMessage("Статус оголошення оновлено.");
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
      setMessage(await readError(response, "Не вдалося змінити статус заявки."));
      return;
    }

    setMessage("Заявку власника оновлено.");
    router.refresh();
  };

  return (
    <div className="mt-8 grid gap-6">
      {message ? (
        <p className="rounded-md border border-primary/30 bg-primary-soft px-3 py-2 text-sm text-primary-strong">
          {message}
        </p>
      ) : null}

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-xl font-semibold">Користувачі та ролі</h2>
        <div className="mt-4 grid gap-4">
          {data.users.map((user) => (
            <form
              key={user.id}
              action={(formData) => updateUser(formData, user)}
              className="rounded-md border border-border p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="font-semibold">{user.displayName}</h3>
                  <p className="text-sm text-muted">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={user.emailVerified ? "primary" : "warning"}>
                      {user.emailVerified ? "email ok" : "email pending"}
                    </Badge>
                    <Badge variant={user.isBlocked ? "warning" : "primary"}>
                      {user.isBlocked ? "blocked" : "active"}
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-3 sm:min-w-[420px]">
                  <div className="flex flex-wrap gap-3">
                    {roleOptions.map((role) => (
                      <label key={role.value} className="text-sm">
                        <input
                          type="checkbox"
                          name={`role-${user.id}-${role.value}`}
                          defaultChecked={user.roles.includes(role.value)}
                          className="mr-1 accent-primary"
                        />
                        {role.label}
                      </label>
                    ))}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
                    <select
                      name={`sellerStatus-${user.id}`}
                      defaultValue={user.sellerStatus}
                      className="min-h-10 rounded-md border border-border bg-surface px-3 text-sm"
                    >
                      <option value="active">seller active</option>
                      <option value="suspended">seller suspended</option>
                    </select>
                    <label className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-3 text-sm">
                      <input
                        type="checkbox"
                        name={`blocked-${user.id}`}
                        defaultChecked={user.isBlocked}
                        className="accent-primary"
                      />
                      Заблокований
                    </label>
                  </div>
                  <input
                    name={`blockedReason-${user.id}`}
                    defaultValue={user.blockedReason || ""}
                    placeholder="Причина блокування"
                    className="min-h-10 rounded-md border border-border bg-surface px-3 text-sm"
                  />
                  <button className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white">
                    Зберегти
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-xl font-semibold">Оголошення на модерації</h2>
          <div className="mt-4 grid gap-3">
            {data.listings.length > 0 ? (
              data.listings.map((listing) => (
                <div key={listing.id} className="rounded-md border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{listing.title}</h3>
                    <Badge variant={statusVariant(listing.moderationStatus)}>
                      {listing.moderationStatus}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {listing.authorName} · {listing.authorEmail}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => moderateListing(listing.id, "approved")}
                      className="min-h-10 rounded-md bg-primary px-3 text-sm font-semibold text-white"
                    >
                      Схвалити
                    </button>
                    <button
                      type="button"
                      onClick={() => moderateListing(listing.id, "rejected")}
                      className="min-h-10 rounded-md border border-accent bg-accent-soft px-3 text-sm font-semibold text-accent-strong"
                    >
                      Відхилити
                    </button>
                    <button
                      type="button"
                      onClick={() => moderateListing(listing.id, "hidden")}
                      className="min-h-10 rounded-md border border-border px-3 text-sm font-semibold"
                    >
                      Приховати
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">Оголошень немає.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-xl font-semibold">Заявки власників</h2>
          <div className="mt-4 grid gap-3">
            {data.ownerClaims.length > 0 ? (
              data.ownerClaims.map((claim) => (
                <div key={claim.id} className="rounded-md border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{claim.placeName}</h3>
                    <Badge variant={statusVariant(claim.status)}>{claim.status}</Badge>
                  </div>
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
              <p className="text-sm text-muted">Заявок немає.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-xl font-semibold">Журнал дій</h2>
        <div className="mt-4 grid gap-2">
          {data.auditLogs.length > 0 ? (
            data.auditLogs.map((log) => (
              <div key={log.id} className="rounded-md border border-border px-3 py-2 text-sm">
                <span className="font-semibold">{log.action}</span>{" "}
                <span className="text-muted">
                  {log.entityType}
                  {log.entityId ? `:${log.entityId}` : ""} ·{" "}
                  {new Date(log.createdAt).toLocaleString("uk-UA")}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">Журнал поки порожній.</p>
          )}
        </div>
      </section>
    </div>
  );
}
