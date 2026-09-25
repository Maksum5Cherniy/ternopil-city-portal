# Production deployment

The public portal is hosted by Sites at
`https://de-ternopil-portal.maksumlove29.chatgpt.site`. The custom hostname
`deternopil.pp.ua` and its `www` alias are registered with the same Site.
Publishing a code change requires pushing the Site source, saving its build
archive as a version, and deploying that version. Changing runtime variables
also requires redeploying a saved version.

## Runtime configuration

Configure the following in the Sites environment, marking credentials and
administrator addresses as secrets:

| Key | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string for the server only. |
| `ADMIN_EMAILS` | Comma-separated bootstrap administrator email addresses. |
| `RESEND_API_KEY` | Resend key restricted to sending from this domain. |
| `EMAIL_FROM` | `Де Тернопіль <noreply@deternopil.pp.ua>`. |
| `RESEND_EMAIL_DOMAIN` | `deternopil.pp.ua`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical HTTPS URL, used in email links and metadata. |
| `NEXT_PUBLIC_SITE_DOMAIN_LABEL` | Public domain shown in the interface. |
| `DATABASE_SCHEMA_MODE` | Set to `external` after provisioning the complete schema, so normal requests do not execute DDL. |

Do not put connection strings, API keys, or administrator email addresses in
Git, `.openai/hosting.json`, or client-side variables.

## DNS at NIC.UA

The registrar must delegate `deternopil.pp.ua` to **NIC.UA nameservers** so the
active DNS zone is used. The zone needs the following website records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `162.159.143.30` |
| A | `@` | `172.66.3.26` |
| CNAME | `www` | `custom-domains.chatgpt.site.` |
| TXT | `_openai-site-verification` | Value from the Sites custom-domain settings for the apex. |
| TXT | `_cf-custom-hostname` | Value from the Sites custom-domain settings for the apex. |
| TXT | `_openai-site-verification.www` | Value from the Sites custom-domain settings for `www`. |
| TXT | `_cf-custom-hostname.www` | Value from the Sites custom-domain settings for `www`. |

The `resend._domainkey` TXT record, `send` MX record, and `send` TXT/SPF
record supplied by Resend must remain in the same active zone. Preserve any
unrelated inbound mail records. The apex also publishes `_dmarc` TXT
`v=DMARC1; p=none; pct=100` while mail authentication is monitored. After DNS
and TLS validation finish, set
`NEXT_PUBLIC_SITE_URL=https://deternopil.pp.ua` and
`NEXT_PUBLIC_SITE_DOMAIN_LABEL=deternopil.pp.ua`, then redeploy.

## Database permissions

`lib/database-core.ts` can bootstrap an empty local database when
`DATABASE_SCHEMA_MODE` is unset. For production, apply schema migrations with
the database owner using a direct connection. Once all tables, indexes, and
`auth_rate_limits` exist, set `DATABASE_SCHEMA_MODE=external`. Production uses
the SQL-created `deternopil_runtime` login for requests. The precise grants in
`docs/runtime-grants.sql` have been applied. This login has no membership in
`neon_superuser`, `CREATEDB`, `CREATEROLE`, schema `CREATE`, or rights to
future tables by default. Keep its password only in the secret server-side
`DATABASE_URL`; retain the owner login outside the request-serving environment.
Neon Console/API/CLI-created roles inherit `neon_superuser`, so create any
replacement runtime login with SQL and verify its attributes before granting
table permissions. Review permissions when the schema changes.

## Editorial updates

The bundled news, venues and events are concise, sourced starting content.
Use the admin panel's **Events** section to enter a title, description, start
and optional end date, location, cost and an HTTPS source URL. A published
event must have its date and source. After its end date it leaves the upcoming
list automatically and stays available in the event archive. Keep source pages
and venue details current; do not publish sample listings as real offers.

## Release checks

Run `npm test`, `npm run lint`, and `npm run build`; verify the public routes,
registration and email verification, login, password reset, and denied access
to `/admin` and protected APIs without an administrator session. Check Sites
worker logs after deployment. Existing expired or unpublished listings are
intentionally absent from the public marketplace.
