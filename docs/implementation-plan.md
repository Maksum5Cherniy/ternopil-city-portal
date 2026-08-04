# План реалізації

## Виконано

- Foundation: Next.js App Router, TypeScript, Tailwind, ESLint, Prettier.
- Дизайн-система: tokens, light/dark theme, responsive layout, header/footer, логотип.
- Публічний портал: головна, новини, місця, локації, події, карта, маркет, пошук, правові сторінки.
- Detail pages: окремі SEO-сторінки для контенту й оголошень.
- Auth: реєстрація, вхід, відновлення пароля, профіль.
- Кабінети: user profile, owner cabinet, moderation queue, admin dashboard.
- Server-side guard для `/admin`: httpOnly session cookie, Firebase Admin verification, роль `admin` із Firestore/custom claims.
- Market: створення оголошення авторизованим користувачем, статус `pending`, базові поля модерації.
- Firebase: client/admin wrappers, rules, storage rules, indexes, seed script.
- SEO: metadata, sitemap, robots, Open Graph, structured data, 404/500.
- Якість: `npm run lint`, `npm run build`, `npm test`.

## Production-доробки після підключення реального Firebase

- Server-side role guards для `/owner` і `/moderation`.
- CRUD-екрани адмінки для users, roles, categories, homepage sections, ads і audit logs.
- Realtime/query-backed списки замість static seed data.
- Повний Leaflet/OpenStreetMap runtime з кластеризацією.
- Firebase Emulator security-rules tests.
- Image upload/compression для Storage.
