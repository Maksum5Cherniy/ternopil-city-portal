export const favoriteStorageKey = "deternopil:favorites";
export const favoritesChangeEvent = "deternopil-favorites-change";

export type SavedFavorite = {
  href: string;
  title: string;
  description: string;
  type: string;
  meta?: string;
  badge?: string;
  savedAt: string;
};
