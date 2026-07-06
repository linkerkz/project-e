import type { MeetingMark, Recurrence, SeriesMember } from "./types";

type ListOptions = { horizon?: number };

// Даты слотов серии по правилу повторения, начиная от starts_at.
// Возвращаем ближайшие `horizon` дат (окно генерации встреч и превью конструктора),
// не выходя за окончание правила. Последовательность детерминирована — повторный
// прогон даёт те же слоты, поэтому upsert по scheduled_at идемпотентен.
export function listOccurrences(
  recurrence: Recurrence,
  startsAt: string,
  { horizon = 5 }: ListOptions = {},
): string[] {
  const anchor = new Date(startsAt);
  if (Number.isNaN(anchor.getTime())) return [];

  const limit = occurrenceLimit(recurrence, horizon);
  const until = untilDate(recurrence);

  const dates: string[] = [];
  for (const date of occurrenceSequence(recurrence, anchor)) {
    if (until && date > until) break;
    dates.push(date.toISOString());
    if (dates.length >= limit) break;
  }
  return dates;
}

const weekdayLabels = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

// Человекочитаемое правило для бейджа ленты и превью конструктора: «каждый вт · 19:00».
export function formatRecurrenceText(
  recurrence: Recurrence,
  startsAt: string,
): string {
  const time = formatTime(startsAt);
  return time
    ? `${formatSchedule(recurrence)} · ${time}`
    : formatSchedule(recurrence);
}

// «Кто идёт» на встречу: постоянные участники минус отметившие «пропущу».
// Отсутствие отметки трактуем как «идёт» (дефолт после записи — ходит на все).
export function getGoingCount(
  members: SeriesMember[],
  marks: MeetingMark[],
): number {
  const skipped = new Set(
    marks
      .filter((mark) => mark.status === "skip")
      .map((mark) => mark.member_id),
  );
  return members.filter((member) => !skipped.has(member.id)).length;
}

function occurrenceLimit(recurrence: Recurrence, horizon: number) {
  const { end } = recurrence;
  return end.kind === "count" ? Math.min(horizon, end.count) : horizon;
}

function untilDate(recurrence: Recurrence) {
  const { end } = recurrence;
  return end.kind === "until" ? new Date(end.date) : null;
}

function* occurrenceSequence(
  recurrence: Recurrence,
  anchor: Date,
): Generator<Date> {
  if (recurrence.unit === "week") {
    yield* weeklySequence(recurrence, anchor);
    return;
  }
  yield* steppedSequence(recurrence, anchor);
}

function* steppedSequence(
  recurrence: Recurrence,
  anchor: Date,
): Generator<Date> {
  let current = new Date(anchor);
  while (true) {
    yield new Date(current);
    current = advance(current, recurrence.unit, recurrence.interval);
  }
}

function* weeklySequence(
  recurrence: Recurrence,
  anchor: Date,
): Generator<Date> {
  const weekdays = selectedWeekdays(recurrence, anchor);
  const weekStart = startOfWeek(anchor);
  let weekOffset = 0;
  while (true) {
    for (const weekday of weekdays) {
      const date = addDays(weekStart, weekOffset + weekday);
      date.setHours(anchor.getHours(), anchor.getMinutes(), 0, 0);
      if (date >= anchor) yield date;
    }
    weekOffset += 7 * recurrence.interval;
  }
}

function selectedWeekdays(recurrence: Recurrence, anchor: Date) {
  if (recurrence.weekdays.length > 0) {
    return [...recurrence.weekdays].sort((a, b) => a - b);
  }
  return [toWeekday(anchor)];
}

function advance(date: Date, unit: Recurrence["unit"], interval: number) {
  const next = new Date(date);
  if (unit === "month") {
    next.setMonth(next.getMonth() + interval);
  } else {
    next.setDate(next.getDate() + interval);
  }
  return next;
}

function startOfWeek(date: Date) {
  const monday = new Date(date);
  monday.setDate(date.getDate() - toWeekday(date));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toWeekday(date: Date) {
  return (date.getDay() + 6) % 7; // JS: 0 = вс … в наш формат 0 = пн
}

function formatSchedule(recurrence: Recurrence): string {
  const { interval, unit } = recurrence;
  if (unit === "day") {
    return interval === 1 ? "каждый день" : `каждые ${interval} дн.`;
  }
  if (unit === "month") {
    return interval === 1 ? "каждый месяц" : `каждые ${interval} мес.`;
  }
  return formatWeeklySchedule(recurrence);
}

function formatWeeklySchedule(recurrence: Recurrence): string {
  const labels = [...recurrence.weekdays]
    .sort((a, b) => a - b)
    .map((weekday) => weekdayLabels[weekday]);
  if (recurrence.interval === 1) {
    if (labels.length === 0) return "каждую неделю";
    if (labels.length === 1) return `каждый ${labels[0]}`;
    return `по ${labels.join(", ")}`;
  }
  const weeks = `каждые ${recurrence.interval} нед.`;
  return labels.length > 0 ? `${weeks} · ${labels.join(", ")}` : weeks;
}

function formatTime(startsAt: string) {
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
