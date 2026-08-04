"use client";

import { useEffect, type ReactNode } from "react";

const storageKey = "ternopil-city-theme";

function resolveInitialTheme() {
  const savedTheme = window.localStorage.getItem(storageKey);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyTheme(resolveInitialTheme());
  }, []);

  return children;
}

export { applyTheme, storageKey };
