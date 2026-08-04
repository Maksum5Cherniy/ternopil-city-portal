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
- `rules/firestore.rules` - рольова модель, профілі, контент, оголошення, скарги.
- `rules/storage.rules` - обмеження для аватарів, місць, локацій, оголошень.
- `firestore.indexes.json` - індекси для списків, статусів, категорій і пошуку.
- `scripts/seed.ts` - стартові категорії, новини, місця, локації, події, оголошення, ролі.

## Команди

```bash
npm run seed
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase emulators:start
```

Seed script не пише у Firestore, якщо `FIREBASE_PROJECT_ID` не заданий. Це дозволяє безпечно запускати локальні перевірки без реального Firebase-проєкту.
