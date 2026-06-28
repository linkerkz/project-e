import type { UseFormReturn } from "react-hook-form";
import { Text, View } from "react-native";
import type { ParticipantForm } from "../../entities/participant/schemas";
import { Button } from "../../shared/ui/Button";
import { ErrorText } from "../../shared/ui/ErrorText";
import { FormField } from "../../shared/ui/FormField";
import { Textarea } from "../../shared/ui/Textarea";

type Props = {
  form: UseFormReturn<ParticipantForm>;
  isSaving: boolean;
  onSubmit: (values: ParticipantForm) => void;
};

export function ResponseForm({ form, isSaving, onSubmit }: Props) {
  const { control, handleSubmit } = form;
  const { errors } = form.formState;

  return (
    <View className="gap-3 border border-gray-400 p-3">
      <Text className="text-xl font-bold">Форма отклика</Text>
      <FormField
        control={control}
        name="name"
        label="имя, обязательно"
        error={errors.name?.message}
      />
      <FormField
        control={control}
        name="telegram"
        label="телеграм"
        error={errors.telegram?.message}
      />
      <FormField
        control={control}
        name="comment"
        label="комментарий"
        component={Textarea}
        error={errors.comment?.message}
      />
      <Button
        title={isSaving ? "Сохраняем..." : "Отправить отклик"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSaving}
      />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
    </View>
  );
}
