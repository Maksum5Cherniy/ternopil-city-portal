# Firebase

## Налаштування

1. Створити Firebase project.
2. Увімкнути Authentication: Email/Password, Google за потреби.
3. Створити Firestore у production mode.
4. Створити Storage bucket для фото користувачів, закладів і оголошень.
5. Створити service account і зберегти JSON-ключ тільки локально або у Vercel Environment Variables.
6. Заповнити `.env.local` на основі `.env.example`.

## Файли проєкту

- `firebase/firebaseClient.ts` - клієнтський SDK для Auth, Firestore, Storage.
- `firebase/firebaseAdmin.ts` - Admin SDK для серверних дій і seed.
- `app/api/auth/session/route.ts` - створення та очищення httpOnly session cookie після Firebase Auth входу.
- `lib/auth-session.ts` - server-side перевірка cookie, статусу користувача та ролей.
- `rules/firestore.rules` - рольова модель, профілі, контент, оголошення, скарги.
- `rules/storage.rules` - обмеження для аватарів, місць, локацій, оголошень.
- `firestore.indexes.json` - індекси для списків, статусів, категорій і пошуку.
- `scripts/seed.ts` - стартові категорії, новини, місця, локації, події, оголошення, ролі.

## Серверна сесія

Після входу або реєстрації клієнт синхронізує Firebase ID token із `/api/auth/session`, а сервер виставляє cookie `de_ternopil_session` з прапором httpOnly. Закриті серверні сторінки читають цю cookie через `cookies()`, перевіряють її в Firebase Admin SDK і тільки після цього працюють із ролями.

Роль `admin` можна задати одним із трьох способів:

- масив `roles` у `users/{uid}`;
- масив `roles` у `userRoles/{uid}`;
- custom claims Firebase Auth: `roles`, `role` або `admin: true`.

Якщо `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` або `FIREBASE_PRIVATE_KEY` не задані, `/admin` не відкривається і показує повідомлення про відсутню server-side конфігурацію.

## Команди

```bash
npm run seed
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase emulators:start
```

Seed script не пише у Firestore, якщо `FIREBASE_PROJECT_ID` не заданий. Це дозволяє безпечно запускати локальні перевірки без реального Firebase-проєкту.
