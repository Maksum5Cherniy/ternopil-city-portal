# Database

Проєкт використовує Postgres як основну базу для користувачів, сесій і оголошень. На Vercel рекомендований шлях - Neon Postgres через Vercel Marketplace Store, який автоматично додає `DATABASE_URL` у потрібні середовища.

## Налаштування

1. Створити Neon Store у Vercel для проєкту `ternopil-city-portal`.
2. Додати `DATABASE_URL` у Production, Preview і Development.
3. Додати `ADMIN_EMAILS` зі списком email-адрес адміністраторів через кому.
4. Додати `RESEND_API_KEY` і `EMAIL_FROM` для підтвердження email та відновлення пароля.
5. Виконати `npx vercel env pull .env.local --yes --scope de-te`.
6. Запустити `npm run seed` локально або окремим одноразовим production-скриптом.

## Файли проєкту

- `lib/database.ts` - lazy Postgres client, створення схеми, користувачі, сесії, оголошення.
- `lib/password.ts` - хешування і перевірка пароля через Node `scrypt`.
- `lib/email.ts` - відправка verification/reset email через Resend або контрольований fallback.
- `lib/auth-session.ts` - server-side перевірка cookie, статусу користувача та ролей.
- `app/api/auth/register/route.ts` - реєстрація користувача.
- `app/api/auth/login/route.ts` - вхід користувача.
- `app/api/auth/session/route.ts` - читання і завершення поточної сесії.
- `app/api/profile/route.ts` - оновлення профілю.
- `app/api/listings/route.ts` - створення оголошення.
- `scripts/seed.ts` - стартова схема, тестовий адміністратор і seed-оголошення.

## Серверна сесія

Після входу або реєстрації сервер створює випадковий session token, зберігає тільки SHA-256 hash у таблиці `auth_sessions`, а сирий token віддає браузеру як httpOnly cookie `de_ternopil_session`. Закриті серверні сторінки читають cookie через `cookies()`, знаходять активну сесію в Postgres і перевіряють роль користувача.

Роль `admin` задається в масиві `users.roles`. Змінна `ADMIN_EMAILS` автоматично додає роль `admin` для відповідних email тільки після підтвердження email.

Якщо `DATABASE_URL` не заданий, закриті сторінки і API повертають контрольоване повідомлення про відсутню базу, а не падають під час build/runtime.

## Команди

```bash
npx vercel env pull .env.local --yes --scope de-te
npm run seed
npm run build
```
