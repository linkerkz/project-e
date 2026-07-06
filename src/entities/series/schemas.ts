import { z } from "zod";
import { isValidDateTime } from "../../shared/lib/datetime";
import {
  capacity,
  chatUrl,
  optionalText,
  optionalUrl,
} from "../../shared/lib/zodFields";

const recurrenceEnd = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("never") }),
  z.object({
    kind: z.literal("until"),
    date: z
      .string()
      .min(1, "Укажите дату окончания")
      .refine(isValidDateTime, "Введите корректную дату"),
  }),
  z.object({
    kind: z.literal("count"),
    count: z.coerce
      .number()
      .int()
      .positive("Число встреч должно быть больше нуля"),
  }),
]);

const recurrence = z
  .object({
    interval: z.coerce
      .number()
      .int()
      .positive("Интервал должен быть больше нуля"),
    unit: z.enum(["day", "week", "month"]),
    weekdays: z.array(z.number().int().min(0).max(6)).default([]),
    end: recurrenceEnd,
  })
  .refine((rule) => rule.unit !== "week" || rule.weekdays.length > 0, {
    message: "Выберите хотя бы один день недели",
    path: ["weekdays"],
  });

export const createSeriesSchema = z.object({
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
  recurrence,
});

export const updateSeriesSchema = createSeriesSchema.extend({
  status: z.enum(["active", "finished"]),
});

export const joinSeriesSchema = z.object({
  name: z.string().trim().min(1, "Имя обязательно"),
  telegram: z.string().optional(),
});

export type CreateSeriesFormInput = z.input<typeof createSeriesSchema>;
export type CreateSeriesForm = z.output<typeof createSeriesSchema>;
export type UpdateSeriesFormInput = z.input<typeof updateSeriesSchema>;
export type UpdateSeriesForm = z.output<typeof updateSeriesSchema>;
export type JoinSeriesForm = z.infer<typeof joinSeriesSchema>;
