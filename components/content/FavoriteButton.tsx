"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { favoriteStorageKey, favoritesChangeEvent, type SavedFavorite } from "@/lib/favorites";

type FavoriteButtonProps = {
  item: Omit<SavedFavorite, "savedAt">;
};

function readFavorites() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(favoriteStorageKey) || "[]");

    return Array.isArray(parsed) ? (parsed as SavedFavorite[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(items: SavedFavorite[]) {
  window.localStorage.setItem(favoriteStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event(favoritesChangeEvent));
}

export default function FavoriteButton({ item }: FavoriteButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsSaved(readFavorites().some((favorite) => favorite.href === item.href));
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(favoritesChangeEvent, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(favoritesChangeEvent, sync);
    };
  }, [item.href]);

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      onClick={() => {
        const favorites = readFavorites();
        const nextFavorites = isSaved
          ? favorites.filter((favorite) => favorite.href !== item.href)
          : [{ ...item, savedAt: new Date().toISOString() }, ...favorites].slice(0, 80);

        writeFavorites(nextFavorites);
        setIsSaved(!isSaved);
      }}
    >
      <Heart aria-hidden size={18} className={isSaved ? "fill-accent text-accent" : ""} />
      <span>{isSaved ? "В обраному" : "Додати в обране"}</span>
    </button>
  );
}
