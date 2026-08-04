# Де Тернопіль

Міський інформаційний портал Тернополя на Next.js App Router, TypeScript, Tailwind CSS і Firebase. У проєкті є публічні розділи, профілі користувачів, адмін-панель, кабінет власника, модерація, міська барахолка, SEO-структура, правила Firebase, seed-дані та базові тести доступів.

## Що реалізовано

- Бренд “Де Тернопіль”, SVG-логотип у `public/logo.svg`, знак у `public/logo-mark.svg`, app icon у `public/app-icon.svg`, адаптивний header/footer.
- Палітра з нового дизайн-макету: основний синій `#0D1B3D`, акцентний синій `#1E3ABA`, світлий синій `#2563EB`, жовтий `#FBBF24`, зелений `#22C55E`, світлий сірий `#F3F4F6`, текстовий сірий `#374151`.
- Публічні сторінки: `/`, `/news`, `/places`, `/locations`, `/events`, `/map`, `/market`, `/search`, `/contacts`, `/privacy`, `/terms`.
- Детальні сторінки для новин, закладів, локацій, подій і оголошень: `/news/[slug]`, `/places/[slug]`, `/locations/[slug]`, `/events/[slug]`, `/market/[slug]`.
- Реєстрація, вхід, відновлення пароля та профіль: `/register`, `/login`, `/forgot-password`, `/profile`.
- Адмін-панель і службові кабінети: `/admin`, `/owner`, `/moderation`.
- Створення оголошень користувачами: `/market/new` з Firebase Auth + Firestore write flow.
- Firestore/Storage rules, індекси, Firebase config і seed script.
- SEO: metadata, Open Graph, sitemap, robots, structured data на detail pages, 404/500/error screens.
- Zod-схеми, доменні типи, рольова модель і unit-тести для access control.

## Як люди створюють профілі

1. Користувач відкриває `/register`.
2. Вводить імʼя, email, телефон, тип профілю та пароль.
3. Firebase Authentication створює акаунт.
4. Після цього у Firestore створюється документ `users/{uid}` зі статусом `active`, роллю `user` і публічним профілем.
5. Користувач переходить у `/profile`, а для оголошень використовує `/market/new`.

Для реальної роботи цього flow потрібен налаштований Firebase-проєкт і `.env.local`.

## Запуск

```bash
npm install
npm run dev
```

Локальна адреса за замовчуванням: `http://localhost:3000`.

## Перевірка

```bash
npm run format:check
npm run lint
npm run build
npm test
```

## Firebase

```bash
npm run seed
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Перед цим заповніть `.env.local` на основі `.env.example`. Реальні service-account ключі не можна комітити.

## Документація

- `docs/architecture.md`
- `docs/project-structure.md`
- `docs/firestore-schema.md`
- `docs/access-control.md`
- `docs/firebase.md`
- `docs/deployment.md`
- `docs/implementation-plan.md`

## Відомі обмеження

- Публічні дані зараз seed/static-ready; реальна адмінська CRUD-робота потребує підключеного Firebase-проєкту.
- Карта має UI-підготовку; повноцінний Leaflet/OpenStreetMap runtime можна підключати поверх наявної структури.
- `npm audit --omit=dev` показує moderate transitive advisory у ланцюжку `firebase-admin`; безпечний non-force fix наразі недоступний, force downgrade не застосовано.
