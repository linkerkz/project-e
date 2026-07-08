import { z } from "zod";
import { optionalText } from "../../shared/lib/zodFields";

const socialsSchema = z.object({
  telegram: optionalText,
  instagram: optionalText,
  tiktok: optionalText,
  whatsapp: optionalText,
  discord: optionalText,
  website: optionalText,
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Имя обязательно"),
  city: optionalText,
  categories: z.array(z.string()).default([]),
  // Локальный URI выбранного фото (file://, content://, data:), а не web-ссылка —
  // строгую URL-валидацию не применяем, чтобы не отклонять валидные device-URI.
  photoUrl: optionalText,
  socials: socialsSchema,
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileForm = z.output<typeof profileSchema>;
