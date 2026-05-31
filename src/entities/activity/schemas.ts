import { z } from "zod";
import { isValidActivityDateTime } from "./utils";

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const optionalText = z.preprocess(emptyToNull, z.string().nullable());
const capacity = z.preprocess(
  emptyToNull,
  z.coerce.number().int().positive().nullable(),
);
const coverUrl = z.preprocess(
  emptyToNull,
  z.string().url("Введите корректную ссылку").nullable(),
);

export const createActivitySchema = z.object({
  title: z.string().trim().min(1, "Название обязательно"),
  description: optionalText,
  city: z.string().trim().min(1, "Город обязателен"),
  location_text: optionalText,
  starts_at: z
    .string()
    .min(1, "Дата обязательна")
    .refine(isValidActivityDateTime, "Введите корректные дату и время"),
  capacity,
  cover_url: coverUrl,
});

export const updateActivitySchema = createActivitySchema.extend({
  status: z.enum(["active", "cancelled"]),
});

export type CreateActivityFormInput = z.input<typeof createActivitySchema>;
export type CreateActivityForm = z.output<typeof createActivitySchema>;
export type UpdateActivityFormInput = z.input<typeof updateActivitySchema>;
export type UpdateActivityForm = z.output<typeof updateActivitySchema>;
