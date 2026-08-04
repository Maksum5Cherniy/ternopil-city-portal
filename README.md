# Де Тернопіль

Міський інформаційний портал Тернополя на Next.js App Router, TypeScript, Tailwind CSS і Neon Postgres для робочих користувацьких даних. У проєкті є публічні розділи, профілі користувачів, адмін-панель, кабінет власника, модерація, міська барахолка, SEO-структура, seed-дані та базові тести доступів.

## Що реалізовано

- Бренд "Де Тернопіль", SVG-логотип у `public/logo.svg`, знак у `public/logo-mark.svg`, app icon у `public/app-icon.svg`, адаптивний header/footer.
- Палітра з нового дизайн-макету: основний синій `#0D1B3D`, акцентний синій `#1E3ABA`, світлий синій `#2563EB`, жовтий `#FBBF24`, зелений `#22C55E`, світлий сірий `#F3F4F6`, текстовий сірий `#374151`.
- Публічні сторінки: `/`, `/news`, `/places`, `/locations`, `/events`, `/map`, `/market`, `/search`, `/contacts`, `/privacy`, `/terms`.
- Детальні сторінки для новин, закладів, локацій, подій і оголошень: `/news/[slug]`, `/places/[slug]`, `/locations/[slug]`, `/events/[slug]`, `/market/[slug]`.
- Реєстрація, вхід, відновлення пароля, профіль і вихід: `/register`, `/login`, `/forgot-password`, `/profile`.
- Server-side auth: httpOnly cookie `de_ternopil_session`, таблиці `users` і `auth_sessions`, перевірка ролей на сервері.
- Адмін-панель із server-side перевіркою ролі `admin`: `/admin`; службові кабінети: `/owner`, `/moderation`.
- Створення оголошень авторизованими користувачами: `/market/new`; записи зберігаються у Postgres зі статусом `pending`.
- SEO: metadata, Open Graph, sitemap, robots, structured data на detail pages, 404/500/error screens.
- Zod-схеми, доменні типи, рольова модель і unit-тести для access control.

## Як люди створюють профілі

1. Користувач відкриває `/register`.
2. Вводить назву профілю, email, пароль і приймає правила.
3. API `/api/auth/register` валідує форму, хешує пароль через `scrypt` і створює запис у таблиці `users`.
4. Сервер створює рядок у `auth_sessions` і виставляє httpOnly cookie `de_ternopil_session`.
5. Користувач переходить у `/profile`, де може додати телефон і соцмережі; для оголошень використовує `/market/new`.

Для реальної роботи цього flow потрібна змінна `DATABASE_URL` з Vercel Neon Store або іншої сумісної Postgres-бази.

## Як працює доступ до адмін-панелі

1. Користувач входить через `/login`.
2. API `/api/auth/login` перевіряє email і пароль у Postgres.
3. Сервер створює httpOnly cookie `de_ternopil_session`.
4. `/admin` читає cookie на сервері, перевіряє активну сесію і роль `admin` у таблиці `users.roles`.
5. Без сесії користувач перенаправляється на `/login?next=/admin`; без ролі `admin` бачить сторінку відмови в доступі.

Першого адміністратора можна задати через змінну `ADMIN_EMAILS`. Email зі списку автоматично отримує роль `admin` під час реєстрації або входу.

## Запуск

```bash
npm install
npm run dev
```

Локальна адреса за замовчуванням: `http://localhost:3000`.

## База даних

Заповніть `.env.local` на основі `.env.example`:

```bash
DATABASE_URL=postgres://...
ADMIN_EMAILS=admin@example.com
```

Seed script створює схему, тестового адміністратора і стартові оголошення:

```bash
npm run seed
```

Якщо `DATABASE_URL` не заданий, сайт збирається і відкриває публічні сторінки зі static seed data, але реєстрація, вхід, профіль, створення оголошень і `/admin` показують повідомлення про відсутню базу.

## Перевірка

```bash
npm run format:check
npm run lint
npm run build
npm test
```

## Документація

- `docs/architecture.md`
- `docs/project-structure.md`
- `docs/postgres-schema.md`
- `docs/access-control.md`
- `docs/database.md`
- `docs/deployment.md`
- `docs/implementation-plan.md`

## Відомі обмеження

- `/owner` і `/moderation` поки мають UI-структуру; server-side guards для них залишені наступним етапом після `/admin`.
- Повний CRUD адмінки для користувачів, ролей, категорій, блоків головної, реклами й audit logs ще треба доробити поверх Postgres.
- Карта має UI-підготовку; повноцінний Leaflet/OpenStreetMap runtime можна підключати поверх наявної структури.
- Відновлення пароля зараз приймає запит без відправки листа; для production треба підключити email provider.
