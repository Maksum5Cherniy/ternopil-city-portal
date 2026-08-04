"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Bell, Heart, MessageSquare, PackageCheck, Settings, Store, UserRound } from "lucide-react";
import { firebaseAuth, firebaseDb, isFirebaseConfigured } from "@/firebase/firebaseClient";
import { uk } from "@/config/dictionaries/uk";
import { profileSchema, type ProfileInput } from "@/schemas/auth";
import { clearSessionCookie } from "./sessionCookie";

type FirestoreUserProfile = {
  displayName?: string;
  email?: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  roles?: string[];
  profileCompleted?: boolean;
  createdAt?: unknown;
};

const profileSections = [
  {
    title: "Мої оголошення",
    description: "Активні, на модерації, продані та архів.",
    icon: PackageCheck,
  },
  { title: "Обране", description: "Збережені новини, заклади, події та оголошення.", icon: Heart },
  {
    title: "Відгуки",
    description: "Власні відгуки, редагування і статус модерації.",
    icon: MessageSquare,
  },
  { title: "Заявка власника", description: "Подача заявки на керування закладом.", icon: Store },
  { title: "Сповіщення", description: "Статуси оголошень, модерації та відповіді.", icon: Bell },
  { title: "Налаштування", description: "Профіль, пароль і видалення акаунта.", icon: Settings },
];

export default function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FirestoreUserProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth || !firebaseDb) {
      return;
    }

    const auth = firebaseAuth;
    const db = firebaseDb;

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      getDoc(doc(db, "users", currentUser.uid))
        .then((snapshot) => {
          setProfile(snapshot.exists() ? snapshot.data() : null);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const saveProfile = async (formData: FormData) => {
    setMessage("");

    if (!firebaseAuth || !firebaseDb || !user) {
      setMessage("Потрібно увійти в акаунт.");
      return;
    }

    const db = firebaseDb;

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
      await updateProfile(user, {
        displayName: parsed.data.displayName,
      });
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...parsed.data,
          email: user.email,
          roles: profile?.roles || ["user"],
          isBlocked: false,
          profileCompleted: true,
          updatedAt: serverTimestamp(),
          createdAt: profile?.createdAt || serverTimestamp(),
        },
        { merge: true },
      );
      setProfile((current) => ({ ...current, ...parsed.data, profileCompleted: true }));
      setMessage("Профіль оновлено.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не вдалося оновити профіль.");
    } finally {
      setSaving(false);
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="rounded-lg border border-accent/40 bg-accent-soft p-5 text-sm leading-6 text-accent-strong">
        {uk.auth.firebaseMissing}
      </div>
    );
  }

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
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="displayName" className="text-sm font-semibold">
              Назва профілю
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              defaultValue={profile?.displayName || user.displayName || ""}
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
              defaultValue={profile?.phone || ""}
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
                defaultValue={profile?.telegram || ""}
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
                defaultValue={profile?.instagram || ""}
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
              if (firebaseAuth) {
                await signOut(firebaseAuth);
              }

              await clearSessionCookie();
              router.refresh();
            }}
          >
            {uk.common.logout}
          </button>
        </div>
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
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
      </div>
    </div>
  );
}
