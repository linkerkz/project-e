import type { ActivityStatus } from "./types";

export const activityStatusLabels: Record<ActivityStatus, string> = {
  active: "активна",
  cancelled: "отменена",
};

export const activityStatusOptions = (
  Object.keys(activityStatusLabels) as ActivityStatus[]
).map((value) => ({ value, label: activityStatusLabels[value] }));

export function getNextActivityStatus(status: ActivityStatus): ActivityStatus {
  return status === "active" ? "cancelled" : "active";
}

type WithStartsAt = { startsAt: string };

export function splitByStartsAt<T extends WithStartsAt>(
  items: T[],
  now = new Date(),
): { upcoming: T[]; past: T[] } {
  const upcoming: T[] = [];
  const past: T[] = [];
  for (const item of items) {
    const bucket = new Date(item.startsAt) > now ? upcoming : past;
    bucket.push(item);
  }
  return { upcoming, past };
}

type CapacityState =
  | { kind: "unlimited" }
  | { kind: "available"; left: number }
  | { kind: "full" };

type CapacityParams = {
  capacity: number | null;
  going: number;
};

export function getCapacityState({
  capacity,
  going,
}: CapacityParams): CapacityState {
  if (capacity == null) return { kind: "unlimited" };

  const left = capacity - going;
  return left > 0 ? { kind: "available", left } : { kind: "full" };
}

// Telegram в профиле хранится как `@username` / `username` / ссылка, а chat_url
// требует полный URL — нормализуем хэндл в t.me-ссылку для префилла формы.
export function telegramToChatUrl(value: string | null | undefined) {
  const handle = value?.trim();
  if (!handle) return "";
  if (/^https?:\/\//i.test(handle)) return handle;
  if (/^(t\.me|telegram\.me|telegram\.dog)\//i.test(handle)) {
    return `https://${handle}`;
  }
  return `https://t.me/${handle.replace(/^@/, "")}`;
}
