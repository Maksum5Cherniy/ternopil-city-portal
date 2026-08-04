import { z } from "zod";

const idSchema = z.string().min(1);
const slugSchema = z
  .string()
  .min(3)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const mediaAssetSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(3).max(160),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  sourceUrl: z.string().url().optional(),
});

export const publishStatusSchema = z.enum(["draft", "pending", "published", "archived"]);
export const moderationStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "hidden",
  "blocked",
]);

const seoFieldsSchema = z.object({
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional(),
});

const timestampFieldsSchema = z.object({
  id: idSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const newsArticleSchema = timestampFieldsSchema.merge(seoFieldsSchema).extend({
  slug: slugSchema,
  title: z.string().min(5).max(120),
  shortDescription: z.string().min(20).max(240),
  content: z.string().min(80),
  coverImage: mediaAssetSchema.optional(),
  gallery: z.array(mediaAssetSchema).max(10).default([]),
  authorId: idSchema,
  categoryId: idSchema,
  tags: z.array(z.string().min(2).max(32)).max(12).default([]),
  status: publishStatusSchema,
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  viewCount: z.number().int().nonnegative().default(0),
});

export const placeSchema = timestampFieldsSchema.merge(seoFieldsSchema).extend({
  slug: slugSchema,
  name: z.string().min(2).max(120),
  shortDescription: z.string().min(20).max(220),
  fullDescription: z.string().min(80).max(5000),
  categoryId: idSchema,
  subcategoryId: idSchema.optional(),
  ownerId: idSchema.optional(),
  logo: mediaAssetSchema.optional(),
  coverImage: mediaAssetSchema.optional(),
  gallery: z.array(mediaAssetSchema).max(12).default([]),
  phone: z.string().max(32).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  telegram: z.string().max(80).optional(),
  instagram: z.string().max(80).optional(),
  facebook: z.string().url().optional(),
  address: z.string().min(5).max(180),
  district: z.string().max(80).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  workingHours: z.record(z.string(), z.string()).optional(),
  averagePrice: z.string().max(80).optional(),
  paymentMethods: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  menuFiles: z.array(mediaAssetSchema).max(5).default([]),
  rating: z.number().min(0).max(5).default(0),
  reviewsCount: z.number().int().nonnegative().default(0),
  status: publishStatusSchema,
  verificationStatus: moderationStatusSchema,
  isFeatured: z.boolean().default(false),
});

export const listingSchema = timestampFieldsSchema.extend({
  slug: slugSchema,
  userId: idSchema,
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(3000),
  price: z.number().nonnegative(),
  currency: z.enum(["UAH", "USD", "EUR"]).default("UAH"),
  categoryId: idSchema,
  subcategoryId: idSchema.optional(),
  condition: z.enum(["new", "likeNew", "used", "needsRepair"]),
  images: z.array(mediaAssetSchema).max(8).default([]),
  city: z.string().default("Тернопіль"),
  district: z.string().max(80).optional(),
  phone: z.string().max(32).optional(),
  telegram: z.string().max(80).optional(),
  instagram: z.string().max(80).optional(),
  preferredContact: z.enum(["phone", "telegram", "instagram", "other"]),
  status: z.enum(["draft", "pending", "active", "rejected", "sold", "archived", "deleted"]),
  moderationStatus: moderationStatusSchema,
  isFeatured: z.boolean().default(false),
  views: z.number().int().nonnegative().default(0),
  favoritesCount: z.number().int().nonnegative().default(0),
  expiresAt: z.string().datetime(),
});

export const reviewSchema = timestampFieldsSchema.extend({
  userId: idSchema,
  placeId: idSchema,
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  text: z.string().min(10).max(2000),
  ownerReply: z.string().min(2).max(1500).optional(),
  status: moderationStatusSchema,
});

export type NewsArticleInput = z.infer<typeof newsArticleSchema>;
export type PlaceInput = z.infer<typeof placeSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
