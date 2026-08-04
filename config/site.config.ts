export const SITE = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || "Де Тернопіль",
  shortTitle: process.env.NEXT_PUBLIC_SITE_SHORT_TITLE || "Де Тернопіль",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Де Тернопіль - місто, люди, можливості: новини, заклади, події, карта та оголошення Тернополя.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "uk_UA",
  language: "uk",
  defaultLanguage: "uk",
  cityName: "Тернопіль",
  domainLabel: process.env.NEXT_PUBLIC_SITE_DOMAIN_LABEL || "de-ternopil.ua",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "noreply@deternopil.pp.ua",
  contactTelegram: process.env.NEXT_PUBLIC_CONTACT_TELEGRAM || "@no_name_te",
  contactTelegramUrl: process.env.NEXT_PUBLIC_CONTACT_TELEGRAM_URL || "https://t.me/no_name_te",
  mapTileServer:
    process.env.NEXT_PUBLIC_MAP_TILE_SERVER || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  assets: {
    heroImage: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Ternopil_pond_%284%29.jpg/1280px-Ternopil_pond_%284%29.jpg",
      alt: "Тернопільський став і набережна міста",
    },
  },
};

export const THEMES = {
  light: "light",
  dark: "dark",
} as const;

export const DESIGN = {
  radius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
  },
  maxWidth: "1180px",
} as const;
