"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { uk } from "@/config/dictionaries/uk";
import { applyTheme, storageKey } from "./ThemeProvider";

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(storageKey);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToThemeChanges(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ternopil-theme-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ternopil-theme-change", callback);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToThemeChanges, getStoredTheme, () => "light");
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = theme === "dark" ? uk.common.themeLight : uk.common.themeDark;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-primary transition hover:border-info hover:text-info focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      onClick={() => {
        window.localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
        window.dispatchEvent(new Event("ternopil-theme-change"));
      }}
    >
      {theme === "dark" ? <Sun aria-hidden size={18} /> : <Moon aria-hidden size={18} />}
    </button>
  );
}
