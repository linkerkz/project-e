# Git Workflow

**Одна задача — одна ветка — один PR.** Промежуточного `stage` нет, PR идёт прямо в `main`.

```
main
  ↑ PR (issue-28/add-map → main)
issue-28/add-map
```

## Формат коммитов

Тип коммита (Conventional Commits):

| Тип        | Когда                             |
| ---------- | --------------------------------- |
| `feat`     | новая функциональность            |
| `fix`      | исправление бага                  |
| `refactor` | переработка без смены поведения   |
| `test`     | тесты                             |
| `docs`     | документация                      |
| `style`    | форматирование, NativeWind-классы |
| `chore`    | конфиг, зависимости, CI           |

**Scope** — слой или slice проекта, который затронул коммит (см. цепочку слоёв в `AGENTS.md`):

| Scope         | Когда                                     |
| ------------- | ----------------------------------------- |
| `activity`    | slice `entities/activity`                 |
| `participant` | slice `entities/participant`              |
| `features`    | пользовательские сценарии `features/*`    |
| `shared`      | `shared/ui`, `shared/lib`, supabase и пр. |
| `app`         | роуты Expo Router в `app/`                |
| `cfg`         | конфиг, env, зависимости                  |
| `docs`        | документация                              |
| `ci`          | CI/CD                                     |

**Примеры:**

- `feat(activity): добавлен маппер формы создания в payload`
- `fix(participant): исправлен подсчёт участников по статусу`
- `refactor(shared): вынесен requireSupabase в отдельный модуль`
- `test(activity): добавлены тесты генерации slug`
- `docs: обновлён git workflow под текущий проект`

## Рабочий цикл

### Начало задачи

```bash
git fetch origin
git checkout -b issue-{id}/{говорящее-имя} origin/main
```

### В процессе работы

Перед началом дня и перед созданием PR влей свежий `main`:

```bash
git fetch origin
git merge origin/main
```

Конфликт из-за своего кода — правишь сам. Конфликт из-за чужого — разбираешься по `git blame`.

### Завершение задачи

1. Убедись что ветка свежая (влит актуальный `main`).
2. Прогони полную проверку: `npm run ci` (lint + тесты).
3. Создай PR: `issue-{id}/{говорящее-имя}` → `main`.
4. После мержа удали feature-ветку.

```bash
git branch -d issue-{id}/{говорящее-имя}
git push origin --delete issue-{id}/{говорящее-имя}
```

## Атомарность коммитов

Один коммит — одно логическое изменение. Примеры правильного дробления:

```
test(activity): добавлены тесты маппера создания
feat(activity): добавлен mapCreateActivityFormToInput
feat(features): добавлен хук useCreateActivityForm
feat(app): добавлен экран создания активности
```

Не смешивай рефакторинг и фичу в одном коммите.
