import { Platform } from "react-native";
import { getRussianErrorMessage } from "../errors/getRussianErrorMessage";

export type AddToCalendarResult =
  | { kind: "opened" }
  | { kind: "downloaded" }
  | { kind: "error"; message: string };

export type CalendarEvent = {
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: string;
  url: string;
};

const defaultDurationMs = 2 * 60 * 60 * 1000;

export async function addToCalendar(
  event: CalendarEvent,
): Promise<AddToCalendarResult> {
  const startsAt = new Date(event.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return { kind: "error", message: "У события некорректная дата начала" };
  }
  if (Platform.OS === "web") return downloadIcs(event);

  return openSystemCalendarDialog(event, startsAt);
}

export function buildIcs(event: CalendarEvent): string {
  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(startsAt.getTime() + defaultDurationMs);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Venty//Venty//RU",
    "BEGIN:VEVENT",
    `UID:${event.slug}@venty`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(startsAt)}`,
    `DTEND:${toIcsUtc(endsAt)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `URL:${event.url}`,
  ];
  if (event.description != null) {
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  }
  if (event.location != null) {
    lines.push(`LOCATION:${escapeIcsText(event.location)}`);
  }
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

async function openSystemCalendarDialog(
  event: CalendarEvent,
  startsAt: Date,
): Promise<AddToCalendarResult> {
  try {
    const calendar = await import("expo-calendar");
    await calendar.createEventInCalendarAsync({
      title: event.title,
      startDate: startsAt,
      endDate: new Date(startsAt.getTime() + defaultDurationMs),
      location: event.location ?? undefined,
      notes: event.description ?? undefined,
      url: event.url,
    });
    return { kind: "opened" };
  } catch (error) {
    return {
      kind: "error",
      message: getRussianErrorMessage(error, {
        fallback: "Не удалось открыть календарь",
      }),
    };
  }
}

function downloadIcs(event: CalendarEvent): AddToCalendarResult {
  if (typeof document === "undefined") {
    return { kind: "error", message: "Скачивание недоступно в этом браузере" };
  }
  const link = document.createElement("a");
  link.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(event))}`;
  link.download = `${event.slug}.ics`;
  link.click();
  return { kind: "downloaded" };
}

function toIcsUtc(date: Date) {
  return date
    .toISOString()
    .replace(/\.\d{3}/, "")
    .replace(/[-:]/g, "");
}

function escapeIcsText(text: string) {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}
