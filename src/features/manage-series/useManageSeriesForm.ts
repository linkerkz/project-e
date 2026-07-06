import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCancelMeeting,
  useEnsureUpcomingMeetings,
  useMeetings,
  useMembers,
  useRescheduleMeeting,
  useSeriesByEditToken,
  useUpdateSeries,
} from "../../entities/series/hooks";
import {
  mapSeriesToUpdateForm,
  mapUpdateSeriesFormToInput,
} from "../../entities/series/mappers";
import {
  type UpdateSeriesForm,
  type UpdateSeriesFormInput,
  updateSeriesSchema,
} from "../../entities/series/schemas";
import { toIsoDate } from "../../shared/lib/datetime";
import { buildSeriesPublicUrl } from "../../shared/lib/publicUrl";
import { setFormServerError } from "../../shared/lib/setFormServerError";

export function useManageSeriesForm() {
  const { editToken } = useLocalSearchParams<{ editToken: string }>();
  const seriesQuery = useSeriesByEditToken(editToken);
  const series = seriesQuery.data;
  const seriesId = series?.id ?? "";
  const meetingsQuery = useMeetings(series?.id);
  const membersQuery = useMembers(series?.id);
  const updateMutation = useUpdateSeries();
  const rescheduleMutation = useRescheduleMeeting(seriesId);
  const cancelMutation = useCancelMeeting(seriesId);
  const { mutate: ensureMeetings } = useEnsureUpcomingMeetings();
  const form = useForm<UpdateSeriesFormInput, unknown, UpdateSeriesForm>({
    resolver: zodResolver(updateSeriesSchema),
    values: series ? mapSeriesToUpdateForm(series) : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  // Слоты создаются лениво при открытии управления: досоздаём недостающие
  // встречи до горизонта, повторный прогон ничего не дублирует.
  useEffect(() => {
    if (series) ensureMeetings(series);
  }, [series, ensureMeetings]);

  const publicUrl = series ? buildSeriesPublicUrl(series.slug) : "";

  async function submit(values: UpdateSeriesForm) {
    if (!series) return;

    try {
      form.clearErrors("root.server");
      await updateMutation.mutateAsync({
        id: series.id,
        input: mapUpdateSeriesFormToInput(values),
      });
    } catch (error) {
      setFormServerError(form.setError, "Не удалось сохранить серию", error);
    }
  }

  async function rescheduleMeeting(id: string, startsAt: string) {
    await rescheduleMutation.mutateAsync({ id, startsAt: toIsoDate(startsAt) });
  }

  async function cancelMeeting(id: string) {
    await cancelMutation.mutateAsync(id);
  }

  async function finishSeries() {
    if (!series) return;

    try {
      form.clearErrors("root.server");
      await updateMutation.mutateAsync({
        id: series.id,
        input: { status: "finished" },
      });
    } catch (error) {
      setFormServerError(form.setError, "Не удалось завершить серию", error);
    }
  }

  return {
    series,
    isLoading: seriesQuery.isLoading,
    loadError: seriesQuery.error,
    meetings: meetingsQuery.data ?? [],
    meetingsLoading: meetingsQuery.isLoading,
    members: membersQuery.data ?? [],
    membersLoading: membersQuery.isLoading,
    publicUrl,
    form,
    submit,
    rescheduleMeeting,
    cancelMeeting,
    finishSeries,
    isSaving: updateMutation.isPending,
  };
}
