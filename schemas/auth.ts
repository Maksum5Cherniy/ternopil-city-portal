import { z } from "zod";

export const registerSchema = z
  .object({
    displayName: z.string().min(2, "Вкажіть ім'я або назву профілю").max(80),
    email: z.string().email("Вкажіть коректний email"),
    password: z.string().min(8, "Пароль має містити щонайменше 8 символів"),
    confirmPassword: z.string().min(8, "Повторіть пароль"),
    acceptTerms: z.boolean().refine(Boolean, "Потрібно прийняти правила користування"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Вкажіть коректний email"),
  password: z.string().min(1, "Вкажіть пароль"),
});

export const profileSchema = z.object({
  displayName: z.string().min(2, "Вкажіть назву профілю").max(80),
  phone: z.string().max(32).optional(),
  telegram: z.string().max(80).optional(),
  instagram: z.string().max(80).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
