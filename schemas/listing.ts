import { z } from "zod";

export const listingCreateSchema = z.object({
  title: z.string().min(5, "Назва має містити щонайменше 5 символів").max(120),
  description: z.string().min(20, "Опис має містити щонайменше 20 символів").max(3000),
  price: z.coerce.number().min(0, "Ціна не може бути від'ємною"),
  categoryId: z.string().min(1, "Оберіть категорію"),
  condition: z.enum(["new", "likeNew", "used", "needsRepair"]),
  district: z.string().max(80).optional(),
  phone: z.string().max(32).optional(),
  telegram: z.string().max(80).optional(),
  instagram: z.string().max(80).optional(),
  preferredContact: z.enum(["phone", "telegram", "instagram", "other"]),
});

export type ListingCreateInput = z.infer<typeof listingCreateSchema>;
