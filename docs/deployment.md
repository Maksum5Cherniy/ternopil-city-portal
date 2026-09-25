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
`auth_rate_limits` exist, set `DATABASE_SCHEMA_MODE=external`. The current
deployment still uses the database owner login for queries. The proposed next
step is a separate Postgres login with only the table permissions the
application requires; a reviewable, unapplied grant script is in
`docs/runtime-grants.sql`. After approving and applying those grants, replace
the server-only `DATABASE_URL` with the dedicated login's connection string.
Keep the owner credential outside the request-serving environment after that
switch. Review permissions when changing the schema; do not give the runtime
role schema ownership or blanket privileges on future tables.

## Release checks

Run `npm test`, `npm run lint`, and `npm run build`; verify the public routes,
registration and email verification, login, password reset, and denied access
to `/admin` and protected APIs without an administrator session. Check Sites
worker logs after deployment. Existing expired or unpublished listings are
intentionally absent from the public marketplace.
