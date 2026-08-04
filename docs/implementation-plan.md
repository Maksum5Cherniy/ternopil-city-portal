# План реалізації

## Виконано

- Foundation: Next.js App Router, TypeScript, Tailwind, ESLint, Prettier.
- Дизайн-система: tokens, light/dark theme, responsive layout, header/footer, логотип.
- Публічний портал: головна, новини, місця, локації, події, карта, маркет, пошук, правові сторінки.
- Detail pages: окремі SEO-сторінки для контенту й оголошень.
- Auth: реєстрація, вхід, відновлення пароля, профіль.
- Server-side auth/database: Postgres users, password hashes, auth sessions, httpOnly cookie.
- Server-side guard для `/admin`: перевірка cookie, активної сесії та ролі `admin`.
- Кабінети: user profile, owner cabinet, moderation queue, admin dashboard.
- Market: створення оголошення авторизованим користувачем, статус `pending`, базові поля модерації.
- SEO: metadata, sitemap, robots, Open Graph, structured data, 404/500.
- Якість: `npm run lint`, `npm run build`, `npm test`.

## Production-доробки після підключення Neon/Postgres

- Створити Neon Store у Vercel і додати `DATABASE_URL`.
- Додати `ADMIN_EMAILS` для першого адміністратора.
- Запустити `npm run seed` після `vercel env pull`.
- Server-side role guards для `/owner` і `/moderation`.
- CRUD-екрани адмінки для users, roles, categories, homepage sections, ads і audit logs.
- Query-backed списки замість static seed data для всіх публічних модулів.
- Повний Leaflet/OpenStreetMap runtime з кластеризацією.
- Image upload/compression через окремий storage provider.
- Додати шаблони transactional email у React Email замість inline HTML.
