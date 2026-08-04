"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  Heart,
  ListChecks,
  MessageSquare,
  PackageCheck,
  Settings,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";
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

type ProfileAction = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  action: string;
};

const primaryProfileActions: ProfileAction[] = [
  {
    title: "Продати на барахолці",
    description: "Створити оголошення, пройти модерацію та керувати статусом товару.",
    icon: PackageCheck,
    href: "/market/new",
    action: "Створити оголошення",
  },
  {
    title: "Мої оголошення",
    description: "Статуси модерації, причина відхилення, архів, продаж і повторна подача.",
    icon: ListChecks,
    href: "/profile/listings",
    action: "Керувати",
  },
  {
    title: "Заявка власника",
    description: "Подати заявку на керування закладом або переглянути її статус.",
    icon: Store,
    href: "/owner",
    action: "Подати заявку",
  },
];

const profileSections: ProfileAction[] = [
  {
    title: "Обране",
    description: "Збережені новини, заклади, події та оголошення.",
    icon: Heart,
    href: "/profile/favorites",
    action: "Відкрити",
  },
  {
    title: "Відгуки",
    description: "Власні відгуки, редагування і статус модерації.",
    icon: MessageSquare,
    href: "/profile/reviews",
    action: "Переглянути",
  },
  {
    title: "Сповіщення",
    description: "Статуси оголошень, модерації та відповіді.",
    icon: Bell,
    href: "/profile/notifications",
    action: "Переглянути",
  },
  {
    title: "Налаштування",
    description: "Профіль, контакти, пароль і видалення акаунта.",
    icon: Settings,
    href: "#profile-settings",
    action: "Редагувати",
  },
];

function ProfileActionCard({ item }: { item: ProfileAction }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group flex min-h-[158px] flex-col rounded-lg border border-border bg-surface p-5 transition hover:border-primary hover:bg-primary-soft hover:shadow-[var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-soft text-primary transition group-hover:bg-surface">
        <Icon aria-hidden size={22} />
      </span>
      <h3 className="mt-4 font-semibold group-hover:text-primary">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{item.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {item.action}
        <ArrowRight aria-hidden size={16} />
      </span>
    </Link>
  );
}

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
      <form
        id="profile-settings"
        action={saveProfile}
        className="rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow)]"
      >
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
        {[...primaryProfileActions, ...profileSections].map((item) => (
          <ProfileActionCard key={item.title} item={item} />
        ))}
        {user.roles.includes("moderator") || user.roles.includes("admin") ? (
          <ProfileActionCard
            item={{
              title: "Модерація",
              description: "Черга оголошень, заявок власників, відгуків, скарг і журнал дій.",
              icon: Bell,
              href: "/moderation",
              action: "Відкрити чергу",
            }}
          />
        ) : null}
        {user.roles.includes("admin") ? (
          <ProfileActionCard
            item={{
              title: "Адмінпанель",
              description: "Користувачі, ролі, блокування, модерація і системний журнал.",
              icon: Settings,
              href: "/admin",
              action: "Керувати",
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
