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

export const adminContentTypeSchema = z.enum(["news", "place", "ad", "home"]);
export const adminContentStatusSchema = z.enum(["draft", "published", "archived"]);

export const adminContentUpsertSchema = z.object({
  id: z.string().min(1).optional(),
  type: adminContentTypeSchema,
  title: z.string().min(2, "Вкажіть назву").max(160),
  summary: z.string().max(800).optional(),
  href: z.string().max(300).optional(),
  status: adminContentStatusSchema,
  orderIndex: z.coerce.number().int().min(0).max(9999).optional(),
  notes: z.string().max(1200).optional(),
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
export type OwnerClaimModerationInput = z.infer<typeof ownerClaimModerationSchema>;
export type ReportModerationInput = z.infer<typeof reportModerationSchema>;
export type ReviewModerationInput = z.infer<typeof reviewModerationSchema>;
export type AdminContentUpsertInput = z.infer<typeof adminContentUpsertSchema>;
export type AdminContentStatusUpdateInput = z.infer<typeof adminContentStatusUpdateSchema>;
export type AdminContentDeleteInput = z.infer<typeof adminContentDeleteSchema>;
export type SiteSettingsUpdateInput = z.infer<typeof siteSettingsUpdateSchema>;
export type SystemNotificationInput = z.infer<typeof systemNotificationSchema>;
export type AdminNotificationDeleteInput = z.infer<typeof adminNotificationDeleteSchema>;
