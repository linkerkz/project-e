import type { ProfileSocials, SocialNetwork } from "./types";

const categoryNames = [
  "Спорт",
  "Музыка",
  "Образование",
  "Нетворкинг",
  "Игры",
  "Искусство",
  "Еда",
  "Путешествия",
  "Технологии",
  "Волонтёрство",
];

export const categoryOptions = categoryNames.map((name) => ({
  value: name,
  label: name,
}));

type SocialOption = {
  key: SocialNetwork;
  label: string;
  placeholder: string;
};

export const socialOptions: SocialOption[] = [
  { key: "telegram", label: "Telegram", placeholder: "@username или ссылка" },
  { key: "instagram", label: "Instagram", placeholder: "@username или ссылка" },
  { key: "tiktok", label: "TikTok", placeholder: "@username или ссылка" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "номер или ссылка" },
  {
    key: "discord",
    label: "Discord",
    placeholder: "ник или ссылка-приглашение",
  },
  { key: "website", label: "Сайт", placeholder: "https://example.com" },
];

// Только заполненные соц.ссылки в порядке словаря — для рендера и перехода наружу.
export function getFilledSocials(socials: ProfileSocials) {
  const filled: { key: SocialNetwork; label: string; url: string }[] = [];
  for (const { key, label } of socialOptions) {
    const url = socials[key];
    if (url != null) filled.push({ key, label, url });
  }
  return filled;
}

export function formatRegisteredAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return `${padDatePart(date.getDate())}.${padDatePart(
    date.getMonth() + 1,
  )}.${date.getFullYear()}`;
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}
