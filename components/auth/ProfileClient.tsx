"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Heart, MessageSquare, PackageCheck, Settings, Store, UserRound } from "lucide-react";
import { uk } from "@/config/dictionaries/uk";
import { profileSchema, type ProfileInput } from "@/schemas/auth";
import type { UserRole } from "@/types";

type ProfileUser = {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  roles: UserRole[];
  emailVerified: boolean;
  sellerStatus: "active" | "suspended";
  profileCompleted: boolean;
  createdAt?: string;
};

const profileSections = [
  { title: "Обране", description: "Збережені новини, заклади, події та оголошення.", icon: Heart },
  {
    title: "Відгуки",
    description: "Власні відгуки, редагування і статус модерації.",
    icon: MessageSquare,
  },
  { title: "Сповіщення", description: "Статуси оголошень, модерації та відповіді.", icon: Bell },
  { title: "Налаштування", description: "Профіль, пароль і видалення акаунта.", icon: Settings },
];

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;

  return body?.error || fallback;
}

export default function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me")
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        return (await response.json()) as { user: ProfileUser };
      })
      .then((body) => {
        if (isMounted) {
          setUser(body?.user || null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const saveProfile = async (formData: FormData) => {
    setMessage("");

    if (!user) {
      setMessage("Потрібно увійти в акаунт.");
      return;
    }

    const rawInput: ProfileInput = {
      displayName: String(formData.get("displayName") || ""),
      phone: String(formData.get("phone") || "") || undefined,
      telegram: String(formData.get("telegram") || "") || undefined,
      instagram: String(formData.get("instagram") || "") || undefined,
    };
    const parsed = profileSchema.safeParse(rawInput);

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message || "Перевірте поля профілю.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Не вдалося оновити профіль."));
      }

      const body = (await response.json()) as { user: ProfileUser };

      setUser(body.user);
      setMessage("Профіль оновлено.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося оновити профіль.");
    } finally {
      setSaving(false);
    }
  };

  const resendVerification = async () => {
    setMessage("");
    setResending(true);

    try {
      const response = await fetch("/api/auth/resend-verification", { method: "POST" });

      if (!response.ok) {
        throw new Error(await readError(response, "Не вдалося відправити лист."));
      }

      const body = (await response.json()) as { message?: string };

      setMessage(body.message || "Лист підтвердження відправлено.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося відправити лист.");
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-surface p-5 text-sm text-muted">
        {uk.common.loading}...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-soft text-primary">
            <UserRound aria-hidden size={22} />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Потрібен вхід</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{uk.profile.signedOut}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
          >
            Увійти
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-semibold"
          >
            Створити профіль
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form action={saveProfile} className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-soft text-primary">
            <UserRound aria-hidden size={22} />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Дані профілю</h2>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span
                className={`rounded-md border px-2 py-1 ${
                  user.emailVerified
                    ? "border-primary/30 bg-primary-soft text-primary-strong"
                    : "border-accent/40 bg-accent-soft text-accent-strong"
                }`}
              >
                {user.emailVerified ? "Email підтверджено" : "Email не підтверджено"}
              </span>
              <span className="rounded-md border border-border bg-surface-subtle px-2 py-1 text-muted">
                Продавець: {user.sellerStatus === "active" ? "активний" : "призупинено"}
              </span>
            </div>
          </div>
        </div>

        {!user.emailVerified ? (
          <div className="mt-5 rounded-md border border-accent/40 bg-accent-soft p-4 text-sm leading-6 text-accent-strong">
            Підтвердіть email, щоб створювати оголошення і подавати заявки власника закладу.
            <button
              type="button"
              onClick={resendVerification}
              disabled={resending}
              className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-accent px-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {resending ? "Відправлення..." : "Надіслати лист повторно"}
            </button>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="displayName" className="text-sm font-semibold">
              Назва профілю
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              defaultValue={user.displayName}
              className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-semibold">
              Телефон
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone || ""}
              className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="telegram" className="text-sm font-semibold">
                Telegram
              </label>
              <input
                id="telegram"
                name="telegram"
                type="text"
                defaultValue={user.telegram || ""}
                className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="instagram" className="text-sm font-semibold">
                Instagram
              </label>
              <input
                id="instagram"
                name="instagram"
                type="text"
                defaultValue={user.instagram || ""}
                className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
              />
            </div>
          </div>
        </div>

        {message ? (
          <p className="mt-4 rounded-md border border-primary/30 bg-primary-soft px-3 py-2 text-sm text-primary-strong">
            {message}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Збереження..." : "Зберегти профіль"}
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-semibold"
            onClick={async () => {
              await fetch("/api/auth/session", { method: "DELETE" });
              setUser(null);
              router.refresh();
            }}
          >
            {uk.common.logout}
          </button>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/market/new"
          className="rounded-lg border border-border bg-surface p-4 transition hover:border-primary"
        >
          <PackageCheck aria-hidden size={22} className="text-primary" />
          <h3 className="mt-3 font-semibold">Продати на барахолці</h3>
          <p className="mt-1 text-sm leading-6 text-muted">
            Створити оголошення, пройти модерацію та керувати статусом товару.
          </p>
        </Link>
        <Link
          href="/owner"
          className="rounded-lg border border-border bg-surface p-4 transition hover:border-primary"
        >
          <Store aria-hidden size={22} className="text-primary" />
          <h3 className="mt-3 font-semibold">Заявка власника</h3>
          <p className="mt-1 text-sm leading-6 text-muted">
            Подати заявку на керування закладом або переглянути її статус.
          </p>
        </Link>
        {profileSections.map((section) => {
          const Icon = section.icon;

          return (
            <div key={section.title} className="rounded-lg border border-border bg-surface p-4">
              <Icon aria-hidden size={22} className="text-primary" />
              <h3 className="mt-3 font-semibold">{section.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{section.description}</p>
            </div>
          );
        })}
        {user.roles.includes("moderator") || user.roles.includes("admin") ? (
          <Link
            href="/moderation"
            className="rounded-lg border border-border bg-surface p-4 transition hover:border-primary"
          >
            <Bell aria-hidden size={22} className="text-primary" />
            <h3 className="mt-3 font-semibold">Модерація</h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              Черга оголошень, заявок власників, скарг і журнал дій.
            </p>
          </Link>
        ) : null}
        {user.roles.includes("admin") ? (
          <Link
            href="/admin"
            className="rounded-lg border border-border bg-surface p-4 transition hover:border-primary"
          >
            <Settings aria-hidden size={22} className="text-primary" />
            <h3 className="mt-3 font-semibold">Адмінпанель</h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              Користувачі, ролі, блокування, модерація і системний журнал.
            </p>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
