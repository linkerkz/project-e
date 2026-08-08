import { Controller } from "react-hook-form";
import { View } from "react-native";
import { boolOptions } from "../../shared/lib/boolOptions";
import { categoryOptions } from "../../shared/lib/categories";
import { Button } from "../../shared/ui/Button";
import { DateTimeInput } from "../../shared/ui/DateTimeInput";
import { ErrorText } from "../../shared/ui/ErrorText";
import { FormField } from "../../shared/ui/FormField";
import { Select } from "../../shared/ui/Select";
import { Textarea } from "../../shared/ui/Textarea";
import { RecurrenceFields } from "./RecurrenceFields";
import { useCreateSeriesForm } from "./useCreateSeriesForm";

export function CreateSeriesForm() {
  const { form, submit, isSaving } = useCreateSeriesForm();
  const { control, handleSubmit } = form;
  const { errors } = form.formState;
  const recurrence = form.watch("recurrence");
  const startsAt = form.watch("starts_at");

  return (
    <View className="gap-3">
      <FormField
        control={control}
        name="title"
        label="название, обязательно"
        error={errors.title?.message}
      />
      <FormField
        control={control}
        name="description"
        label="описание"
        component={Textarea}
        error={errors.description?.message}
      />
      <FormField
        control={control}
        name="city"
        label="город, обязательно"
        error={errors.city?.message}
      />
      <FormField
        control={control}
        name="location_text"
        label="место текстом"
        error={errors.location_text?.message}
      />
      <FormField
        control={control}
        name="starts_at"
        label="первая встреча, дата и время"
        component={DateTimeInput}
        error={errors.starts_at?.message}
      />
      <FormField
        control={control}
        name="capacity"
        label="лимит мест, число или пусто"
        error={errors.capacity?.message}
      />
      <FormField
        control={control}
        name="cover_url"
        label="ссылка на обложку"
        error={errors.cover_url?.message}
      />
      <FormField
        control={control}
        name="chat_url"
        label="ссылка на чат"
        error={errors.chat_url?.message}
      />
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Select
            label="категория, обязательно"
            value={field.value}
            onChange={field.onChange}
            options={categoryOptions}
            error={errors.category?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="is_free"
        render={({ field }) => (
          <Select
            label="бесплатное участие"
            value={field.value ? "yes" : "no"}
            onChange={(value) => field.onChange(value === "yes")}
            options={boolOptions}
            error={errors.is_free?.message}
          />
        )}
      />
      <RecurrenceFields
        control={control}
        recurrence={recurrence}
        startsAt={startsAt}
        errors={{
          interval: errors.recurrence?.interval?.message,
          weekdays: errors.recurrence?.weekdays?.message,
          endDate: endMessage(errors.recurrence?.end, "date"),
          endCount: endMessage(errors.recurrence?.end, "count"),
        }}
      />
      <Button
        title={isSaving ? "Сохраняем..." : "Создать серию"}
        onPress={handleSubmit(submit)}
      />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
    </View>
  );
}

// Ошибка окончания правила лежит в дискриминированном union (`end.date`/`end.count`),
// достаём сообщение по конкретному ключу варианта.
function endMessage(error: unknown, key: "date" | "count"): string | undefined {
  if (error == null || typeof error !== "object") return undefined;
  if (key === "date" && "date" in error) return messageOf(error.date);
  if (key === "count" && "count" in error) return messageOf(error.count);
  return undefined;
}

function messageOf(field: unknown): string | undefined {
  if (field != null && typeof field === "object" && "message" in field) {
    const { message } = field;
    if (typeof message === "string") return message;
  }
  return undefined;
}
