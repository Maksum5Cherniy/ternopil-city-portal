import assert from "node:assert/strict";
import test from "node:test";
import { getCityDate, getUpcomingEvents } from "../constants/content";
import { adminContentUpsertSchema } from "../schemas/admin";

const baseEvent = {
  type: "event",
  title: "Перевірена подія",
  summary: "Опис",
  href: "",
  status: "published",
  eventDate: "2026-09-26",
  eventEndDate: "2026-09-27",
  sourceUrl: "https://example.org/events/1",
  eventCategory: "festivals",
} as const;

test("a multi-day event stays upcoming through its last day", () => {
  assert.equal(
    getUpcomingEvents("2026-09-27").some(
      (event) => event.slug === "juniors-games-ternopil-2026",
    ),
    true,
  );
  assert.equal(getUpcomingEvents("2026-09-28").length, 0);
});

test("event dates use the city's local day around midnight", () => {
  assert.equal(getCityDate(new Date("2026-09-24T22:30:00Z")), "2026-09-25");
});

test("published events require a valid date and HTTPS source", () => {
  assert.equal(adminContentUpsertSchema.safeParse(baseEvent).success, true);
  assert.equal(
    adminContentUpsertSchema.safeParse({
      ...baseEvent,
      eventEndDate: "2026-09-25",
    }).success,
    false,
  );
  assert.equal(
    adminContentUpsertSchema.safeParse({ ...baseEvent, sourceUrl: "" }).success,
    false,
  );
  assert.equal(
    adminContentUpsertSchema.safeParse({
      ...baseEvent,
      href: "javascript:alert(1)",
    }).success,
    false,
  );
  assert.equal(
    adminContentUpsertSchema.safeParse({
      ...baseEvent,
      href: "//attacker.example",
    }).success,
    false,
  );
});

test("a place needs both coordinates inside the city", () => {
  const place = {
    type: "place",
    title: "Заклад у Тернополі",
    status: "draft",
    placeCategory: "kaviarni",
    placeLatitude: "49.5535",
    placeLongitude: "25.5948",
  };
  assert.equal(adminContentUpsertSchema.safeParse(place).success, true);
  assert.equal(
    adminContentUpsertSchema.safeParse({ ...place, placeLongitude: "" })
      .success,
    false,
  );
  assert.equal(
    adminContentUpsertSchema.safeParse({ ...place, placeLatitude: "48" })
      .success,
    false,
  );
});
