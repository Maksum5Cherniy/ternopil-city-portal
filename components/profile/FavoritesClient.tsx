"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { favoriteStorageKey, favoritesChangeEvent, type SavedFavorite } from "@/lib/favorites";

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

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(favoritesChangeEvent, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(favoritesChangeEvent, sync);
    };
  }, []);

  if (favorites.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface-subtle p-8 text-center">
        <Heart aria-hidden size={28} className="mx-auto text-muted" />
        <p className="mt-3 text-sm text-muted">Збережених матеріалів ще немає.</p>
        <Link
          href="/places"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white"
        >
          Перейти до закладів
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          onClick={() => {
            writeFavorites([]);
            setFavorites([]);
          }}
        >
          <Trash2 aria-hidden size={16} />
          <span>Очистити список</span>
        </button>
      </div>

      {favorites.map((item) => (
        <article key={item.href} className="rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <Link href={item.href} className="group min-w-0">
              <div className="text-xs font-semibold text-primary">{item.type}</div>
              <h2 className="mt-1 text-lg font-semibold group-hover:text-primary">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
              {item.meta ? (
                <p className="mt-3 text-xs font-semibold text-muted">{item.meta}</p>
              ) : null}
            </Link>
            <button
              type="button"
              aria-label={`Видалити ${item.title} з обраного`}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted transition hover:border-primary hover:text-primary"
              onClick={() => {
                const nextFavorites = favorites.filter((favorite) => favorite.href !== item.href);
                writeFavorites(nextFavorites);
                setFavorites(nextFavorites);
              }}
            >
              <Trash2 aria-hidden size={17} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
