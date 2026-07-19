import { Controller } from "react-hook-form";
import { View } from "react-native";
import { categoryOptions } from "../../shared/lib/categories";
import { Button } from "../../shared/ui/Button";
import { DateTimeInput } from "../../shared/ui/DateTimeInput";
import { ErrorText } from "../../shared/ui/ErrorText";
import { FormField } from "../../shared/ui/FormField";
import { Select } from "../../shared/ui/Select";
import { Textarea } from "../../shared/ui/Textarea";
import { useCreateActivityForm } from "./useCreateActivityForm";

export function CreateActivityForm() {
  const { form, submit, isSaving } = useCreateActivityForm();
  const { control, handleSubmit } = form;
  const { errors } = form.formState;

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
        label="дата и время, обязательно"
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
      <Button
        title={isSaving ? "Сохраняем..." : "Создать"}
        onPress={handleSubmit(submit)}
      />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
    </View>
  );
}
