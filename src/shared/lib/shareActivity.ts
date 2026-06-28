import { Platform, Share } from "react-native";
import { getRussianErrorMessage } from "../errors/getRussianErrorMessage";
import { buildActivityPublicUrl } from "./buildActivityPublicUrl";

// Результат шеринга для UI: открыли системный лист, скопировали в буфер
// (веб-фолбэк) или ошибка с уже русским сообщением.
export type ShareResult =
  | { kind: "shared" }
  | { kind: "copied" }
  | { kind: "error"; message: string };

type Params = {
  slug: string;
  title: string;
};

export async function shareActivity({
  slug,
  title,
}: Params): Promise<ShareResult> {
  const url = buildActivityPublicUrl(slug);
  if (shouldCopyInstead()) return copyLink(url);

  return openShareSheet({ title, url });
}

// На вебе без системного шеринга падать нельзя — копируем ссылку в буфер.
function shouldCopyInstead() {
  if (Platform.OS !== "web") return false;
  return typeof navigator === "undefined" || navigator.share === undefined;
}

async function openShareSheet({
  title,
  url,
}: {
  title: string;
  url: string;
}): Promise<ShareResult> {
  try {
    await Share.share({ title, message: url, url });
    return { kind: "shared" };
  } catch (error) {
    if (isDismiss(error)) return { kind: "shared" };

    return {
      kind: "error",
      message: getRussianErrorMessage(error, {
        fallback: "Не удалось поделиться ссылкой",
      }),
    };
  }
}

async function copyLink(url: string): Promise<ShareResult> {
  if (typeof navigator === "undefined" || navigator.clipboard === undefined) {
    return { kind: "error", message: "Копирование недоступно в этом браузере" };
  }
  try {
    await navigator.clipboard.writeText(url);
    return { kind: "copied" };
  } catch (error) {
    return {
      kind: "error",
      message: getRussianErrorMessage(error, {
        fallback: "Не удалось скопировать ссылку",
      }),
    };
  }
}

// Отмена системного листа на вебе — это AbortError, не ошибка для пользователя.
function isDismiss(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}
