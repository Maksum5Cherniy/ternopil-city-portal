# Архітектура Де Тернопіль

## Аналіз вимог

Проєкт є не сайтом-візиткою, а міським порталом з кількома публічними каталогами, рольовими кабінетами, модерацією, SEO-фундаментом і серверною перевіркою доступів. Перший production-шар має стабільно закривати auth/database flow: реєстрація, вхід, профіль, створення оголошення і доступ до `/admin`.

Ключові обмеження:

- основна мова UI: українська;
- Next.js App Router, TypeScript, Tailwind CSS;
- Postgres як основне сховище користувацьких даних;
- Vercel Neon Store як рекомендований production database;
- реальний час тільки для конкретного користувача, об'єкта або активної черги, коли це буде потрібно;
- всі важливі записи та зміни проходять серверну валідацію і, де потрібно, модерацію.

## Frontend

- `app`: маршрути App Router, metadata, error/not-found, sitemap, robots.
- `components`: layout, UI primitives, content components, theme components.
- `features`: user-facing flows that combine forms, server actions and UI.
- `config/dictionaries`: UI-тексти для локалізації.
- `styles`: CSS tokens and Tailwind v4 theme mapping.

Більшість сторінок мають бути Server Components. Client Components використовуються для інтерактивності: mobile navigation, theme toggle, forms, map controls і майбутні live listeners.

## Domain and Data

- `types`: shared domain contracts.
- `schemas`: Zod validation for incoming form/server data.
- `modules`: domain rules by area.
- `services`: use-case orchestration.
- `repositories`: майбутні database/storage wrappers для складніших модулів.
- `lib/database.ts`: поточний Postgres data access для auth, profile і listings.
- `lib/auth-session.ts`: server-side session cookie і role checks.

UI не повинен напряму звертатися до бази. Client forms викликають route handlers, route handlers валідують дані через Zod і виконують mutations через серверні helpers.

## Rendering and Caching

- Публічні індекси та детальні SEO-сторінки: server rendering або ISR.
- Кабінети, адмінпанель, черги модерації: dynamic rendering із server role checks.
- Популярний публічний контент кешується і пагінується.
- `/market` читає Postgres, коли `DATABASE_URL` доступний, і падає назад на static seed data без runtime crash.

## Security

- Паролі хешуються через Node `scrypt`; plaintext не зберігається.
- Session token зберігається в браузері тільки як httpOnly cookie.
- У базі зберігається SHA-256 hash session token, не сам token.
- Ролі перевіряються на сервері через `users.roles`.
- API routes повертають контрольований `503`, якщо база не налаштована.
- Всі write routes проходять Zod validation перед записом.
- Важливі дії адміністратора, модератора і власника мають писатися в майбутню таблицю `audit_logs`.
