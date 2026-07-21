import { useState } from "react";
import { Text, View } from "react-native";
import {
  type AddToCalendarResult,
  addToCalendar,
  type CalendarEvent,
} from "../lib/calendar";
import { Button } from "./Button";

type Props = {
  event: CalendarEvent;
};

type Notice = { text: string; isError: boolean };

export function AddToCalendarButton({ event }: Props) {
  const [notice, setNotice] = useState<Notice | null>(null);

  async function add() {
    const result = await addToCalendar(event);
    setNotice(noticeFor(result));
  }

  return (
    <View className="gap-1">
      <Button title="Добавить в календарь" onPress={add} />
      {notice ? (
        <Text className={notice.isError ? "text-red-700" : "text-gray-600"}>
          {notice.text}
        </Text>
      ) : null}
    </View>
  );
}

function noticeFor(result: AddToCalendarResult): Notice | null {
  if (result.kind === "downloaded") {
    return {
      text: "Файл события скачан — открой его, чтобы добавить в календарь",
      isError: false,
    };
  }
  if (result.kind === "error") return { text: result.message, isError: true };

  return null;
}
