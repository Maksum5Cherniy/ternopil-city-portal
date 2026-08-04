# Структура проєкту

```txt
app/
  admin/
  api/
    auth/
    listings/
    profile/
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
lib/
schemas/
scripts/
styles/
tests/
types/
```

## Основні межі

- `app/` містить маршрути Next.js, API route handlers і metadata.
- `components/` містить клієнтські форми, UI-компоненти та reusable сторінкові блоки.
- `constants/content.ts` дає стартові seed/static дані для публічних модулів.
- `lib/database.ts` містить Postgres client, schema bootstrap і базові data helpers.
- `lib/auth-session.ts` відповідає за server-side session cookie і role checks.
- `schemas/` містить Zod-схеми для auth, content і market listing forms.
- `scripts/seed.ts` створює стартову схему та seed-дані, коли доступний `DATABASE_URL`.
