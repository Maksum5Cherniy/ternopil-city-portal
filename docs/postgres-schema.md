# Postgres schema

Схема створюється автоматично через `ensureDatabaseSchema()` перед server-side auth/database операціями. ID генеруються на сервері через `crypto.randomUUID()`. Slug зберігається окремо і має унікальний індекс у відповідній таблиці.

## users

- `id text primary key`
- `email text unique not null`
- `password_hash text not null`
- `display_name text not null`
- `phone text`
- `telegram text`
- `instagram text`
- `roles text[] not null default array['user']`
- `email_verified boolean not null default false`
- `email_verified_at timestamptz`
- `seller_status text not null default 'active'`
- `is_blocked boolean not null default false`
- `blocked_reason text`
- `profile_completed boolean not null default false`
- `last_login_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

## auth_sessions

- `token_hash text primary key`
- `user_id text not null references users(id) on delete cascade`
- `expires_at timestamptz not null`
- `created_at timestamptz not null default now()`

Індекси:

- `auth_sessions_user_id_idx`
- `auth_sessions_expires_at_idx`

## email_verification_tokens

- `token_hash text primary key`
- `user_id text not null references users(id) on delete cascade`
- `expires_at timestamptz not null`
- `consumed_at timestamptz`
- `created_at timestamptz not null default now()`

## listings

- `id text primary key`
- `slug text unique not null`
- `user_id text not null references users(id) on delete cascade`
- `title text not null`
- `description text not null`
- `price numeric`
- `currency text not null default 'UAH'`
- `category_id text not null`
- `condition text not null`
- `district text`
- `phone text`
- `telegram text`
- `instagram text`
- `preferred_contact text not null default 'phone'`
- `city text not null default 'Тернопіль'`
- `images jsonb not null default '[]'`
- `status text not null default 'pending'`
- `moderation_status text not null default 'pending'`
- `moderation_comment text`
- `moderated_by text references users(id) on delete set null`
- `moderated_at timestamptz`
- `is_featured boolean not null default false`
- `views integer not null default 0`
- `favorites_count integer not null default 0`
- `expires_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Індекси:

- `listings_status_created_idx`
- `listings_category_created_idx`
- `listings_user_created_idx`

## Workflow tables

Додані production-таблиці для ролей і workflow:

- `seller_profiles`
- `owner_claims`
- `reports`
- `notifications`
- `audit_logs`

## reports

- `id text primary key`
- `reporter_id text references users(id) on delete set null`
- `entity_type text not null`
- `entity_id text not null`
- `reason text not null`
- `status text not null default 'pending'`
- `moderation_comment text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Індекси:

- `reports_status_idx`
- `reports_entity_idx`

## notifications

- `id text primary key`
- `user_id text not null references users(id) on delete cascade`
- `type text not null`
- `title text not null`
- `body text not null`
- `read_at timestamptz`
- `created_at timestamptz not null default now()`

Індекси:

- `notifications_user_idx`

Для повного production-порталу ще треба додати:

- `news`, `news_categories`
- `places`, `place_categories`, `place_claims`, `place_change_requests`
- `locations`, `location_categories`
- `events`, `event_categories`
- `reviews`
- `favorites`
- `advertisements`
- `homepage_sections`
- `site_settings`
- `moderation_queue`
