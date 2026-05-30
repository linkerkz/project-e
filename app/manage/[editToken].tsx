import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { type ComponentType, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, Text, View } from "react-native";
import {
  useActivityByEditToken,
  useUpdateActivity,
} from "../../src/entities/activity/hooks";
import {
  type UpdateActivityForm,
  type UpdateActivityFormInput,
  updateActivitySchema,
} from "../../src/entities/activity/schemas";
import { toIsoDate } from "../../src/entities/activity/utils";
import { useParticipants } from "../../src/entities/participant/hooks";
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

export default function ManagePage() {
  const { editToken } = useLocalSearchParams<{ editToken: string }>();
  const aq = useActivityByEditToken(editToken);
  const activity = aq.data;
  const pq = useParticipants(activity?.id);
  const m = useUpdateActivity();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateActivityFormInput, unknown, UpdateActivityForm>({
    resolver: zodResolver(updateActivitySchema),
    defaultValues: {
      title: "",
      description: "",
      city: "",
      location_text: "",
      starts_at: "",
      capacity: null,
      cover_url: "",
      status: "active",
    },
  });
  useEffect(() => {
    if (activity)
      reset({
        title: activity.title,
        description: activity.description ?? "",
        city: activity.city,
        location_text: activity.location_text ?? "",
        starts_at: activity.starts_at,
        capacity: activity.capacity,
        cover_url: activity.cover_url ?? "",
        status: activity.status,
      });
  }, [activity, reset]);
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
  const path = `/a/${activity.slug}`;
  const url =
    Platform.OS === "web" && typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : path;
  async function submit(v: UpdateActivityForm) {
    const currentActivity = activity;
    if (!currentActivity) return;

    await m.mutateAsync({
      id: currentActivity.id,
      input: {
        ...v,
        starts_at: toIsoDate(v.starts_at),
        capacity: v.capacity ?? null,
        description: v.description || null,
        location_text: v.location_text || null,
        cover_url: v.cover_url || null,
      },
    });
    await aq.refetch();
  }
  const toggle = () => {
    const next = activity.status === "active" ? "cancelled" : "active";
    setValue("status", next);
    m.mutate(
      { id: activity.id, input: { status: next } },
      { onSuccess: () => aq.refetch() },
    );
  };
  const field = (
    name: keyof UpdateActivityForm,
    label: string,
    C: ComponentType<InputProps> = Input,
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <C
          label={label}
          value={field.value == null ? "" : String(field.value)}
          onChangeText={field.onChange}
          error={(errors[name]?.message as string) || ""}
        />
      )}
    />
  );
  return (
    <Page>
      <BackLink />
      <Text className="text-2xl font-bold">Управление активностью</Text>
      <Text>Публичная ссылка: {url}</Text>
      <Text>Копируй и отправляй вручную</Text>
      <View className="gap-3 border border-gray-400 p-3">
        <Text className="text-xl font-bold">Форма редактирования</Text>
        {field("title", "название")}
        {field("description", "описание", Textarea)}
        {field("city", "город")}
        {field("location_text", "место текстом")}
        {field("starts_at", "дата и время")}
        {field("capacity", "лимит мест")}
        {field("cover_url", "ссылка на обложку")}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              label="статус"
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "active", label: "активна" },
                { value: "cancelled", label: "отменена" },
              ]}
              error={errors.status?.message}
            />
          )}
        />
        <Button
          title={m.isPending ? "Сохраняем..." : "Сохранить"}
          onPress={handleSubmit(submit)}
        />
        <Button
          title={
            activity.status === "active"
              ? "Отменить активность"
              : "Вернуть активность"
          }
          onPress={toggle}
        />
        <ErrorText>
          {m.error instanceof Error ? m.error.message : null}
        </ErrorText>
      </View>
      <Text className="text-xl font-bold">Список участников</Text>
      {pq.isLoading ? <LoadingText /> : null}
      {(pq.data ?? []).length === 0 ? <Text>Откликов пока нет.</Text> : null}
      {(pq.data ?? []).map((p) => (
        <Text key={p.id}>
          - {p.name} / {statusText(p.status)} / {p.telegram || ""} /{" "}
          {p.comment || ""}
        </Text>
      ))}
    </Page>
  );
}
