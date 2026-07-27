import { useEffect, useState } from "react";
import { readDeviceFlag, writeDeviceFlag } from "../../shared/lib/storage";

// Локальная защита от повторной жалобы: одна жалоба на устройство (по образцу useRespondedFlag).
const reportedKey = (activityId: string) => `reported:${activityId}`;

export function useReportedFlag(activityId?: string) {
  const [hasReported, setHasReported] = useState(false);

  useEffect(() => {
    if (activityId == null) return;
    let active = true;
    readDeviceFlag(reportedKey(activityId))
      .then((reported) => {
        if (active) setHasReported(reported);
      })
      // Флаг не критичен: ошибка чтения = считаем, что жалобы не было.
      .catch(() => {
        if (active) setHasReported(false);
      });
    return () => {
      active = false;
    };
  }, [activityId]);

  async function markReported() {
    if (activityId == null) return;
    setHasReported(true);
    // Сбой записи не должен ронять успешную жалобу: флаг переживёт только сессию.
    try {
      await writeDeviceFlag(reportedKey(activityId));
    } catch {}
  }

  return { hasReported, markReported };
}
