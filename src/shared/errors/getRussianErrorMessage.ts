type ErrorMessageOptions = {
  fallback: string;
};

const knownErrorMessages: Array<[RegExp, string]> = [
  [
    /invalid input syntax for type timestamp/i,
    "Введите корректные дату и время",
  ],
  [/network request failed/i, "Ошибка сети. Проверьте подключение к интернету"],
  [/failed to fetch/i, "Ошибка сети. Не удалось получить данные"],
  [/jwt expired/i, "Сессия истекла. Войдите заново"],
  [/permission denied/i, "Недостаточно прав для выполнения действия"],
  [/duplicate key/i, "Такая запись уже существует"],
  [/violates foreign key constraint/i, "Связанная запись не найдена"],
  [/violates not-null constraint/i, "Заполните обязательные поля"],
  [
    /слишком много мероприятий создано с этого адреса/i,
    "Слишком много мероприятий создано с этого адреса. Попробуйте позже.",
  ],
];

export function getRussianErrorMessage(
  error: unknown,
  { fallback }: ErrorMessageOptions,
) {
  if (!(error instanceof Error)) return fallback;

  const message = error.message.trim();
  if (!message) return fallback;

  const knownMessage = knownErrorMessages.find(([pattern]) =>
    pattern.test(message),
  );
  if (knownMessage) return knownMessage[1];

  return fallback;
}
