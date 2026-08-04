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

export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
export type ListingModerationInput = z.infer<typeof listingModerationSchema>;
export type OwnerClaimModerationInput = z.infer<typeof ownerClaimModerationSchema>;
