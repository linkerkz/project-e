import { z } from "zod";

const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);

export const optionalText = z.preprocess(emptyToNull, z.string().nullable());

export const capacity = z.preprocess(
  emptyToNull,
  z.coerce.number().int().positive().nullable(),
);

export const optionalUrl = z.preprocess(
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

export const chatUrl = z.preprocess(
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
