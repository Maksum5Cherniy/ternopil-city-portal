import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const listingCreateSchema = z
  .object({
    title: z.string().trim().min(5, "Назва має містити щонайменше 5 символів").max(120),
    description: z.string().trim().min(20, "Опис має містити щонайменше 20 символів").max(3000),
    price: z.coerce.number().min(0, "Ціна не може бути від'ємною").max(10_000_000),
    categoryId: z.string().trim().min(1, "Оберіть категорію"),
    condition: z.enum(["new", "likeNew", "used", "needsRepair"]),
    district: optionalText(80),
    phone: optionalText(32),
    telegram: optionalText(80),
    instagram: optionalText(80),
    preferredContact: z.enum(["phone", "telegram", "instagram", "other"]),
  })
  .superRefine((data, ctx) => {
    const hasPhone = Boolean(data.phone?.trim());
    const hasTelegram = Boolean(data.telegram?.trim());
    const hasInstagram = Boolean(data.instagram?.trim());

    if (!hasPhone && !hasTelegram && !hasInstagram) {
      ctx.addIssue({
        code: "custom",
        path: ["preferredContact"],
        message: "Додайте хоча б один контакт для покупця.",
      });
    }

    if (data.preferredContact === "phone" && !hasPhone) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Вкажіть телефон або змініть бажаний спосіб зв'язку.",
      });
    }

    if (data.preferredContact === "telegram" && !hasTelegram) {
      ctx.addIssue({
        code: "custom",
        path: ["telegram"],
        message: "Вкажіть Telegram або змініть бажаний спосіб зв'язку.",
      });
    }

    if (data.preferredContact === "instagram" && !hasInstagram) {
      ctx.addIssue({
        code: "custom",
        path: ["instagram"],
        message: "Вкажіть Instagram або змініть бажаний спосіб зв'язку.",
      });
    }
  });

export const listingStatusUpdateSchema = z.object({
  status: z.enum(["pending", "sold", "archived", "deleted"]),
});

export type ListingCreateInput = z.infer<typeof listingCreateSchema>;
export type ListingStatusUpdateInput = z.infer<typeof listingStatusUpdateSchema>;
