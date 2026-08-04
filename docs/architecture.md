# Архітектура Ternopil City Portal

## Аналіз вимог

Проєкт є не сайтом-візиткою, а міським порталом з кількома публічними каталогами,
рольовими кабінетами, модерацією, realtime-оновленнями там, де вони потрібні, та
SEO-фундаментом з першого дня. Перший етап має створити не фінальний продукт, а
стабільну основу для всіх наступних модулів.

Ключові обмеження:

- основна мова UI: українська;
- Next.js App Router, TypeScript, Tailwind CSS;
- Firebase Auth, Firestore, Storage, Admin SDK;
- реальний час тільки для конкретного користувача, об'єкта або активної черги;
- без мобільного застосунку, онлайн-бронювання і внутрішнього чату;
- мінімізація Firebase reads, розміру фото і фонових підписок;
- всі важливі записи та зміни проходять серверну валідацію і, де потрібно, модерацію.

## Рекомендована архітектура

### Frontend

- `app`: маршрути App Router, metadata, error/not-found, sitemap, robots.
- `components`: layout, UI primitives, content components, theme components.
- `features`: user-facing flows that combine forms, server actions and UI.
- `config/dictionaries`: UI-тексти для локалізації.
- `styles`: CSS tokens and Tailwind v4 theme mapping.

Більшість сторінок мають бути Server Components. Client Components використовуються лише
для інтерактивності: mobile navigation, theme toggle, forms, realtime listeners, map controls.

### Domain and data

- `types`: shared domain contracts.
- `schemas`: Zod validation for incoming form/server data.
- `modules`: domain rules by area.
- `services`: use-case orchestration.
- `repositories`: Firestore and Storage wrappers.
- `firebase`: client/admin initialization only.

UI не повинен напряму створювати складні Firestore-запити. Server actions/API routes викликають
services, services викликають repositories, repositories ізолюють Firebase SDK.

### Rendering and caching

- Публічні індекси та детальні SEO-сторінки: server rendering або ISR.
- Кабінети, адмінпанель, черги модерації: dynamic rendering with server role checks.
- Realtime listeners: тільки для відкритого об'єкта, конкретного користувача або активної черги.
- Популярний публічний контент кешується і пагінується.

### Security

- Firebase client config містить тільки `NEXT_PUBLIC_*`.
- Admin SDK використовується тільки на сервері.
- Ролі перевіряються на сервері через custom claims або `userRoles/{uid}`.
- Firestore Rules обмежують прямий доступ клієнта, але не замінюють серверні перевірки.
- Storage Rules перевіряють ownership path, MIME type and file size.
- Усі важливі дії адміністратора, модератора і власника пишуться в `auditLogs`.
