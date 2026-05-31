import { useEffect, useState } from "react";
import { readDeviceFlag, writeDeviceFlag } from "../../shared/lib/storage";

// Локальная защита от повторного отклика: один отклик на устройство.
// Настоящая планка появится вместе с аутентификацией.
const respondedKey = (activityId: string) => `responded:${activityId}`;

export function useRespondedFlag(activityId?: string) {
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    if (activityId == null) return;
    let active = true;
    readDeviceFlag(respondedKey(activityId))
      .then((responded) => {
        if (active) setHasResponded(responded);
      })
      // Флаг не критичен: ошибка чтения = считаем, что отклика не было.
      .catch(() => {
        if (active) setHasResponded(false);
      });
    return () => {
      active = false;
    };
  }, [activityId]);

  async function markResponded() {
    if (activityId == null) return;
    setHasResponded(true);
    // Сбой записи не должен ронять успешный отклик: флаг переживёт только сессию.
    try {
      await writeDeviceFlag(respondedKey(activityId));
    } catch {}
  }

  return { hasResponded, markResponded };
}
