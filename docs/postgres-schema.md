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
- `is_blocked boolean not null default false`
- `profile_completed boolean not null default false`
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

## Наступні таблиці

Для повного production-порталу треба додати:

- `news`, `news_categories`
- `places`, `place_categories`, `place_claims`, `place_change_requests`
- `locations`, `location_categories`
- `events`, `event_categories`
- `reviews`
- `favorites`
- `reports`
- `notifications`
- `advertisements`
- `homepage_sections`
- `audit_logs`
- `site_settings`
- `moderation_queue`
