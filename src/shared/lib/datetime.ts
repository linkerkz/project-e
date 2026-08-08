export function isValidDateTime(value: string) {
  return parseDate(value) != null;
}

export function isToday(time: number) {
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function toIsoDate(value: string) {
  return parseDate(value)?.toISOString() ?? value;
}

export function toDateTimeLocalInputValue(value: string) {
  const date = parseDate(value);
  if (!date) return value;

  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(
    date.getDate(),
  )}T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
}

function parseDate(value: string) {
  const date = new Date(value.trim());
  return Number.isNaN(date.getTime()) ? null : date;
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}
