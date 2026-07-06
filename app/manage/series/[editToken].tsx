import { useState } from "react";
import { Text, View } from "react-native";
import type { Meeting, SeriesMember } from "../../../src/entities/series/types";
import { formatRecurrenceText } from "../../../src/entities/series/utils";
import { ManageSeriesForm } from "../../../src/features/manage-series/ManageSeriesForm";
import { useManageSeriesForm } from "../../../src/features/manage-series/useManageSeriesForm";
import { toDateTimeLocalInputValue } from "../../../src/shared/lib/datetime";
import { ActivityNotFound } from "../../../src/shared/ui/ActivityNotFound";
import { BackLink } from "../../../src/shared/ui/BackLink";
import { Button } from "../../../src/shared/ui/Button";
import { DateTimeInput } from "../../../src/shared/ui/DateTimeInput";
import { LoadingPage } from "../../../src/shared/ui/LoadingPage";
import { Page } from "../../../src/shared/ui/Page";
import { ShareButton } from "../../../src/shared/ui/ShareButton";

export default function ManageSeriesPage() {
  const {
    series,
    isLoading,
    loadError,
    meetings,
    members,
    publicUrl,
    form,
    submit,
    rescheduleMeeting,
    cancelMeeting,
    finishSeries,
    isSaving,
  } = useManageSeriesForm();

  if (isLoading) return <LoadingPage />;
  if (!series) return <ActivityNotFound error={loadError} />;

  return (
    <Page>
      <BackLink />
      <Text className="text-2xl font-bold">Управление серией</Text>
      <Text>Публичная ссылка: {publicUrl}</Text>
      <ShareButton slug={series.slug} title={series.title} />
      <ManageSeriesForm
        form={form}
        recurrenceText={formatRecurrenceText(
          series.recurrence,
          series.starts_at,
        )}
        isSaving={isSaving}
        onSubmit={submit}
        onFinish={finishSeries}
      />
      <Meetings
        meetings={meetings}
        onReschedule={rescheduleMeeting}
        onCancel={cancelMeeting}
      />
      <Members members={members} />
    </Page>
  );
}

type MeetingsProps = {
  meetings: Meeting[];
  onReschedule: (id: string, startsAt: string) => void;
  onCancel: (id: string) => void;
};

function Meetings({ meetings, onReschedule, onCancel }: MeetingsProps) {
  return (
    <View className="gap-2">
      <Text className="text-xl font-bold">Встречи</Text>
      <Text className="text-gray-600">Создаются автоматически по правилу.</Text>
      {meetings.length === 0 ? <Text>Встреч пока нет.</Text> : null}
      {meetings.map((meeting) => (
        <MeetingRow
          key={meeting.id}
          meeting={meeting}
          onReschedule={onReschedule}
          onCancel={onCancel}
        />
      ))}
    </View>
  );
}

type MeetingRowProps = {
  meeting: Meeting;
  onReschedule: (id: string, startsAt: string) => void;
  onCancel: (id: string) => void;
};

function MeetingRow({ meeting, onReschedule, onCancel }: MeetingRowProps) {
  const [startsAt, setStartsAt] = useState(
    toDateTimeLocalInputValue(meeting.starts_at),
  );
  const cancelled = meeting.status === "cancelled";

  return (
    <View className="gap-2 border-b border-gray-300 py-2">
      <Text>{new Date(meeting.starts_at).toLocaleString()}</Text>
      {cancelled ? (
        <Text className="font-bold text-red-700">ОТМЕНЕНА</Text>
      ) : (
        <View className="gap-2">
          <DateTimeInput
            label="перенести на"
            value={startsAt}
            onChangeText={setStartsAt}
          />
          <Button
            title="Перенести"
            onPress={() => onReschedule(meeting.id, startsAt)}
          />
          <Button
            title="Отменить встречу"
            onPress={() => onCancel(meeting.id)}
          />
        </View>
      )}
    </View>
  );
}

function Members({ members }: { members: SeriesMember[] }) {
  return (
    <View className="gap-2">
      <Text className="text-xl font-bold">Постоянные участники</Text>
      {members.length === 0 ? <Text>Пока никто не записан.</Text> : null}
      {members.map((member) => (
        <View key={member.id} className="border-b border-gray-300 py-2">
          <Text>
            {member.name}
            {member.telegram ? ` — ${member.telegram}` : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}
