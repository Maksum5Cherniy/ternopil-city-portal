# Deployment

## Vercel

1. Підключити репозиторій до Vercel.
2. Build command: `npm run build`.
3. Output framework: Next.js.
4. Додати Environment Variables з `.env.example`.
5. Для service account краще зберігати приватний ключ у змінній `FIREBASE_PRIVATE_KEY` з escaped line breaks.

## Firebase

```bash
firebase login
firebase use <project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage
npm run seed
```

## Перед релізом

```bash
npm run format:check
npm run lint
npm run build
npm test
npm audit --omit=dev
```

Auth/private сторінки закриті від індексації через metadata та `robots.ts`. Публічні detail pages входять у `sitemap.ts`.
