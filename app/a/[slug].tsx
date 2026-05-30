import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import type { ComponentType } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { useActivityBySlug } from "../../src/entities/activity/hooks";
import {
  useCreateParticipant,
  useParticipants,
} from "../../src/entities/participant/hooks";
import {
  type ParticipantForm,
  participantSchema,
} from "../../src/entities/participant/schemas";
import { Button } from "../../src/shared/ui/Button";
import { ErrorText } from "../../src/shared/ui/ErrorText";
import { Input, type InputProps } from "../../src/shared/ui/Input";
import { LoadingText } from "../../src/shared/ui/LoadingText";
import { Page } from "../../src/shared/ui/Page";
import { Select } from "../../src/shared/ui/Select";
import { Textarea } from "../../src/shared/ui/Textarea";
import { BackLink } from "../_layout";

function statusText(status: string) {
  if (status === "going") return "иду";
  if (status === "maybe") return "может быть";
  if (status === "cant") return "не могу";
  return status;
}

export default function ActivityPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const aq = useActivityBySlug(slug);
  const activity = aq.data;
  const pq = useParticipants(activity?.id);
  const m = useCreateParticipant(activity?.id ?? "");
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantForm>({
    resolver: zodResolver(participantSchema),
    defaultValues: { name: "", telegram: "", status: "going", comment: "" },
  });
  if (aq.isLoading)
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
          {aq.error instanceof Error ? aq.error.message : null}
        </ErrorText>
      </Page>
    );
  const ps = pq.data ?? [];
  const count = (s: string) => ps.filter((p) => p.status === s).length;
  async function submit(v: ParticipantForm) {
    const currentActivity = activity;
    if (!currentActivity) return;

    await m.mutateAsync({
      activity_id: currentActivity.id,
      ...v,
      telegram: v.telegram || null,
      comment: v.comment || null,
    });
    reset({ name: "", telegram: "", status: "going", comment: "" });
  }
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
        <Image source={{ uri: activity.cover_url }} className="h-48 w-full" />
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
        Идут: {count("going")} Может быть: {count("maybe")} Не могут:{" "}
        {count("cant")}
      </Text>
      {activity.capacity ? (
        <Text>
          {count("going")} / {activity.capacity} идут
        </Text>
      ) : null}
      {activity.status !== "cancelled" ? (
        <View className="gap-3 border border-gray-400 p-3">
          <Text className="text-xl font-bold">Форма отклика</Text>
          {field("name", "имя, обязательно")}
          {field("telegram", "телеграм")}
          {
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
          }
          {field("comment", "комментарий", Textarea)}
          <Button
            title={m.isPending ? "Сохраняем..." : "Отправить отклик"}
            onPress={handleSubmit(submit)}
          />
          <ErrorText>
            {m.error instanceof Error ? m.error.message : null}
          </ErrorText>
        </View>
      ) : null}
      <Text className="text-xl font-bold">Список участников</Text>
      {pq.isLoading ? <LoadingText /> : null}
      {ps.length === 0 ? <Text>Откликов пока нет.</Text> : null}
      {ps.map((p) => (
        <Text key={p.id}>
          - {p.name} / {statusText(p.status)} / {p.telegram || ""} /{" "}
          {p.comment || ""}
        </Text>
      ))}
    </Page>
  );
}
