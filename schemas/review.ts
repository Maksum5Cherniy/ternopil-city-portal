import { z } from "zod";

export const reviewCreateSchema = z.object({
  targetHref: z.string().min(1).max(300),
  targetTitle: z.string().min(2).max(160),
  rating: z.coerce.number().int().min(1, "Оберіть оцінку").max(5, "Оцінка має бути від 1 до 5"),
  text: z
    .string()
    .min(10, "Напишіть відгук щонайменше 10 символів")
    .max(2000, "Відгук не може бути довшим за 2000 символів"),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
