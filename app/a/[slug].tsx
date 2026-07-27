import { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import type { Activity } from "../../src/entities/activity/types";
import { getCapacityState } from "../../src/entities/activity/utils";
import { getParticipantStatusText } from "../../src/entities/participant/utils";
import { useLikeActivity } from "../../src/features/like-activity/useLikeActivity";
import { useReportActivity } from "../../src/features/report-activity/useReportActivity";
import { ResponseForm } from "../../src/features/respond-to-activity/ResponseForm";
import { useRespondToActivityForm } from "../../src/features/respond-to-activity/useRespondToActivityForm";
import { categoryLabel } from "../../src/shared/lib/categories";
import { buildActivityPublicUrl } from "../../src/shared/lib/publicUrl";
import { ActivityNotFound } from "../../src/shared/ui/ActivityNotFound";
import { AddToCalendarButton } from "../../src/shared/ui/AddToCalendarButton";
import { BackLink } from "../../src/shared/ui/BackLink";
import { Button } from "../../src/shared/ui/Button";
import { ChatLinkButton } from "../../src/shared/ui/ChatLinkButton";
import { LoadingPage } from "../../src/shared/ui/LoadingPage";
import { OpenInAppBanner } from "../../src/shared/ui/OpenInAppBanner";
import { Page } from "../../src/shared/ui/Page";
import { ParticipantList } from "../../src/shared/ui/ParticipantList";
import { QrCode } from "../../src/shared/ui/QrCode";
import { ShareButton } from "../../src/shared/ui/ShareButton";

export default function ActivityPage() {
  const {
    activity,
    isLoading,
    loadError,
    participants,
    participantsLoading,
    stats,
    form,
    submit,
    isSaving,
    hasResponded,
    reminderScheduled,
  } = useRespondToActivityForm();

  if (isLoading) return <LoadingPage />;
  if (!activity) return <ActivityNotFound error={loadError} />;

  return (
    <Page>
      <BackLink />
      <OpenInAppBanner path={`a/${activity.slug}`} />
      {activity.cover_url ? (
        <Image
          source={{ uri: activity.cover_url }}
          className="h-48 w-full"
          resizeMode="contain"
        />
      ) : null}
      <Text className="text-3xl font-bold">{activity.title}</Text>
      {activity.category ? (
        <Text className="text-gray-600">
          {categoryLabel(activity.category)}
        </Text>
      ) : null}
      <Text>{activity.city}</Text>
      <Text>{activity.location_text}</Text>
      <Text>{new Date(activity.starts_at).toLocaleString()}</Text>
      <Text>{activity.description}</Text>
      {activity.status === "cancelled" ? (
        <Text className="font-bold text-red-700">ОТМЕНЕНО</Text>
      ) : null}
      <Text>Идут: {stats.going}</Text>
      <CapacityNotice capacity={activity.capacity} going={stats.going} />
      <LikeButton slug={activity.slug} />
      <ShareButton slug={activity.slug} title={activity.title} />
      {activity.status !== "cancelled" ? (
        <AddToCalendarButton event={calendarEventFor(activity)} />
      ) : null}
      <QrBlock url={buildActivityPublicUrl(activity.slug)} />
      {activity.chat_url ? <ChatLinkButton url={activity.chat_url} /> : null}
      {activity.status !== "cancelled" && !hasResponded ? (
        <ResponseForm form={form} isSaving={isSaving} onSubmit={submit} />
      ) : null}
      {activity.status !== "cancelled" && hasResponded ? (
        <Text className="font-bold">
          Ты уже откликнулся с этого устройства.
        </Text>
      ) : null}
      {reminderScheduled ? <Text>Напомним за 2 часа до начала.</Text> : null}
      <ParticipantList
        participants={participants}
        loading={participantsLoading}
        statusText={getParticipantStatusText}
      />
      <ReportButton activityId={activity.id} />
    </Page>
  );
}

function calendarEventFor(activity: Activity) {
  return {
    slug: activity.slug,
    title: activity.title,
    description: activity.description,
    location: activity.location_text,
    startsAt: activity.starts_at,
    url: buildActivityPublicUrl(activity.slug),
  };
}

function QrBlock({ url }: { url: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="gap-1">
      <Button
        title={visible ? "Скрыть QR-код" : "Показать QR-код"}
        onPress={() => setVisible(!visible)}
      />
      {visible ? <QrCode url={url} /> : null}
    </View>
  );
}

function LikeButton({ slug }: { slug: string }) {
  const { isLiked, toggle, isToggling } = useLikeActivity(slug);

  return (
    <Button
      title={isLiked ? "♥ Нравится" : "♡ Нравится"}
      onPress={toggle}
      disabled={isToggling}
    />
  );
}

function ReportButton({ activityId }: { activityId: string }) {
  const { hasReported, report, isReporting, errorMessage } =
    useReportActivity(activityId);

  function confirmReport() {
    Alert.alert("Пожаловаться на мероприятие?", "Модератор проверит жалобу.", [
      { text: "Отмена", style: "cancel" },
      { text: "Пожаловаться", style: "destructive", onPress: report },
    ]);
  }

  if (hasReported) {
    return <Text className="text-gray-600">Жалоба отправлена</Text>;
  }

  return (
    <View className="gap-1">
      <Button
        title="Пожаловаться"
        onPress={confirmReport}
        disabled={isReporting}
      />
      {errorMessage ? (
        <Text className="text-red-700">{errorMessage}</Text>
      ) : null}
    </View>
  );
}

type CapacityNoticeProps = {
  capacity: number | null;
  going: number;
};

function CapacityNotice({ capacity, going }: CapacityNoticeProps) {
  const state = getCapacityState({ capacity, going });
  if (state.kind === "unlimited") return null;

  if (state.kind === "full") {
    return <Text className="font-bold text-red-700">Мест нет</Text>;
  }

  return <Text>Осталось мест: {state.left}</Text>;
}
