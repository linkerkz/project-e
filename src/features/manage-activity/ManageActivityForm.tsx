import { Controller, type UseFormReturn } from "react-hook-form";
import { Text, View } from "react-native";
import type {
  UpdateActivityForm,
  UpdateActivityFormInput,
} from "../../entities/activity/schemas";
import type { ActivityStatus } from "../../entities/activity/types";
import { activityStatusOptions } from "../../entities/activity/utils";
import { Button } from "../../shared/ui/Button";
import { DateTimeInput } from "../../shared/ui/DateTimeInput";
import { ErrorText } from "../../shared/ui/ErrorText";
import { FormField } from "../../shared/ui/FormField";
import { Select } from "../../shared/ui/Select";
import { Textarea } from "../../shared/ui/Textarea";

type Props = {
  form: UseFormReturn<UpdateActivityFormInput, unknown, UpdateActivityForm>;
  status: ActivityStatus;
  isSaving: boolean;
  onSubmit: (values: UpdateActivityForm) => void;
  onToggleStatus: () => void;
};

export function ManageActivityForm({
  form,
  status,
  isSaving,
  onSubmit,
  onToggleStatus,
}: Props) {
  const { control, handleSubmit } = form;
  const { errors } = form.formState;

  return (
    <View className="gap-3 border border-gray-400 p-3">
      <Text className="text-xl font-bold">Форма управления</Text>
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
        label="дата и время"
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
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            label="статус"
            value={field.value}
            onChange={field.onChange}
            options={activityStatusOptions}
            error={errors.status?.message}
          />
        )}
      />
      <Button
        title={isSaving ? "Сохраняем..." : "Сохранить"}
        onPress={handleSubmit(onSubmit)}
      />
      <Button
        title={
          status === "active" ? "Отменить активность" : "Вернуть активность"
        }
        onPress={onToggleStatus}
      />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
    </View>
  );
}
