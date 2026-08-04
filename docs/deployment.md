# Deployment

## Vercel

1. Підключити репозиторій до Vercel.
2. Build command: `npm run build`.
3. Output framework: Next.js.
4. Додати Environment Variables з `.env.example`.
5. Підключити Neon Postgres Store або іншу Postgres-базу і додати `DATABASE_URL`.
6. Додати `ADMIN_EMAILS` для першого адміністратора.
7. Підключити Resend або додати `RESEND_API_KEY` і `EMAIL_FROM` для підтвердження email.

## Custom domain

Production domain:

```bash
NEXT_PUBLIC_SITE_URL=https://deternopil.pp.ua
NEXT_PUBLIC_SITE_DOMAIN_LABEL=deternopil.pp.ua
```

Domain is added to Vercel project `ternopil-city-portal` as:

- `deternopil.pp.ua`
- `www.deternopil.pp.ua`

NIC.UA registrar nameservers must be changed from parked nameservers to Vercel:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

Vercel DNS already contains the website ALIAS records and Resend email records.

Мінімум для server-side доступу до `/admin`:

- `DATABASE_URL`
- `ADMIN_EMAILS`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `RESEND_EMAIL_DOMAIN`

## Resend email

Resend Marketplace integration for this project:

```bash
npx vercel integration add resend --name ternopil-city-portal-email --plan free -m domain=deternopil.pp.ua -m region=eu-west-1 -e production -e preview -e development --scope de-te --json
```

Current sender:

```bash
EMAIL_FROM="Де Тернопіль <noreply@deternopil.pp.ua>"
RESEND_EMAIL_DOMAIN=deternopil.pp.ua
```

DNS records required for `deternopil.pp.ua`:

| Type | Name                | Value                                                                                                                                                                                                                        | Priority |
| ---- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| TXT  | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDavKjMdEh3OlMyh8sw55sZA++fmQNS6kwvve4+SZuZyngnZg7SBh+DMSya921X9pVyw9lEL84R+Kmye9Yq8Up8wHBQ0USCEt1uIuSma/COqF8xDRV0lFABo33acoiGmvKKQEtcRyaWWEOMrODIhI67+3ZeEYNetZPizGkc0d1T/wIDAQAB` |          |
| MX   | `send`              | `feedback-smtp.eu-west-1.amazonses.com`                                                                                                                                                                                      | `10`     |
| TXT  | `send`              | `v=spf1 include:amazonses.com ~all`                                                                                                                                                                                          |          |

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
