import { Text } from "react-native";
import { useCreateActivityForm } from "../src/features/create-activity/useCreateActivityForm";
import { BackLink } from "../src/shared/ui/BackLink";
import { Button } from "../src/shared/ui/Button";
import { DateTimeInput } from "../src/shared/ui/DateTimeInput";
import { ErrorText } from "../src/shared/ui/ErrorText";
import { FormField } from "../src/shared/ui/FormField";
import { Page } from "../src/shared/ui/Page";
import { Textarea } from "../src/shared/ui/Textarea";

export default function CreatePage() {
  const { form, submit, isSaving } = useCreateActivityForm();
  const { control, handleSubmit } = form;
  const { errors } = form.formState;

  return (
    <Page>
      <BackLink />
      <Text className="text-2xl font-bold">Создать активность</Text>
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
      <Button
        title={isSaving ? "Сохраняем..." : "Создать"}
        onPress={handleSubmit(submit)}
      />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
    </Page>
  );
}
