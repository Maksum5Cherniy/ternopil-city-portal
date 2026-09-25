Warning: truncated output (original token count: 14800)
Total output lines: 1671

"use client";

import {
  Archive,
  Ban,
  Check,
  EyeOff,
  MessageSquare,
  RotateCcw,
  Save,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { eventCategories, placeCategories } from "@/constants/content";
import type {
  AdminContentStatus,
  AdminContentType,
  AdminDashboardData,
  AdminUserSummary,
  SiteSettingSummary,
} from "@/lib/database-core";
import type { UserRole } from "@/types";

const roleOptions: Array<{
  value: UserRole;
  label: string;
  description: string;
}> = [
  {
    value: "user",
    label: "user",
    description: "Базовий профіль, оголошення після email.",
  },
  {
    value: "owner",
    label: "owner",
    description: "Кабінет власника закладу і заявки.",
  },
  {
    value: "moderator",
    label: "moderator",
    description: "Модерація оголошень, скарг і заявок.",
  },
  {
    value: "admin",
    label: "admin",
    description: "Повний доступ до адмін-панелі.",
  },
];

const contentLabels: Record<
  AdminContentType,
  {
    title: string;
    createTitle: string;
    description: string;
    hrefPlaceholder: string;
  }
> = {
  news: {
    title: "Новини",
    createTitle: "Створити новину",
    description: "Чернетки, публікації, категорії та редакційні нотатки.",
    hrefPlaceholder: "/news/slug або зовнішнє посилання",
  },
  place: {
    title: "Заклади",
    createTitle: "Додати заклад",
    description: "Каталог закладів, заявки власників і зміни в картках.",
    hrefPlaceholder: "/places/slug або сайт закладу",
  },
  event: {
    title: "Події",
    createTitle: "Додати подію",
    description:
      "Дата, місце, ціна та джерело анонсу. Минулі події автоматично переходять до архіву.",
    hrefPlaceholder: "/events/slug або залиште порожнім",
  },
  ad: {
    title: "Реклама",
    createTitle: "Додати банер",
    description: "Банери, промо-блоки, посилання і порядок показу.",
    hrefPlaceholder: "https://... або внутрішній маршрут",
  },
  home: {
    title: "Головна",
    createTitle: "Додати секцію",
    description: "Порядок секцій, добірки та блоки головної сторінки.",
    hrefPlaceholder: "/news, /market, /places...",
  },
};

const statusOptions: Array<{ value: AdminContentStatus; label: string }> = [
  { value: "draft", label: "Чернетка" },
  { value: "published", label: "Опубліковано" },
  { value: "archived", label: "Архів" },
];

const settingLabels: Record<
  string,
  { label: string; hint: string; multiline?: boolean }
> = {
  site_title: {
    label: "Назва сайту",
    hint: "Використовується в SEO та службових листах.",
  },
  site_description: {
    label: "Опис сайту",
    hint: "Короткий SEO-опис порталу.",
    multiline: true,
  },
  contact_telegram: {
    label: "Контактний Telegram",
    hint: "Основний публічний канал для реклами, партнерства і підтримки.",
  },
  seo_keywords: {
    label: "SEO ключові слова",
    hint: "Список через кому.",
    multiline: true,
  },
  homepage_notice: {
    label: "Оголошення на головній",
    hint: "Службовий текст або промо-оголошення.",
    multiline: true,
  },
};

const fieldClass =
  "min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15";
const panelClass = "rounded-md border border-border bg-surface-subtle p-4";

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
    message?: string;
  } | null;

  return body?.error || body?.message || fallback;
}

function statusVariant(status: string) {
  return status === "approved" || status === "active" || status === "published"
    ? "primary"
    : "warning";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("uk-UA");
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow)]"
    >
      <div className="flex flex-col gap-2 border-b border-border pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
        <a
          href="#admin-top"
          className="text-sm font-semibold text-primary underline"
        >
          До карток
        </a>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border bg-surface-subtle px-3 py-4 text-sm text-muted">
      {children}
    </p>
  );
}

