import { useUpsertMark } from "../../entities/series/hooks";
import type { MarkStatus } from "../../entities/series/types";

// Тогл отметки постоянного участника по конкретной встрече. Дефолт — «иду»
// (участник идёт на все), поэтому отсутствие отметки трактуем как «иду».
export function useMarkMeeting(memberId?: string) {
  const mutation = useUpsertMark();

  async function toggle(meetingId: string, current?: MarkStatus) {
    if (memberId == null) return;

    await mutation.mutateAsync({
      meeting_id: meetingId,
      member_id: memberId,
      status: nextStatus(current),
    });
  }

  return { toggle, isMarking: mutation.isPending };
}

function nextStatus(current?: MarkStatus): MarkStatus {
  return current === "skip" ? "going" : "skip";
}
