export function slugifyTitle(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "activity"
  );
}

export function shortRandom() {
  return Math.random().toString(36).slice(2, 8);
}

export function generateActivitySlug(title: string) {
  return `${slugifyTitle(title)}-${shortRandom()}`;
}

export function generateEditToken() {
  return `${shortRandom()}${shortRandom()}${shortRandom()}`;
}

export function toIsoDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}
