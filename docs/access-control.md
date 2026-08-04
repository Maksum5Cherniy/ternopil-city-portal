# Ролі та права доступу

## Roles

- guest
- user
- owner
- moderator
- admin

## Public access

Guest can read only published/active public documents:

- published news
- published places
- published locations
- active future events
- active listings
- approved reviews
- public categories and tags

Guest cannot write.

## User

User can:

- update own profile;
- manage own favorites;
- create, edit, sell and archive own listings;
- create one active review per place;
- edit/delete own review within policy limits;
- create reports;
- read own notifications and moderation statuses.

User cannot approve own content, modify ratings directly or read other users' private data.

Profile creation flow:

1. `/register` creates a Firebase Authentication user.
2. The client creates `users/{uid}` with base public profile fields.
3. The default role is `user`.
4. Login/register sync the Firebase ID token to `/api/auth/session`, which creates the httpOnly
   `de_ternopil_session` cookie for server-side page checks.
5. Role changes must stay protected through Firestore Rules, server actions or Admin SDK scripts so
   clients cannot promote themselves.

## Owner

Owner includes user permissions and can:

- create place ownership claim;
- edit managed place via `placeChangeRequests`;
- upload limited gallery/menu assets for managed place;
- create place promotions and events;
- reply to reviews for managed place;
- read managed place stats;
- manage limited staff roles for managed place.

Important changes are stored as change requests and need moderation before public publishing.

## Moderator

Moderator can:

- read moderation queues;
- approve/reject listings, reviews, reports and place changes;
- hide or block violating content;
- write moderation comments and rejection reasons;
- read moderation logs.

Moderator cannot assign admin roles, edit site settings or bypass audit logging.

## Admin

Admin can manage:

- users and roles;
- all content collections;
- categories and tags;
- advertisements;
- homepage sections;
- moderation;
- system settings;
- statistics;
- blocking;
- audit log review.

Every important admin action writes to `auditLogs`.

## Server enforcement

Security layers:

1. Server role check in route handlers/server actions. `/admin` already verifies the session cookie
   through Firebase Admin SDK before rendering.
2. Zod validation before every write.
3. Repository ownership checks before mutations.
4. Firestore Rules as client-access boundary.
5. Audit log write for privileged actions.
