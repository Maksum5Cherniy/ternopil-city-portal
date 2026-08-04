import { z } from "zod";

export const ownerClaimSchema = z.object({
  placeName: z.string().min(2, "Вкажіть назву закладу").max(140),
  businessEmail: z.string().email("Вкажіть коректний email закладу").optional().or(z.literal("")),
  phone: z.string().max(32).optional(),
  address: z.string().max(200).optional(),
  website: z.string().url("Вкажіть коректне посилання").optional().or(z.literal("")),
  message: z.string().max(1200).optional(),
});

export type OwnerClaimInput = z.infer<typeof ownerClaimSchema>;