export default function AdminConsole({ data }: { data: AdminDashboardData }) {
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const refreshWithMessage = (nextMessage: string) => {
    setMessage(nextMessage);
    window.location.reload();
  };

  const updateUser = async (formData: FormData, user: AdminUserSummary) => {
    setMessage("");
    setIsBusy(true);

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

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося оновити користувача."),
        );
      }

      refreshWithMessage("Користувача оновлено.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося оновити користувача.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const moderateListing = async (
    listingId: string,
    moderationStatus: "approved" | "rejected" | "hidden" | "blocked",
  ) => {
    setMessage("");
    setIsBusy(true);

    try {
      const response = await fetch("/api/admin/listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, moderationStatus }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося змінити статус оголошення."),
        );
      }

      refreshWithMessage("Статус оголошення оновлено.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося змінити статус оголошення.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const moderateClaim = async (
    claimId: string,
    status: "approved" | "rejected",
  ) => {
    setMessage("");
    setIsBusy(true);

    try {
      const response = await fetch("/api/admin/owner-claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, status }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося змінити статус заявки."),
        );
      }

      refreshWithMessage("Заявку власника оновлено.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося змінити статус заявки.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const moderateReport = async (
    reportId: string,
    status: "reviewed" | "dismissed" | "blocked",
  ) => {
    setMessage("");
    setIsBusy(true);

    try {
      const response = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося змінити статус скарги."),
        );
      }

      refreshWithMessage("Скаргу оновлено.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося змінити статус скарги.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const moderateReview = async (
    reviewId: string,
    status: "approved" | "rejected" | "hidden" | "blocked",
  ) => {
    setMessage("");
    setIsBusy(true);

    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося змінити статус відгуку."),
        );
      }

      refreshWithMessage("Відгук оновлено.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося змінити статус відгуку.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const saveContent = async (
    formData: FormData,
    type: AdminContentType,
    id?: string,
  ) => {
    setMessage("");
    setIsBusy(true);

    const payload = {
      id,
      type,
      title: String(formData.get(`${type}-title-${id || "new"}`) || ""),
      summary: String(formData.get(`${type}-summary-${id || "new"}`) || ""),
      href: String(formData.get(`${type}-href-${id || "new"}`) || ""),
      status: String(formData.get(`${type}-status-${id || "new"}`) || "draft"),
      orderIndex: Number(formData.get(`${type}-order-${id || "new"}`) || 0),
      notes: String(formData.get(`${type}-notes-${id || "new"}`) || ""),
      ...(type === "event"
        ? {
            eventDate: String(
              formData.get(`${type}-date-${id || "new"}`) || "",
            ),
            eventEndDate: String(
              formData.get(`${type}-end-date-${id || "new"}`) || "",
            ),
            eventLocation: String(
              formData.get(`${type}-location-${id || "new"}`) || "",
            ),
            eventPrice: String(
              formData.get(`${type}-price-${id || "new"}`) || "",
            ),
            sourceUrl: String(
              formData.get(`${type}-source-${id || "new"}`) || "",
            ),
            eventCategory: String(
              formData.get(`${type}-category-${id || "new"}`) || "festivals",
            ),
          }
        : {}),
      ...(type === "place"
        ? {
            placeCategory: String(
              formData.get(`place-category-${id || "new"}`) || "restaurants",
            ),
            placeAddress: String(
              formData.get(`place-address-${id || "new"}`) || "",
            ),
            placePhone: String(
              formData.get(`place-phone-${id || "new"}`) || "",
            ),
            placeLatitude: String(
              formData.get(`place-lat-${id || "new"}`) || "",
            ),
            placeLongitude: String(
              formData.get(`place-lng-${id || "new"}`) || "",
            ),
            sourceUrl: String(
              formData.get(`place-source-${id || "new"}`) || "",
            ),
          }
        : {}),
      ...(type === "news"
        ? {
            sourceUrl: String(formData.get(`news-source-${id || "new"}`) || ""),
          }
        : {}),
    };

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося зберегти запис."),
        );
      }

      refreshWithMessage(id ? "Запис оновлено." : "Запис створено.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Не вдалося зберегти запис.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const updateContentStatus = async (
    id: string,
    status: AdminContentStatus,
  ) => {
    setMessage("");
    setIsBusy(true);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося змінити статус запису."),
        );
      }

      refreshWithMessage("Статус запису оновлено.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося змінити статус запису.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const deleteContent = async (id: string) => {
    if (!window.confirm("Видалити цей запис з адмінського контенту?")) {
      return;
    }

    setMessage("");
    setIsBusy(true);

    try {
      const response = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося видалити запис."),
        );
      }

      refreshWithMessage("Запис видалено.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Не вдалося видалити запис.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const saveSettings = async (formData: FormData) => {
    setMessage("");
    setIsBusy(true);

    const settings = data.settings.map((setting) => ({
      key: setting.key,
      value: String(formData.get(`setting-${setting.key}`) || ""),
    }));

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося зберегти налаштування."),
        );
      }

      refreshWithMessage("Налаштування збережено.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося зберегти налаштування.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const sendNotification = async (formData: FormData) => {
    setMessage("");
    setIsBusy(true);

    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: String(formData.get("notification-target") || "all"),
          title: String(formData.get("notification-title") || ""),
          body: String(formData.get("notification-body") || ""),
        }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося надіслати сповіщення."),
        );
      }

      const body = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      refreshWithMessage(body?.message || "Сповіщення надіслано.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося надіслати сповіщення.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!window.confirm("Видалити це сповіщення з історії?")) {
      return;
    }

    setMessage("");
    setIsBusy(true);

    try {
      const response = await fetch("/api/admin/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Не вдалося видалити сповіщення."),
        );
      }

      refreshWithMessage("Сповіщення видалено.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося видалити сповіщення.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const renderContentManager = (type: AdminContentType) => {
    const labels = contentLabels[type];
    const items = data.contentItems.filter((item) => item.type === type);

    return (
      <div className="grid gap-5">
        <form
          action={(formData) => saveContent(formData, type)}
          className="grid gap-3 rounded-md border border-border bg-surface-subtle p-4"
        >
          <h3 className="font-semibold">{labels.createTitle}</h3>
          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_120px_150px]">
            <input
              name={`${type}-title-new`}
              placeholder="Назва"
              className={fieldClass}
            />
            <input
              name={`${type}-href-new`}
              placeholder={labels.hrefPlaceholder}
              className={fieldClass}
            />
            <input
              name={`${type}-order-new`}
              type="number"
              min="0"
              defaultValue="0"
              aria-label="Порядок"
              className={fieldClass}
            />
            <select
              name={`${type}-status-new`}
              defaultValue="draft"
              className={fieldClass}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name={`${type}-summary-new`}
            placeholder="Короткий опис"
            rows={3}
            className={fieldClass}
          />
          {type ===…4800 tokens truncated…ize={15} />}
                  >
                    Зберегти
                  </Button>
                </div>
              </div>
            </form>
          ))}
        </div>
      </Section>

      <Section
        id="admin-roles"
        title="Ролі"
        description="Що дозволяє кожна роль і кому вона видана."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {roleOptions.map((role) => (
            <div key={role.value} className={panelClass}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{role.label}</h3>
                <Badge variant={role.value === "admin" ? "warning" : "primary"}>
                  {
                    data.users.filter((user) => user.roles.includes(role.value))
                      .length
                  }
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="admin-news"
        title={contentLabels.news.title}
        description={contentLabels.news.description}
      >
        {renderContentManager("news")}
      </Section>

      <Section
        id="admin-events"
        title={contentLabels.event.title}
        description={contentLabels.event.description}
      >
        {renderContentManager("event")}
      </Section>

      <Section
        id="admin-places"
        title={contentLabels.place.title}
        description={contentLabels.place.description}
      >
        <div className="grid gap-6">
          {renderContentManager("place")}
          <div>
            <h3 className="font-semibold">Заявки власників</h3>
            <div className="mt-3 grid gap-3">
              {data.ownerClaims.length > 0 ? (
                data.ownerClaims.map((claim) => (
                  <div key={claim.id} className={panelClass}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold">{claim.placeName}</h4>
                      <Badge variant={statusVariant(claim.status)}>
                        {claim.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {claim.phone || claim.businessEmail || claim.address}
                    </p>
                    {claim.message ? (
                      <p className="mt-2 text-sm leading-6">{claim.message}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => moderateClaim(claim.id, "approved")}
                        disabled={isBusy}
                        leftIcon={<Check aria-hidden size={15} />}
                      >
                        Схвалити
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => moderateClaim(claim.id, "rejected")}
                        disabled={isBusy}
                        leftIcon={<X aria-hidden size={15} />}
                      >
                        Відхилити
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState>Заявок власників немає.</EmptyState>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="admin-moderation"
        title="Модерація"
        description="Оголошення з барахолки, відгуки, рішення модератора і публічний статус."
      >
        <div className="grid gap-5">
          <div>
            <h3 className="flex items-center gap-2 font-semibold">
              <MessageSquare aria-hidden size={18} className="text-primary" />
              Оголошення
            </h3>
            <div className="mt-3 grid gap-3">
              {data.listings.length > 0 ? (
                data.listings.map((listing) => (
                  <div key={listing.id} className={panelClass}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold">{listing.title}</h4>
                      <Badge variant={statusVariant(listing.moderationStatus)}>
                        {listing.moderationStatus}
                      </Badge>
                      <Badge>{listing.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {listing.authorName} · {listing.authorEmail} ·{" "}
                      {formatDate(listing.createdAt)}
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {listing.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => moderateListing(listing.id, "approved")}
                        disabled={isBusy}
                        leftIcon={<Check aria-hidden size={15} />}
                      >
                        Схвалити
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => moderateListing(listing.id, "rejected")}
                        disabled={isBusy}
                        leftIcon={<X aria-hidden size={15} />}
                      >
                        Відхилити
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="subtle"
                        onClick={() => moderateListing(listing.id, "hidden")}
                        disabled={isBusy}
                        leftIcon={<EyeOff aria-hidden size={15} />}
                      >
                        Приховати
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="accent"
                        onClick={() => moderateListing(listing.id, "blocked")}
                        disabled={isBusy}
                        leftIcon={<Ban aria-hidden size={15} />}
                      >
                        Заблокувати
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState>Оголошень немає.</EmptyState>
              )}
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 font-semibold">
              <Star aria-hidden size={18} className="text-accent-strong" />
              Відгуки
            </h3>
            <div className="mt-3 grid gap-3">
              {data.reviews.length > 0 ? (
                data.reviews.map((review) => (
                  <div key={review.id} className={panelClass}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold">{review.targetTitle}</h4>
                      <Badge variant={statusVariant(review.status)}>
                        {review.status}
                      </Badge>
                      <Badge>{review.rating} / 5</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {review.userName || "Користувач"} ·{" "}
                      {review.userEmail || "email приховано"} ·{" "}
                      {formatDate(review.createdAt)}
                    </p>
                    <p className="mt-2 text-sm leading-6">{review.text}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => moderateReview(review.id, "approved")}
                        disabled={isBusy}
                        leftIcon={<Check aria-hidden size={15} />}
                      >
                        Схвалити
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => moderateReview(review.id, "rejected")}
                        disabled={isBusy}
                        leftIcon={<X aria-hidden size={15} />}
                      >
                        Відхилити
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="subtle"
                        onClick={() => moderateReview(review.id, "hidden")}
                        disabled={isBusy}
                        leftIcon={<EyeOff aria-hidden size={15} />}
                      >
                        Приховати
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="accent"
                        onClick={() => moderateReview(review.id, "blocked")}
                        disabled={isBusy}
                        leftIcon={<Ban aria-hidden size={15} />}
                      >
                        Заблокувати
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState>Відгуків немає.</EmptyState>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="admin-reports"
        title="Скарги"
        description="Розгляд порушень і блокування контенту."
      >
        <div className="grid gap-3">
          {data.reports.length > 0 ? (
            data.reports.map((report) => (
              <div key={report.id} className={panelClass}>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">
                    {report.entityTitle || report.entityId}
                  </h3>
                  <Badge
                    variant={
                      report.status === "pending" ? "warning" : "primary"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs font-semibold text-primary">
                  {report.entityType}
                  {report.reporterEmail ? ` · ${report.reporterEmail}` : ""}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {report.reason}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => moderateReport(report.id, "reviewed")}
                    disabled={isBusy}
                    leftIcon={<Check aria-hidden size={15} />}
                  >
                    Опрацьовано
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => moderateReport(report.id, "dismissed")}
                    disabled={isBusy}
                    leftIcon={<X aria-hidden size={15} />}
                  >
                    Відхилити
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="accent"
                    onClick={() => moderateReport(report.id, "blocked")}
                    disabled={isBusy}
                    leftIcon={<Ban aria-hidden size={15} />}
                  >
                    Заблокувати
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState>Скарг немає.</EmptyState>
          )}
        </div>
      </Section>

      <Section
        id="admin-ads"
        title={contentLabels.ad.title}
        description={contentLabels.ad.description}
      >
        {renderContentManager("ad")}
      </Section>

      <Section
        id="admin-home"
        title={contentLabels.home.title}
        description={contentLabels.home.description}
      >
        {renderContentManager("home")}
      </Section>

      <Section
        id="admin-notifications"
        title="Сповіщення"
        description="Системні повідомлення для користувачів, власників, модераторів або адмінів."
      >
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <form action={sendNotification} className="grid gap-3">
            <select
              name="notification-target"
              defaultValue="all"
              className={fieldClass}
            >
              <option value="all">Усім профілям</option>
              <option value="users">Підтвердженим користувачам</option>
              <option value="owners">Власникам</option>
              <option value="moderators">Модераторам</option>
              <option value="admins">Адмінам</option>
            </select>
            <input
              name="notification-title"
              placeholder="Заголовок"
              className={fieldClass}
            />
            <textarea
              name="notification-body"
              placeholder="Текст повідомлення"
              rows={5}
              className={fieldClass}
            />
            <Button
              type="submit"
              disabled={isBusy}
              leftIcon={<Send aria-hidden size={16} />}
            >
              Надіслати
            </Button>
          </form>
          <div className="grid gap-3">
            {data.notifications.length > 0 ? (
              data.notifications.map((notification) => (
                <div key={notification.id} className={`${panelClass} text-sm`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">
                          {notification.title}
                        </span>
                        <Badge>{notification.type}</Badge>
                      </div>
                      <p className="mt-1 text-muted">
                        {notification.userName} · {notification.userEmail} ·{" "}
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="subtle"
                      onClick={() => deleteNotification(notification.id)}
                      disabled={isBusy}
                      leftIcon={<Trash2 aria-hidden size={15} />}
                    >
                      Видалити
                    </Button>
                  </div>
                  <p className="mt-2 leading-6">{notification.body}</p>
                </div>
              ))
            ) : (
              <EmptyState>Системних сповіщень ще немає.</EmptyState>
            )}
          </div>
        </div>
      </Section>

      <Section
        id="admin-stats"
        title="Статистика"
        description="Операційні показники порталу і журнал дій."
      >
        <div className="grid gap-5">
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries({
              Користувачі: data.stats.users,
              "На модерації": data.stats.pendingListings,
              "Заявки власників": data.stats.ownerClaims,
              Скарги: data.stats.pendingReports,
              Відгуки: data.stats.pendingReviews,
              "Активні оголошення": data.stats.activeListings,
              Заблоковані: data.stats.blockedUsers,
              Контент: data.stats.contentItems,
              Сповіщення: data.stats.sentNotifications,
            }).map(([label, value]) => (
              <div key={label} className="bg-surface p-4">
                <div className="text-2xl font-semibold text-primary">
                  {value}
                </div>
                <div className="mt-1 text-sm text-muted">{label}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-2">
            {data.auditLogs.length > 0 ? (
              data.auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-md border border-border px-3 py-2 text-sm"
                >
                  <span className="font-semibold">{log.action}</span>{" "}
                  <span className="text-muted">
                    {log.entityType}
                    {log.entityId ? `:${log.entityId}` : ""} ·{" "}
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState>Журнал поки порожній.</EmptyState>
            )}
          </div>
        </div>
      </Section>

      <Section
        id="admin-settings"
        title="Налаштування"
        description="SEO, бренд, контактні дані та службовий текст головної."
      >
        <form action={saveSettings} className="grid gap-4">
          {data.settings.map((setting: SiteSettingSummary) => {
            const meta = settingLabels[setting.key] || {
              label: setting.key,
              hint: "",
            };

            return (
              <label key={setting.key} className="grid gap-2">
                <span className="text-sm font-semibold">{meta.label}</span>
                {meta.multiline ? (
                  <textarea
                    name={`setting-${setting.key}`}
                    defaultValue={setting.value}
                    rows={3}
                    className={fieldClass}
                  />
                ) : (
                  <input
                    name={`setting-${setting.key}`}
                    defaultValue={setting.value}
                    className={fieldClass}
                  />
                )}
                {meta.hint ? (
                  <span className="text-xs text-muted">{meta.hint}</span>
                ) : null}
              </label>
            );
          })}
          <Button
            type="submit"
            disabled={isBusy}
            leftIcon={<Save aria-hidden size={16} />}
          >
            Зберегти налаштування
          </Button>
        </form>
      </Section>
    </div>
  );
}
