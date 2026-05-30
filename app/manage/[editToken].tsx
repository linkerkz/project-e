import type { ComponentType } from "react";
import { Controller } from "react-hook-form";
import { Text, View } from "react-native";
import type { UpdateActivityForm } from "../../src/entities/activity/schemas";
import { getParticipantStatusText } from "../../src/entities/participant/utils";
import { useManageActivityForm } from "../../src/features/manage-activity/useManageActivityForm";
import { getRussianErrorMessage } from "../../src/shared/errors/getRussianErrorMessage";
import { Button } from "../../src/shared/ui/Button";
import { DateTimeInput } from "../../src/shared/ui/DateTimeInput";
import { ErrorText } from "../../src/shared/ui/ErrorText";
import { Input, type InputProps } from "../../src/shared/ui/Input";
import { LoadingText } from "../../src/shared/ui/LoadingText";
import { Page } from "../../src/shared/ui/Page";
import { Select } from "../../src/shared/ui/Select";
import { Textarea } from "../../src/shared/ui/Textarea";
import { BackLink } from "../_layout";

export default function ManagePage() {
  const {
    activity,
    activityQuery,
    participants,
    participantsQuery,
    publicUrl,
    form,
    submit,
    toggleStatus,
    mutation,
  } = useManageActivityForm();
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
          nativeID={String(name)}
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
      <Text>Публичная ссылка: {publicUrl}</Text>
      <Text>Копируй и отправляй вручную</Text>
      <View className="gap-3 border border-gray-400 p-3">
        <Text className="text-xl font-bold">Форма редактирования</Text>
        {field("title", "название")}
        {field("description", "описание", Textarea)}
        {field("city", "город")}
        {field("location_text", "место текстом")}
        {field("starts_at", "дата и время", DateTimeInput)}
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
          title={mutation.isPending ? "Сохраняем..." : "Сохранить"}
          onPress={handleSubmit(submit)}
        />
        <Button
          title={
            activity.status === "active"
              ? "Отменить активность"
              : "Вернуть активность"
          }
          onPress={toggleStatus}
        />
        <ErrorText>{errors.root?.server?.message}</ErrorText>
        <ErrorText>
          {mutation.error
            ? getRussianErrorMessage(mutation.error, {
                fallback: "Не удалось сохранить активность",
              })
            : null}
        </ErrorText>
      </View>
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
