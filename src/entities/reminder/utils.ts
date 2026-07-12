// Стартовое смещение напоминания — за сколько часов до старта предупреждаем.
export const defaultOffsetHours = 2;

// Допустимые смещения в настройке профиля (часы до старта).
export const offsetOptions = [1, 2, 24];

// Русское слово «час» в нужной форме: 1 час, 2 часа, 24 часа, 11 часов.
export function hoursWord(hours: number): string {
  const mod100 = hours % 100;
  if (mod100 >= 11 && mod100 <= 14) return "часов";

  const mod10 = hours % 10;
  if (mod10 === 1) return "час";
  if (mod10 >= 2 && mod10 <= 4) return "часа";
  return "часов";
}

// Момент срабатывания напоминания: старт минус смещение. Невалидная дата или
// момент уже в прошлом → null (планировать нечего).
export function getReminderDate(
  startsAt: string,
  offsetHours: number,
): Date | null {
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return null;

  const remindAt = new Date(start.getTime() - offsetHours * hourInMs);
  if (remindAt.getTime() <= Date.now()) return null;

  return remindAt;
}

const hourInMs = 60 * 60 * 1000;
