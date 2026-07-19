import type { CategoryKey } from "../../shared/lib/categories";

export type Profile = {
  fullName: string;
  city: string | null;
  categories: CategoryKey[];
  photoUrl: string | null;
  socials: ProfileSocials;
  registeredAt: string;
};

// Что уходит в хранилище при сохранении: профиль без даты регистрации —
// её проставляет storage при первом сохранении на устройстве.
export type SaveProfileInput = Omit<Profile, "registeredAt">;

export type ProfileSocials = Record<SocialNetwork, string | null>;

export type SocialNetwork =
  | "telegram"
  | "instagram"
  | "tiktok"
  | "whatsapp"
  | "discord"
  | "website";
