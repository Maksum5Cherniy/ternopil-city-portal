# Deployment

## Vercel

1. Підключити репозиторій до Vercel.
2. Build command: `npm run build`.
3. Output framework: Next.js.
4. Додати Environment Variables з `.env.example`.
5. Підключити Neon Postgres Store або іншу Postgres-базу і додати `DATABASE_URL`.
6. Додати `ADMIN_EMAILS` для першого адміністратора.

Мінімум для server-side доступу до `/admin`:

- `DATABASE_URL`
- `ADMIN_EMAILS`

Без `DATABASE_URL` сторінка `/admin` залишається закритою і показує повідомлення про відсутню базу даних. Публічні сторінки все одно збираються та відкриваються зі static seed data.

## Vercel Stores

Рекомендована команда після прийняття Neon Marketplace terms:

```bash
npx vercel integration add neon --name ternopil-city-portal-db --plan free_v3 -m region=fra1 -m auth=false -e production -e preview -e development --scope de-te --json
```

Після створення Store:

```bash
npx vercel env pull .env.local --yes --scope de-te
npm run seed
npx vercel --prod --scope de-te
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
