import { adminDb } from "../firebase/firebaseAdmin";
import {
  eventCategories,
  events,
  listingCategories,
  listings,
  locationCategories,
  locations,
  newsCategories,
  newsItems,
  placeCategories,
  places,
} from "../constants/content";

const now = new Date().toISOString();

const testUsers = [
  {
    uid: "seed-user",
    displayName: "Тестовий користувач",
    email: "user@example.test",
    roles: ["user"],
  },
  {
    uid: "seed-owner",
    displayName: "Тестовий власник",
    email: "owner@example.test",
    roles: ["user", "owner"],
  },
  {
    uid: "seed-moderator",
    displayName: "Тестовий модератор",
    email: "moderator@example.test",
    roles: ["moderator"],
  },
  {
    uid: "seed-admin",
    displayName: "Тестовий адміністратор",
    email: "admin@example.test",
    roles: ["admin"],
  },
];

async function writeCollection<T extends { slug?: string; uid?: string }>(
  collectionName: string,
  items: T[],
  getId: (item: T, index: number) => string,
) {
  const batch = adminDb.batch();

  items.forEach((item, index) => {
    const ref = adminDb.collection(collectionName).doc(getId(item, index));
    batch.set(
      ref,
      {
        ...item,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  await batch.commit();
}

async function run() {
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.log("FIREBASE_PROJECT_ID is missing. Add .env.local values before running seed.");
    return;
  }

  await writeCollection(
    "newsCategories",
    newsCategories,
    (item) => item.slug || crypto.randomUUID(),
  );
  await writeCollection(
    "placeCategories",
    placeCategories,
    (item) => item.slug || crypto.randomUUID(),
  );
  await writeCollection(
    "locationCategories",
    locationCategories,
    (item) => item.slug || crypto.randomUUID(),
  );
  await writeCollection(
    "eventCategories",
    eventCategories,
    (item) => item.slug || crypto.randomUUID(),
  );
  await writeCollection(
    "listingCategories",
    listingCategories,
    (item) => item.slug || crypto.randomUUID(),
  );

  await writeCollection("news", newsItems, (item) => item.slug || crypto.randomUUID());
  await writeCollection("places", places, (item) => item.slug || crypto.randomUUID());
  await writeCollection("locations", locations, (item) => item.slug || crypto.randomUUID());
  await writeCollection("events", events, (item) => item.slug || crypto.randomUUID());
  await writeCollection("listings", listings, (item) => item.slug || crypto.randomUUID());

  await writeCollection("users", testUsers, (item) => item.uid || crypto.randomUUID());
  await writeCollection(
    "userRoles",
    testUsers.map((user) => ({ uid: user.uid, roles: user.roles })),
    (item) => item.uid || crypto.randomUUID(),
  );

  await writeCollection(
    "homepageSections",
    [
      { slug: "hero", title: "Головний екран", sortOrder: 1, isActive: true },
      { slug: "news", title: "Останні новини", sortOrder: 2, isActive: true },
      { slug: "places", title: "Популярні заклади", sortOrder: 3, isActive: true },
      { slug: "events", title: "Найближчі події", sortOrder: 4, isActive: true },
      { slug: "market", title: "Барахолка", sortOrder: 5, isActive: true },
    ],
    (item) => item.slug || crypto.randomUUID(),
  );

  console.log("Seed data written successfully.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
