import { z } from "zod";

export const userRoleSchema = z.enum(["user", "owner", "moderator", "admin"]);

export const adminUserUpdateSchema = z.object({
  userId: z.string().min(1),
  roles: z.array(userRoleSchema).min(1, "Користувач має мати хоча б одну роль"),
  isBlocked: z.boolean(),
  blockedReason: z.string().max(300).optional(),
  sellerStatus: z.enum(["active", "suspended"]),
});

export const listingModerationSchema = z.object({
  listingId: z.string().min(1),
  moderationStatus: z.enum(["approved", "rejected", "hidden", "blocked"]),
  comment: z.string().max(500).optional(),
});

export const ownerClaimModerationSchema = z.object({
  claimId: z.string().min(1),
  status: z.enum(["approved", "rejected"]),
  comment: z.string().max(500).optional(),
});

export const reportModerationSchema = z.object({
  reportId: z.string().min(1),
  status: z.enum(["reviewed", "dismissed", "blocked"]),
  comment: z.string().max(500).optional(),
});

export const reviewModerationSchema = z.object({
  reviewId: z.string().min(1),
  status: z.enum(["approved", "rejected", "hidden", "blocked"]),
  comment: z.string().max(500).optional(),
});

export const adminContentTypeSchema = z.enum([
  "news",
  "place",
  "event",
  "ad",
  "home",
]);
export const adminContentStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
]);

export const adminContentUpsertSchema = z
  .object({
    id: z.string().min(1).optional(),
    type: adminContentTypeSchema,
    title: z.string().min(2, "Вкажіть назву").max(160),
    summary: z.string().max(800).optional(),
    href: z
      .string()
      .max(300)
      .refine(
        (href) =>
          !href ||
          /^\/(?!\/)[^\\\s]*$/.test(href) ||
          /^https:\/\/[^\s]+$/i.test(href),
        "Дозволено лише внутрішній шлях або HTTPS-посилання",
      )
      .optional(),
    status: adminContentStatusSchema,
    orderIndex: z.coerce.number().int().min(0).max(9999).optional(),
    notes: z.string().max(1200).optional(),
    eventDate: z.iso.date().or(z.literal("")).optional(),
    eventEndDate: z.iso.date().or(z.literal("")).optional(),
    eventLocation: z.string().max(200).optional(),
    eventPrice: z.string().max(100).optional(),
    sourceUrl: z
      .union([
        z.literal(""),
        z.url().refine((url) => url.startsWith("https://")),
      ])
      .optional(),
    eventCategory: z
      .enum(["concerts", "festivals", "children", "sport", "workshops"])
      .optional(),
    placeCategory: z
      .enum(["restaurants", "kaviarni", "sport", "shops", "services"])
      .optional(),
    placeAddress: z.string().max(200).optional(),
    placePhone: z
      .string()
      .max(40)
      .regex(/^[+\d\s()-]*$/)
      .optional(),
    placeLatitude: z
      .string()
      .refine(
        (value) => !value || (Number(value) >= 49.4 && Number(value) <= 49.7),
        "Координата має бути в межах Тернополя",
      )
      .optional(),
    placeLongitude: z
      .string()
      .refine(
        (value) => !value || (Number(value) >= 25.4 && Number(value) <= 25.8),
        "Координата має бути в межах Тернополя",
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "place" &&
      Boolean(data.placeLatitude) !== Boolean(data.placeLongitude)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["placeLatitude"],
        message: "Вкажіть обидві координати або залиште обидва поля порожніми",
      });
    }
    if (data.type !== "event") return;
    if (data.href && !/^\/events\/[a-z0-9][a-z0-9-]*$/.test(data.href)) {
      ctx.addIssue({
        code: "custom",
        path: ["href"],
        message: "Для події залиште шлях порожнім або вкажіть /events/slug",
      });
    }
    if (!data.eventDate)
      ctx.addIssue({
        code: "custom",
        path: ["eventDate"],
        message: "Вкажіть дату події",
      });
    if (
      data.eventEndDate &&
      data.eventDate &&
      data.eventEndDate < data.eventDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["eventEndDate"],
        message: "Дата завершення має бути не раніше початку",
      });
    }
    if (data.status === "published" && !data.sourceUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["sourceUrl"],
        message: "Для публікації події потрібне HTTPS-посилання на джерело",
      });
    }
  });

export const adminContentStatusUpdateSchema = z.object({
  id: z.string().min(1),
  status: adminContentStatusSchema,
});

export const adminContentDeleteSchema = z.object({
  id: z.string().min(1),
});

export const siteSettingKeySchema = z.enum([
  "site_title",
  "site_description",
  "contact_telegram",
  "seo_keywords",
  "homepage_notice",
]);

export const siteSettingsUpdateSchema = z.object({
  settings: z
    .array(
      z.object({
        key: siteSettingKeySchema,
        value: z.string().max(2000),
      }),
    )
    .min(1),
});

export const systemNotificationSchema = z.object({
  target: z.enum(["all", "admins", "moderators", "owners", "users"]),
  title: z.string().min(2, "Вкажіть заголовок").max(160),
  body: z.string().min(2, "Вкажіть текст").max(1000),
});

export const adminNotificationDeleteSchema = z.object({
  id: z.string().min(1),
});

export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
export type ListingModerationInput = z.infer<typeof listingModerationSchema>;
export type OwnerClaimModerationInput = z.infer<
  typeof ownerClaimModerationSchema
>;
export type ReportModerationInput = z.infer<typeof reportModerationSchema>;
export type ReviewModerationInput = z.infer<typeof reviewModerationSchema>;
export type AdminContentUpsertInput = z.infer<typeof adminContentUpsertSchema>;
export type AdminContentStatusUpdateInput = z.infer<
  typeof adminContentStatusUpdateSchema
>;
export type AdminContentDeleteInput = z.infer<typeof adminContentDeleteSchema>;
export type SiteSettingsUpdateInput = z.infer<typeof siteSettingsUpdateSchema>;
export type SystemNotificationInput = z.infer<typeof systemNotificationSchema>;
export type AdminNotificationDeleteInput = z.infer<
  typeof adminNotificationDeleteSchema
>;
