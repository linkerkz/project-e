import { Controller } from "react-hook-form";
import { Text, View } from "react-native";
import { categoryOptions } from "../../shared/lib/categories";
import { Chip } from "../../shared/ui/Chip";
import { DateTimeInput } from "../../shared/ui/DateTimeInput";
import { ErrorText } from "../../shared/ui/ErrorText";
import { Field, MultilineField } from "../../shared/ui/Field";
import { FormField } from "../../shared/ui/FormField";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { Stepper } from "../../shared/ui/Stepper";
import { SwitchCard } from "../../shared/ui/SwitchCard";
import { useCreateActivityForm } from "./useCreateActivityForm";

type Props = {
  duplicateFrom?: string;
};

export function CreateActivityForm({ duplicateFrom }: Props) {
  const { form, submit, isSaving } = useCreateActivityForm(duplicateFrom);
  const { control, handleSubmit } = form;
  const { errors } = form.formState;

  return (
    <View className="gap-3">
      <FormField
        control={control}
        name="cover_url"
        label="Обложка · ссылка"
        component={Field}
        error={errors.cover_url?.message}
      />
      <FormField
        control={control}
        name="title"
        label="Название"
        component={Field}
        error={errors.title?.message}
      />
      <FormField
        control={control}
        name="description"
        label="Описание"
        component={MultilineField}
        error={errors.description?.message}
      />

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <View className="gap-2">
            <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Категория
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  active={field.value === option.value}
                  onPress={() => field.onChange(option.value)}
                />
              ))}
            </View>
            <ErrorText>{errors.category?.message}</ErrorText>
          </View>
        )}
      />

      <FormField
        control={control}
        name="starts_at"
        label="Когда"
        component={DateTimeInput}
        error={errors.starts_at?.message}
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            control={control}
            name="city"
            label="Город"
            component={Field}
            error={errors.city?.message}
          />
        </View>
        <View className="flex-1">
          <FormField
            control={control}
            name="location_text"
            label="Место"
            component={Field}
            error={errors.location_text?.message}
          />
        </View>
      </View>

      <FormField
        control={control}
        name="chat_url"
        label="Ссылка на чат"
        component={Field}
        error={errors.chat_url?.message}
      />

      <Controller
        control={control}
        name="capacity"
        render={({ field }) => (
          <Stepper
            label="Лимит участников"
            value={capacityLabel(field.value)}
            onDecrement={() => field.onChange(decCapacity(field.value))}
            onIncrement={() => field.onChange(incCapacity(field.value))}
          />
        )}
      />

      <Controller
        control={control}
        name="is_free"
        render={({ field }) => (
          <SwitchCard
            label="Вход"
            title={field.value ? "Бесплатно" : "Платно"}
            value={field.value ?? true}
            onValueChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="allow_maybe"
        render={({ field }) => (
          <SwitchCard
            label="RSVP"
            title="Статус «может пойду»"
            description="Кроме «Иду» — отметка «возможно»"
            value={field.value ?? true}
            onValueChange={field.onChange}
          />
        )}
      />

      <PrimaryButton
        title={isSaving ? "Сохраняем…" : "Создать"}
        onPress={handleSubmit(submit)}
        disabled={isSaving}
      />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
    </View>
  );
}

// Лимит участников хранится числом или null («без лимита»). Шаг вниз с 1
// возвращает к «без лимита», шаг вверх с «без лимита» открывает счётчик с 1.
function capacityLabel(value: unknown) {
  return typeof value === "number" ? `${value} чел.` : "Без лимита";
}
function incCapacity(value: unknown) {
  return typeof value === "number" ? value + 1 : 1;
}
function decCapacity(value: unknown) {
  if (typeof value !== "number") return null;
  return value <= 1 ? null : value - 1;
}
