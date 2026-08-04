# Firestore schema

Документні ID бажано генерувати на сервері. Slug зберігається окремо і має унікальний індекс
у межах відповідної колекції.

## Core collections

### users/{uid}

- displayName
- email
- photoUrl
- phone
- preferredLanguage
- isBlocked
- createdAt
- updatedAt
- lastLoginAt

### userRoles/{uid}

- roles: `user | owner | moderator | admin`[]
- assignedBy
- assignedAt
- updatedAt

### news/{newsId}

- slug
- title
- shortDescription
- content
- coverImage
- gallery
- authorId
- categoryId
- tags
- status: `draft | pending | published | archived`
- isFeatured
- publishedAt
- createdAt
- updatedAt
- seoTitle
- seoDescription
- canonicalUrl
- viewCount

### newsCategories/{categoryId}

- slug
- title
- description
- sortOrder
- isActive

### places/{placeId}

- slug
- name
- shortDescription
- fullDescription
- categoryId
- subcategoryId
- ownerId
- logo
- coverImage
- gallery
- phone
- email
- website
- telegram
- instagram
- facebook
- address
- district
- latitude
- longitude
- geohash
- workingHours
- averagePrice
- paymentMethods
- features
- menuFiles
- rating
- reviewsCount
- status
- verificationStatus
- isFeatured
- createdAt
- updatedAt
- seoTitle
- seoDescription

### reviews/{reviewId}

- userId
- placeId
- rating
- text
- ownerReply
- status: `pending | approved | rejected | hidden | blocked`
- createdAt
- updatedAt

Constraint: one active approved/pending review per `userId + placeId`.

### listings/{listingId}

- slug
- userId
- title
- description
- price
- currency
- categoryId
- subcategoryId
- condition: `new | likeNew | used | needsRepair`
- images
- city
- district
- phone
- telegram
- instagram
- preferredContact
- status: `draft | pending | active | rejected | sold | archived | deleted`
- moderationStatus
- isFeatured
- views
- favoritesCount
- createdAt
- updatedAt
- expiresAt

## Other collections

- placeCategories
- placeClaims
- placeChangeRequests
- locations
- locationCategories
- events
- eventCategories
- listingCategories
- favorites
- reports
- notifications
- advertisements
- homepageSections
- auditLogs
- siteSettings
- moderationQueue

## Suggested subcollections

- users/{uid}/favorites/{favoriteId}
- users/{uid}/notifications/{notificationId}
- places/{placeId}/stats/daily
- places/{placeId}/staff/{staffUserId}

Subcollections are used where they reduce reads for private account pages.

## Initial indexes

- news: `status + publishedAt desc`
- news: `status + categoryId + publishedAt desc`
- places: `status + categoryId + rating desc`
- places: `status + district + rating desc`
- locations: `status + categoryId + createdAt desc`
- events: `status + startDate asc`
- listings: `status + categoryId + createdAt desc`
- listings: `status + price asc`
- reviews: `placeId + status + createdAt desc`
- moderationQueue: `status + entityType + createdAt asc`
- notifications: `userId + readAt + createdAt desc`
