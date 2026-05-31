# Команды

Операционная справка по npm-скриптам проекта.

- `npm start` — запустить Expo (`--android` / `--ios` / `--web` для конкретной платформы).
- `npm run lint` — Biome CI + `tsc --noEmit`. То же запускают pre-push и CI.
- `npm run format` — Biome с автоисправлением.
- `npm test` — Vitest (один прогон). Один файл: `npx vitest run путь/к/файлу.test.ts`,
  в watch-режиме: `npx vitest путь` (без `run`).
- `npm run ci` — lint + тесты, полная проверка перед пушем.
