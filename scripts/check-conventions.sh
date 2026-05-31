#!/usr/bin/env bash
#
# Быстрые grep-проверки правил core.md по застейдженным файлам src.
# Запускается из pre-commit. Никаких зависимостей, только git + grep.
set -euo pipefail

staged=$(git diff --cached --name-only --diff-filter=ACMR)
[ -z "$staged" ] && exit 0

fail=0
report() {
  echo "  ✗ $1"
  fail=1
}

while IFS= read -r file; do
  case "$file" in
    src/*.ts | src/*.tsx) ;;
    *) continue ;;
  esac

  # Содержимое именно из индекса — то, что реально уйдёт в коммит.
  content=$(git show ":$file")

  # §3: barrel-файлов нет, импортируем напрямую по пути к модулю.
  case "$file" in
    src/index.ts | src/*/index.ts)
      report "$file: barrel index.ts запрещён, импортируй по пути (core.md §3)"
      ;;
  esac

  # §8: стили только классами NativeWind, без StyleSheet и инлайна.
  if printf '%s' "$content" | grep -qE 'StyleSheet|style=\{\{'; then
    report "$file: StyleSheet/инлайн-стиль запрещён, только className NativeWind (core.md §8)"
  fi

  # §6: createClient только в shared/supabase, остальные — через requireSupabase().
  case "$file" in
    src/shared/supabase/*) ;;
    *)
      if printf '%s' "$content" | grep -qE 'createClient\('; then
        report "$file: createClient только в shared/supabase, используй requireSupabase() (core.md §6)"
      fi
      ;;
  esac

  # typescript: в проекте только type, не interface (кроме деклараций *.d.ts).
  case "$file" in
    *.d.ts) ;;
    *)
      if printf '%s' "$content" | grep -qE '^[[:space:]]*(export[[:space:]]+)?interface[[:space:]]'; then
        report "$file: используй type вместо interface (core.md typescript)"
      fi
      ;;
  esac
done <<EOF
$staged
EOF

if [ "$fail" -ne 0 ]; then
  echo "Коммит отклонён: нарушены правила core.md (см. выше)."
  exit 1
fi
