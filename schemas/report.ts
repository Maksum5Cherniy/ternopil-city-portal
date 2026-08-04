import { z } from "zod";

export const reportCreateSchema = z.object({
  entityType: z.enum(["listing", "place", "review"]),
  entityId: z.string().min(1).max(160),
  reason: z
    .string()
    .min(10, "Опишіть причину скарги щонайменше 10 символами")
    .max(1000, "Скарга не може бути довшою за 1000 символів"),
});

export type ReportCreateInput = z.infer<typeof reportCreateSchema>;
