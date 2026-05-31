# Быстрый старт

Запуск проекта Venty локально за пять шагов. Стек — Expo (React Native) v56,
сверяйся с документацией версии: https://docs.expo.dev/versions/v56.0.0/

## Требования

- Node.js 20+ и npm.
- Аккаунт Supabase с проектом (нужны URL и anon-ключ).
- Для нативного запуска — Expo Go на телефоне либо симулятор iOS / эмулятор Android.

## 1. Установка зависимостей

```bash
npm install
```

## 2. Переменные окружения

Скопируй `.env.example` в `.env.local` и заполни ключи проекта Supabase:

```bash
cp .env.example .env.local
```

```
EXPO_PUBLIC_SUPABASE_URL=https://<твой-проект>.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=<anon-ключ>
```

Без этих переменных клиент Supabase не поднимется, и любой запрос упадёт с
понятной русской ошибкой (см. `requireSupabase()` в `src/shared/supabase/client.ts`).

## 3. Запуск

```bash
npm start          # Expo dev-сервер, выбор платформы в меню
npm run web        # сразу в браузере
npm run ios        # симулятор iOS
npm run android    # эмулятор Android
```

## 4. Проверки перед коммитом

```bash
npm run lint   # Biome CI + tsc --noEmit
npm run arch   # проверка направления зависимостей по слоям
npm test       # Vitest, один прогон
npm run ci     # всё вместе — гоняй перед пушем
```

Полный список скриптов — в [commands.md](./commands.md).

## 5. Куда смотреть дальше

- Архитектура, слои и правила кода — [core.md](./core.md).
- Что за продукт и какой scope MVP — [about_the_project.md](./about_the_project.md).
- Ветки, коммиты, PR — [git_workflow.md](./git_workflow.md).
- Карта unit-тестов — [../TESTS.md](../TESTS.md).
