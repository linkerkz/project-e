import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import {
  useEnsureUpcomingMeetings,
  useMarks,
  useMeetings,
  useMembers,
  useSeriesBySlug,
} from "../../src/entities/series/hooks";
import type {
  Meeting,
  MeetingMark,
  Series,
  SeriesMember,
} from "../../src/entities/series/types";
import {
  formatRecurrenceText,
  getGoingCount,
} from "../../src/entities/series/utils";
import { JoinSeriesForm } from "../../src/features/join-series/JoinSeriesForm";
import { useJoinSeries } from "../../src/features/join-series/useJoinSeries";
import { useMarkMeeting } from "../../src/features/mark-meeting/useMarkMeeting";
import { categoryLabel } from "../../src/shared/lib/categories";
import { ActivityNotFound } from "../../src/shared/ui/ActivityNotFound";
import { BackLink } from "../../src/shared/ui/BackLink";
import { Button } from "../../src/shared/ui/Button";
import { ChatLinkButton } from "../../src/shared/ui/ChatLinkButton";
import { LoadingPage } from "../../src/shared/ui/LoadingPage";
import { Page } from "../../src/shared/ui/Page";
import { ShareButton } from "../../src/shared/ui/ShareButton";

export default function SeriesPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const seriesQuery = useSeriesBySlug(slug);
  const series = seriesQuery.data ?? undefined;
  const { mutate: ensureMeetings } = useEnsureUpcomingMeetings();
  const meetings = useMeetings(series?.id).data ?? [];
  const members = useMembers(series?.id).data ?? [];
  const marks = useMarks(meetings.map((meeting) => meeting.id)).data ?? [];
  const { membership, form, join, leave, isJoining } = useJoinSeries(
    series,
    meetings,
  );
  const { toggle } = useMarkMeeting({
    memberId: membership?.memberId,
    series,
    meetings,
  });

  // Слоты досоздаются лениво при открытии страницы серии.
  useEffect(() => {
    if (series) ensureMeetings(series);
  }, [series, ensureMeetings]);

  if (seriesQuery.isLoading) return <LoadingPage />;
  if (!series) return <ActivityNotFound error={seriesQuery.error} />;

  const memberId = membership?.memberId;

  return (
    <Page>
      <BackLink />
      <SeriesHeader series={series} />
      <ShareButton slug={series.slug} title={series.title} />
      {membership ? (
        <JoinedNotice onLeave={leave} chatUrl={series.chat_url} />
      ) : (
        <JoinSeriesForm form={form} isJoining={isJoining} onSubmit={join} />
      )}
      <Schedule
        meetings={meetings}
        members={members}
        marks={marks}
        memberId={memberId}
        onToggle={toggle}
      />
    </Page>
  );
}

function SeriesHeader({ series }: { series: Series }) {
  return (
    <View className="gap-1">
      {series.cover_url ? (
        <Image
          source={{ uri: series.cover_url }}
          className="h-48 w-full"
          resizeMode="contain"
        />
      ) : null}
      <Text className="text-3xl font-bold">{series.title}</Text>
      {series.category ? (
        <Text className="text-gray-600">{categoryLabel(series.category)}</Text>
      ) : null}
      <Text className="text-gray-600">
        {formatRecurrenceText(series.recurrence, series.starts_at)}
      </Text>
      <Text>{series.city}</Text>
      {series.location_text ? <Text>{series.location_text}</Text> : null}
      {series.description ? <Text>{series.description}</Text> : null}
    </View>
  );
}

function JoinedNotice({
  onLeave,
  chatUrl,
}: {
  onLeave: () => void;
  chatUrl: string | null;
}) {
  return (
    <View className="gap-2 border border-gray-400 p-3">
      <Text className="font-bold">Ты ходишь постоянно.</Text>
      {chatUrl ? <ChatLinkButton url={chatUrl} /> : null}
      <Button title="Выйти из серии" onPress={onLeave} />
    </View>
  );
}

type ScheduleProps = {
  meetings: Meeting[];
  members: SeriesMember[];
  marks: MeetingMark[];
  memberId?: string;
  onToggle: (meetingId: string, current?: MeetingMark["status"]) => void;
};

function Schedule({
  meetings,
  members,
  marks,
  memberId,
  onToggle,
}: ScheduleProps) {
  return (
    <View className="gap-2">
      <Text className="text-xl font-bold">Ближайшие встречи</Text>
      {meetings.length === 0 ? (
        <Text>Встречи ещё не запланированы.</Text>
      ) : null}
      {meetings.map((meeting) => (
        <MeetingRow
          key={meeting.id}
          meeting={meeting}
          going={getGoingCount(members, marksFor(marks, meeting.id))}
          myMark={myMark(marks, meeting.id, memberId)}
          onToggle={onToggle}
        />
      ))}
    </View>
  );
}

type MeetingRowProps = {
  meeting: Meeting;
  going: number;
  myMark?: MeetingMark["status"];
  onToggle: (meetingId: string, current?: MeetingMark["status"]) => void;
};

function MeetingRow({ meeting, going, myMark, onToggle }: MeetingRowProps) {
  const cancelled = meeting.status === "cancelled";
  const isGoing = myMark !== "skip";

  return (
    <View className="gap-1 border-b border-gray-300 py-2">
      <Text>{new Date(meeting.starts_at).toLocaleString()}</Text>
      {cancelled ? (
        <Text className="font-bold text-red-700">ОТМЕНЕНА</Text>
      ) : (
        <Text>Идут: {going}</Text>
      )}
      {!cancelled && myMark !== undefined ? (
        <Button
          title={
            isGoing ? "Иду · нажми, чтобы пропустить" : "Пропущу · вернуться"
          }
          onPress={() => onToggle(meeting.id, myMark)}
        />
      ) : null}
    </View>
  );
}

function marksFor(marks: MeetingMark[], meetingId: string) {
  return marks.filter((mark) => mark.meeting_id === meetingId);
}

// Отметка текущего участника по встрече. Нет отметки, но участник записан —
// дефолт «иду»; не записан (`memberId` пуст) — кнопки отметки не показываем.
function myMark(
  marks: MeetingMark[],
  meetingId: string,
  memberId?: string,
): MeetingMark["status"] | undefined {
  if (memberId == null) return undefined;
  const mark = marks.find(
    (item) => item.meeting_id === meetingId && item.member_id === memberId,
  );
  return mark?.status ?? "going";
}
