import { type Control, Controller } from "react-hook-form";
import { Text, View } from "react-native";
import type { CreateSeriesFormInput } from "../../entities/series/schemas";
import type {
  Recurrence,
  RecurrenceEnd,
  RecurrenceUnit,
} from "../../entities/series/types";
import { listOccurrences } from "../../entities/series/utils";
import { DateTimeInput } from "../../shared/ui/DateTimeInput";
import { FormField } from "../../shared/ui/FormField";
import { Input } from "../../shared/ui/Input";
import { MultiSelect } from "../../shared/ui/MultiSelect";
import { Select } from "../../shared/ui/Select";

type RecurrenceDraft = CreateSeriesFormInput["recurrence"];
type EndDraft = RecurrenceDraft["end"];

type Props = {
  control: Control<CreateSeriesFormInput>;
  recurrence: RecurrenceDraft;
  startsAt: string;
  errors: {
    interval?: string;
    weekdays?: string;
    endDate?: string;
    endCount?: string;
  };
};

const unitOptions: { value: RecurrenceUnit; label: string }[] = [
  { value: "day", label: "день" },
  { value: "week", label: "неделя" },
  { value: "month", label: "месяц" },
];

const weekdayOptions = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map(
  (label, index) => ({ value: String(index), label }),
);

const endOptions: { value: RecurrenceEnd["kind"]; label: string }[] = [
  { value: "never", label: "бессрочно" },
  { value: "until", label: "до даты" },
  { value: "count", label: "N встреч" },
];

export function RecurrenceFields({
  control,
  recurrence,
  startsAt,
  errors,
}: Props) {
  return (
    <View className="gap-3 border border-gray-400 p-3">
      <Text className="text-xl font-bold">Правило повторения</Text>
      <FormField
        control={control}
        name="recurrence.interval"
        label="интервал, число"
        error={errors.interval}
      />
      <Controller
        control={control}
        name="recurrence.unit"
        render={({ field }) => (
          <Select
            label="единица"
            value={field.value}
            onChange={field.onChange}
            options={unitOptions}
          />
        )}
      />
      <Controller
        control={control}
        name="recurrence.weekdays"
        render={({ field }) => (
          <MultiSelect
            label="дни недели (для недельного правила)"
            values={(field.value ?? []).map(String)}
            onChange={(values) => field.onChange(values.map(Number))}
            options={weekdayOptions}
            error={errors.weekdays}
          />
        )}
      />
      <Controller
        control={control}
        name="recurrence.end"
        render={({ field }) => (
          <EndEditor
            value={field.value}
            onChange={field.onChange}
            dateError={errors.endDate}
            countError={errors.endCount}
          />
        )}
      />
      <SchedulePreview recurrence={recurrence} startsAt={startsAt} />
    </View>
  );
}

type EndEditorProps = {
  value: EndDraft;
  onChange: (end: RecurrenceEnd) => void;
  dateError?: string;
  countError?: string;
};

function EndEditor({ value, onChange, dateError, countError }: EndEditorProps) {
  return (
    <View className="gap-3">
      <Select
        label="окончание"
        value={value.kind}
        onChange={(kind) => onChange(defaultEnd(kind))}
        options={endOptions}
      />
      {value.kind === "until" ? (
        <DateTimeInput
          label="дата окончания"
          value={value.date}
          onChangeText={(date) => onChange({ kind: "until", date })}
          error={dateError}
        />
      ) : null}
      {value.kind === "count" ? (
        <Input
          label="число встреч"
          value={String(value.count)}
          onChangeText={(count) =>
            onChange({ kind: "count", count: Number(count) || 0 })
          }
          error={countError}
        />
      ) : null}
    </View>
  );
}

function SchedulePreview({
  recurrence,
  startsAt,
}: {
  recurrence: RecurrenceDraft;
  startsAt: string;
}) {
  const dates = listOccurrences(toRecurrence(recurrence), startsAt);
  if (dates.length === 0) {
    return (
      <Text className="text-gray-600">Ближайшие даты появятся здесь.</Text>
    );
  }

  return (
    <View className="gap-1">
      <Text className="font-bold">Ближайшие встречи:</Text>
      {dates.map((date) => (
        <Text key={date}>{new Date(date).toLocaleString()}</Text>
      ))}
    </View>
  );
}

function defaultEnd(kind: RecurrenceEnd["kind"]): RecurrenceEnd {
  if (kind === "until") return { kind: "until", date: "" };
  if (kind === "count") return { kind: "count", count: 1 };
  return { kind: "never" };
}

// Черновик формы держит coerce-поля нестрого (interval/count как ввод) — нормализуем
// к доменному правилу, чтобы посчитать превью дат.
function toRecurrence(draft: RecurrenceDraft): Recurrence {
  return {
    interval: positiveInterval(draft.interval),
    unit: draft.unit,
    weekdays: draft.weekdays ?? [],
    end: toEnd(draft.end),
  };
}

// Нецифру, ноль и отрицательные значения превью считает шагом в 1, чтобы не
// рисовать вырожденное расписание (реальную валидацию делает схема на сабмите).
function positiveInterval(value: RecurrenceDraft["interval"]): number {
  const parsed = Math.trunc(Number(value));
  return parsed >= 1 ? parsed : 1;
}

function toEnd(end: EndDraft): RecurrenceEnd {
  if (end.kind === "count") return { kind: "count", count: Number(end.count) };
  return end;
}
