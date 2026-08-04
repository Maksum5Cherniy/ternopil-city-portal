# Структура проєкту

```txt
app/
  admin/
  contacts/
  events/
    [slug]/
  forgot-password/
  locations/
    [slug]/
  login/
  map/
  market/
    [slug]/
    new/
  moderation/
  news/
    [slug]/
  owner/
  places/
    [slug]/
  privacy/
  profile/
  register/
  search/
  terms/
  error.tsx
  global-error.tsx
  layout.tsx
  not-found.tsx
  robots.ts
  sitemap.ts
components/
  auth/
  content/
  market/
  ui/
config/
constants/
firebase/
lib/
rules/
schemas/
scripts/
styles/
tests/
types/
```

## Основні межі

- `app/` містить маршрути Next.js і metadata.
- `components/` містить клієнтські форми, UI-компоненти та reusable сторінкові блоки.
- `constants/content.ts` дає стартові seed/static дані для публічних модулів.
- `firebase/`, `rules/`, `firestore.indexes.json` готують реальне підключення Firebase.
- `schemas/` містить Zod-схеми для auth, content і market listing forms.
- `lib/access-control.ts` описує ролі й дозволи.
