import { Text } from "react-native";
import { BackLink } from "./BackLink";
import { ErrorText } from "./ErrorText";
import { Page } from "./Page";

export function ActivityNotFound({ error }: { error?: unknown }) {
  return (
    <Page>
      <BackLink />
      <Text>Активность не найдена</Text>
      <ErrorText error={error} fallback="Не удалось загрузить активность" />
    </Page>
  );
}
