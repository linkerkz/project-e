import type { ProfileFormInput } from "./schemas";
import type { Profile, ProfileSocials } from "./types";

// Профиль из хранилища → значения формы: `null` в текстовых полях и соц.ссылках
// превращаем в пустую строку, чтобы поля редактировались как обычный текст.
export function mapProfileToForm(profile: Profile): ProfileFormInput {
  return {
    fullName: profile.fullName,
    city: profile.city ?? "",
    categories: profile.categories,
    photoUrl: profile.photoUrl ?? "",
    socials: mapSocialsToForm(profile.socials),
  };
}

function mapSocialsToForm(socials: ProfileSocials) {
  return {
    telegram: socials.telegram ?? "",
    instagram: socials.instagram ?? "",
    tiktok: socials.tiktok ?? "",
    whatsapp: socials.whatsapp ?? "",
    discord: socials.discord ?? "",
    website: socials.website ?? "",
  };
}
