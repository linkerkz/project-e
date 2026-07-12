import { Controller, type UseFormReturn } from "react-hook-form";
import { Text, View } from "react-native";
import type {
  UpdateSeriesForm,
  UpdateSeriesFormInput,
} from "../../entities/series/schemas";
import type { SeriesStatus } from "../../entities/series/types";
import { Button } from "../../shared/ui/Button";
import { DateTimeInput } from "../../shared/ui/DateTimeInput";
import { ErrorText } from "../../shared/ui/ErrorText";
import { FormField } from "../../shared/ui/FormField";
import { Select } from "../../shared/ui/Select";
import { Textarea } from "../../shared/ui/Textarea";

type Props = {
  form: UseFormReturn<UpdateSeriesFormInput, unknown, UpdateSeriesForm>;
  recurrenceText: string;
  isSaving: boolean;
  onSubmit: (values: UpdateSeriesForm) => void;
  onFinish: () => void;
};

const statusOptions: { value: SeriesStatus; label: string }[] = [
  { value: "active", label: "активна" },
  { value: "finished", label: "завершена" },
];

export function ManageSeriesForm({
  form,
  recurrenceText,
  isSaving,
  onSubmit,
  onFinish,
}: Props) {
  const { control, handleSubmit } = form;
  const { errors } = form.formState;

  return (
    <View className="gap-3 border border-gray-400 p-3">
      <Text className="text-xl font-bold">Шаблон серии</Text>
      <Text className="text-gray-600">
        Изменения применятся ко всем будущим встречам.
      </Text>
      <Text>Правило: {recurrenceText}</Text>
      <FormField
        control={control}
        name="title"
        label="название"
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
        label="город"
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
        label="лимит мест"
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
        name="status"
        render={({ field }) => (
          <Select
            label="статус"
            value={field.value}
            onChange={field.onChange}
            options={statusOptions}
            error={errors.status?.message}
          />
        )}
      />
      <Button
        title={isSaving ? "Сохраняем..." : "Сохранить"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSaving}
      />
      <Button title="Завершить серию" onPress={onFinish} disabled={isSaving} />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
    </View>
  );
}
