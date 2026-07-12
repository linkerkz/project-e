import { readReminders } from "../../entities/reminder/local";
import {
  cancelReminder,
  scheduleReminder,
} from "../../entities/reminder/schedule";
import { useUpsertMark } from "../../entities/series/hooks";
import type { MarkStatus, Meeting, Series } from "../../entities/series/types";
import { nextMeeting } from "../../entities/series/utils";

type Params = {
  memberId?: string;
  series?: Series;
  meetings: Meeting[];
};

// Тогл отметки постоянного участника по конкретной встрече. Дефолт — «иду»
// (участник идёт на все), поэтому отсутствие отметки трактуем как «иду».
export function useMarkMeeting({ memberId, series, meetings }: Params) {
  const mutation = useUpsertMark();

  async function toggle(meetingId: string, current?: MarkStatus) {
    if (memberId == null) return;

    const status = nextStatus(current);
    await mutation.mutateAsync({
      meeting_id: meetingId,
      member_id: memberId,
      status,
    });
    if (status === "skip")
      await moveReminderPastSkip(meetingId).catch(() => {});
  }

  // Пропуск встречи с напоминанием переносит его на следующую встречу. Пропущена
  // не та встреча, что напоминаем, — ничего не делаем.
  async function moveReminderPastSkip(meetingId: string) {
    if (series == null) return;
    const skipped = meetings.find((meeting) => meeting.id === meetingId);
    if (skipped == null) return;

    const reminders = await readReminders();
    const reminder = reminders.find((item) => item.slug === series.slug);
    if (reminder == null || reminder.startsAt !== skipped.starts_at) return;

    await cancelReminder(series.slug);
    const next = nextMeeting(meetings, skipped.starts_at);
    if (next == null) return;

    await scheduleReminder({
      slug: series.slug,
      title: series.title,
      startsAt: next.starts_at,
    });
  }

  return { toggle, isMarking: mutation.isPending };
}

function nextStatus(current?: MarkStatus): MarkStatus {
  return current === "skip" ? "going" : "skip";
}
