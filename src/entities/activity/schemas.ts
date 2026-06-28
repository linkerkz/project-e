import { z } from "zod";
import { isValidActivityDateTime } from "./utils";

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const optionalText = z.preprocess(emptyToNull, z.string().nullable());
const capacity = z.preprocess(
  emptyToNull,
  z.coerce.number().int().positive().nullable(),
);
const optionalUrl = z.preprocess(
  emptyToNull,
  z.string().url("Введите корректную ссылку").nullable(),
);

const chatHosts = [
  "t.me",
  "telegram.me",
  "telegram.dog",
  "wa.me",
  "chat.whatsapp.com",
  "whatsapp.com",
  "discord.gg",
  "discord.com",
  "discordapp.com",
  "signal.group",
  "signal.me",
];

const chatUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .url("Введите корректную ссылку")
    .refine(
      isKnownChatHost,
      "Ссылка должна вести в Telegram, WhatsApp, Discord или Signal",
    )
    .nullable(),
);

function isKnownChatHost(value: string) {
  let host: string;
  try {
    host = new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return false;
  }
  return chatHosts.includes(host);
}

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
  cover_url: optionalUrl,
  chat_url: chatUrl,
});

export const updateActivitySchema = createActivitySchema.extend({
  status: z.enum(["active", "cancelled"]),
});

export type CreateActivityFormInput = z.input<typeof createActivitySchema>;
export type CreateActivityForm = z.output<typeof createActivitySchema>;
export type UpdateActivityFormInput = z.input<typeof updateActivitySchema>;
export type UpdateActivityForm = z.output<typeof updateActivitySchema>;
