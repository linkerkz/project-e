import { z } from "zod";
import { categoryKeys } from "../../shared/lib/categories";
import { isValidDateTime } from "../../shared/lib/datetime";
import {
  capacity,
  chatUrl,
  optionalText,
  optionalUrl,
} from "../../shared/lib/zodFields";

export const createActivitySchema = z.object({
  title: z.string().trim().min(1, "Название обязательно"),
  description: optionalText,
  city: z.string().trim().min(1, "Город обязателен"),
  location_text: optionalText,
  starts_at: z
    .string()
    .min(1, "Дата обязательна")
    .refine(isValidDateTime, "Введите корректные дату и время"),
  capacity,
  cover_url: optionalUrl,
  chat_url: chatUrl,
  category: z.string().min(1, "Выберите категорию").pipe(z.enum(categoryKeys)),
  allow_maybe: z.boolean().default(true),
  is_free: z.boolean().default(true),
});

export const updateActivitySchema = createActivitySchema.extend({
  status: z.enum(["active", "cancelled"]),
});

export type CreateActivityFormInput = z.input<typeof createActivitySchema>;
export type CreateActivityForm = z.output<typeof createActivitySchema>;
export type UpdateActivityFormInput = z.input<typeof updateActivitySchema>;
export type UpdateActivityForm = z.output<typeof updateActivitySchema>;
