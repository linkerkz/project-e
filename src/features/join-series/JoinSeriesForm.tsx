import type { UseFormReturn } from "react-hook-form";
import { Text, View } from "react-native";
import type { JoinSeriesForm as JoinForm } from "../../entities/series/schemas";
import { Button } from "../../shared/ui/Button";
import { ErrorText } from "../../shared/ui/ErrorText";
import { FormField } from "../../shared/ui/FormField";

type Props = {
  form: UseFormReturn<JoinForm>;
  isJoining: boolean;
  onSubmit: (values: JoinForm) => void;
};

export function JoinSeriesForm({ form, isJoining, onSubmit }: Props) {
  const { control, handleSubmit } = form;
  const { errors } = form.formState;

  return (
    <View className="gap-3 border border-gray-400 p-3">
      <Text className="text-xl font-bold">Хожу постоянно</Text>
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
      <Button
        title={isJoining ? "Записываем..." : "Записаться в серию"}
        onPress={handleSubmit(onSubmit)}
        disabled={isJoining}
      />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
    </View>
  );
}
