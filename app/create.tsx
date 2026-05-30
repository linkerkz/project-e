import type { ComponentType } from "react";
import { Controller } from "react-hook-form";
import { Text } from "react-native";
import type { CreateActivityForm } from "../src/entities/activity/schemas";
import { useCreateActivityForm } from "../src/features/create-activity/useCreateActivityForm";
import { getRussianErrorMessage } from "../src/shared/errors/getRussianErrorMessage";
import { Button } from "../src/shared/ui/Button";
import { DateTimeInput } from "../src/shared/ui/DateTimeInput";
import { ErrorText } from "../src/shared/ui/ErrorText";
import { Input, type InputProps } from "../src/shared/ui/Input";
import { Page } from "../src/shared/ui/Page";
import { Textarea } from "../src/shared/ui/Textarea";
import { BackLink } from "./_layout";

export default function CreatePage() {
  const { form, submit, mutation } = useCreateActivityForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const field = (
    name: keyof CreateActivityForm,
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
      <Text className="text-2xl font-bold">Создать активность</Text>
      {field("title", "название, обязательно")}
      {field("description", "описание", Textarea)}
      {field("city", "город, обязательно")}
      {field("location_text", "место текстом")}
      {field("starts_at", "дата и время, обязательно", DateTimeInput)}
      {field("capacity", "лимит мест, число или пусто")}
      {field("cover_url", "ссылка на обложку")}
      <Button
        title={mutation.isPending ? "Сохраняем..." : "Создать"}
        onPress={handleSubmit(submit)}
      />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
      <ErrorText>
        {mutation.error
          ? getRussianErrorMessage(mutation.error, {
              fallback: "Не удалось создать активность",
            })
          : null}
      </ErrorText>
    </Page>
  );
}
