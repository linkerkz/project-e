import { useState } from "react";
import { Text } from "react-native";
import { CreateActivityForm } from "../src/features/create-activity/CreateActivityForm";
import { CreateSeriesForm } from "../src/features/create-series/CreateSeriesForm";
import { BackLink } from "../src/shared/ui/BackLink";
import { Page } from "../src/shared/ui/Page";
import { Select } from "../src/shared/ui/Select";

type Mode = "activity" | "series";

const modeOptions: { value: Mode; label: string }[] = [
  { value: "activity", label: "разовое" },
  { value: "series", label: "регулярное" },
];

export default function CreatePage() {
  const [mode, setMode] = useState<Mode>("activity");

  return (
    <Page>
      <BackLink />
      <Text className="text-2xl font-bold">Создать</Text>
      <Select
        label="тип мероприятия"
        value={mode}
        onChange={setMode}
        options={modeOptions}
      />
      {mode === "activity" ? <CreateActivityForm /> : <CreateSeriesForm />}
    </Page>
  );
}
