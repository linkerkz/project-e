import { z } from "zod";
import { isValidActivityDateTime } from "./utils";

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const capacity = z.preprocess(
  emptyToNull,
  z.coerce.number().int().positive().nullable(),
);

export const createActivitySchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  city: z.string().min(1, "Город обязателен"),
  location_text: z.string().optional(),
  starts_at: z
    .string()
    .min(1, "Дата обязательна")
    .refine(isValidActivityDateTime, "Введите корректные дату и время"),
  capacity,
  cover_url: z.string().optional(),
});

export const updateActivitySchema = createActivitySchema.extend({
  status: z.enum(["active", "cancelled"]),
});

export type CreateActivityFormInput = z.input<typeof createActivitySchema>;
export type CreateActivityForm = z.output<typeof createActivitySchema>;
export type UpdateActivityFormInput = z.input<typeof updateActivitySchema>;
export type UpdateActivityForm = z.output<typeof updateActivitySchema>;
