import type { ComponentType } from "react";
import { Controller } from "react-hook-form";
import { Image, Text, View } from "react-native";
import type { ParticipantForm } from "../../src/entities/participant/schemas";
import { getParticipantStatusText } from "../../src/entities/participant/utils";
import { useActivityResponseForm } from "../../src/features/respond-to-activity/useActivityResponseForm";
import { getRussianErrorMessage } from "../../src/shared/errors/getRussianErrorMessage";
import { Button } from "../../src/shared/ui/Button";
import { ErrorText } from "../../src/shared/ui/ErrorText";
import { Input, type InputProps } from "../../src/shared/ui/Input";
import { LoadingText } from "../../src/shared/ui/LoadingText";
import { Page } from "../../src/shared/ui/Page";
import { Select } from "../../src/shared/ui/Select";
import { Textarea } from "../../src/shared/ui/Textarea";
import { BackLink } from "../_layout";

export default function ActivityPage() {
  const {
    activity,
    activityQuery,
    participants,
    participantsQuery,
    stats,
    form,
    submit,
    mutation,
  } = useActivityResponseForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  if (activityQuery.isLoading)
    return (
      <Page>
        <LoadingText />
      </Page>
    );
  if (!activity)
    return (
      <Page>
        <BackLink />
        <Text>Активность не найдена</Text>
        <ErrorText>
          {activityQuery.error
            ? getRussianErrorMessage(activityQuery.error, {
                fallback: "Не удалось загрузить активность",
              })
            : null}
        </ErrorText>
      </Page>
    );
  const field = (
    name: keyof ParticipantForm,
    label: string,
    C: ComponentType<InputProps> = Input,
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <C
          label={label}
          nativeID={String(name)}
          value={field.value}
          onChangeText={field.onChange}
          error={(errors[name]?.message as string) || ""}
        />
      )}
    />
  );
  return (
    <Page>
      <BackLink />
      {activity.cover_url ? (
        <Image
          source={{ uri: activity.cover_url }}
          className="h-48 w-full"
          resizeMode="contain"
        />
      ) : null}
      <Text className="text-3xl font-bold">{activity.title}</Text>
      <Text>{activity.city}</Text>
      <Text>{activity.location_text}</Text>
      <Text>{new Date(activity.starts_at).toLocaleString()}</Text>
      <Text>{activity.description}</Text>
      {activity.status === "cancelled" ? (
        <Text className="font-bold text-red-700">ОТМЕНЕНО</Text>
      ) : null}
      <Text>
        Идут: {stats.going} Может быть: {stats.maybe} Не могут: {stats.cant}
      </Text>
      {activity.capacity ? (
        <Text>
          {stats.going} / {activity.capacity} идут
        </Text>
      ) : null}
      {activity.status !== "cancelled" ? (
        <View className="gap-3 border border-gray-400 p-3">
          <Text className="text-xl font-bold">Форма отклика</Text>
          {field("name", "имя, обязательно")}
          {field("telegram", "телеграм")}
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="статус"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "going", label: "иду" },
                  { value: "maybe", label: "может быть" },
                  { value: "cant", label: "не могу" },
                ]}
                error={errors.status?.message}
              />
            )}
          />
          {field("comment", "комментарий", Textarea)}
          <Button
            title={mutation.isPending ? "Сохраняем..." : "Отправить отклик"}
            onPress={handleSubmit(submit)}
          />
          <ErrorText>{errors.root?.server?.message}</ErrorText>
          <ErrorText>
            {mutation.error
              ? getRussianErrorMessage(mutation.error, {
                  fallback: "Не удалось отправить отклик",
                })
              : null}
          </ErrorText>
        </View>
      ) : null}
      <Text className="text-xl font-bold">Список участников</Text>
      {participantsQuery.isLoading ? <LoadingText /> : null}
      {participants.length === 0 ? <Text>Откликов пока нет.</Text> : null}
      {participants.map((p) => (
        <Text key={p.id}>
          - {p.name} / {getParticipantStatusText(p.status)} / {p.telegram || ""}{" "}
          / {p.comment || ""}
        </Text>
      ))}
    </Page>
  );
}
