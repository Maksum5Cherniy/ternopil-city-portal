"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  favoriteStorageKey,
  favoritesChangeEvent,
  type SavedFavorite,
} from "@/lib/favorites";

type FavoriteButtonProps = {
  item: Omit<SavedFavorite, "savedAt">;
};

function readFavorites(userId: string) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(favoriteStorageKey(userId)) || "[]",
    );

    return Array.isArray(parsed) ? (parsed as SavedFavorite[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(userId: string, items: SavedFavorite[]) {
  window.localStorage.setItem(
    favoriteStorageKey(userId),
    JSON.stringify(items),
  );
  window.dispatchEvent(new Event(favoritesChangeEvent));
}

export default function FavoriteButton({ item }: FavoriteButtonProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { user?: { uid?: string } })
          : null,
      )
      .then((body) => setUserId(body?.user?.uid || null))
      .catch(() => setUserId(null));
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const sync = () => {
      setIsSaved(
        readFavorites(userId).some((favorite) => favorite.href === item.href),
      );
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(favoritesChangeEvent, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(favoritesChangeEvent, sync);
    };
  }, [item.href, userId]);

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      disabled={userId === undefined}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      onClick={() => {
        if (!userId) {
          router.push(`/login?next=${encodeURIComponent(item.href)}`);
          return;
        }

        const favorites = readFavorites(userId);
        const nextFavorites = isSaved
          ? favorites.filter((favorite) => favorite.href !== item.href)
          : [
              { ...item, savedAt: new Date().toISOString() },
              ...favorites,
            ].slice(0, 80);

        writeFavorites(userId, nextFavorites);
        setIsSaved(!isSaved);
      }}
    >
      <Heart
        aria-hidden
        size={18}
        className={isSaved ? "fill-accent text-accent" : ""}
      />
      <span>
        {isSaved
          ? "В обраному"
          : userId === null
            ? "Увійти, щоб зберегти"
            : "Додати в обране"}
      </span>
    </button>
  );
}
