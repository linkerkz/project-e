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
    readDeviceFlag(respondedKey(activityId)).then((responded) => {
      if (active) setHasResponded(responded);
    });
    return () => {
      active = false;
    };
  }, [activityId]);

  async function markResponded() {
    if (activityId == null) return;
    await writeDeviceFlag(respondedKey(activityId));
    setHasResponded(true);
  }

  return { hasResponded, markResponded };
}
