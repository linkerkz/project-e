import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  cancelReminder,
  scheduleReminder,
} from "../../entities/reminder/schedule";
import {
  useJoinSeries as useJoinSeriesMutation,
  useLeaveSeries,
} from "../../entities/series/hooks";
import {
  addMembership,
  findMembership,
  type Membership,
  removeMembership,
} from "../../entities/series/local";
import { mapJoinFormToMemberInput } from "../../entities/series/mappers";
import {
  type JoinSeriesForm,
  joinSeriesSchema,
} from "../../entities/series/schemas";
import type { Meeting, Series } from "../../entities/series/types";
import { nextMeeting } from "../../entities/series/utils";
import { setFormServerError } from "../../shared/lib/setFormServerError";

const emptyForm: JoinSeriesForm = { name: "", telegram: "" };

export function useJoinSeries(series?: Series, meetings: Meeting[] = []) {
  const seriesId = series?.id ?? "";
  const slug = series?.slug ?? "";
  const joinMutation = useJoinSeriesMutation(seriesId);
  const leaveMutation = useLeaveSeries(seriesId);
  const { membership, setMembership } = useMembership(slug);
  const form = useForm<JoinSeriesForm>({
    resolver: zodResolver(joinSeriesSchema),
    defaultValues: emptyForm,
  });

  async function join(values: JoinSeriesForm) {
    if (!series) return;

    try {
      form.clearErrors("root.server");
      const member = await joinMutation.mutateAsync(
        mapJoinFormToMemberInput(series.id, values),
      );
      const next = { seriesSlug: series.slug, memberId: member.id };
      setMembership(next);
      form.reset(emptyForm);
      // Запись на сервере уже прошла — сбой device-local хранилища не показываем
      // как ошибку записи, иначе ретрай создаст дубль участника.
      await addMembership(next).catch(() => {});
      // Напоминание некритично: сбой не роняет успешную запись в серию.
      await planReminder(series, meetings).catch(() => {});
    } catch (error) {
      setFormServerError(form.setError, "Не удалось записаться в серию", error);
    }
  }

  async function leave() {
    if (!membership) return;

    try {
      form.clearErrors("root.server");
      await leaveMutation.mutateAsync(membership.memberId);
      await removeMembership(membership.seriesSlug);
      await cancelReminder(membership.seriesSlug).catch(() => {});
      setMembership(null);
    } catch (error) {
      setFormServerError(form.setError, "Не удалось выйти из серии", error);
    }
  }

  return {
    membership,
    form,
    join,
    leave,
    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
  };
}

// Напоминание серии — на ближайшую будущую встречу. Нет встреч впереди — молча
// пропускаем (запланировать нечего).
async function planReminder(series: Series, meetings: Meeting[]) {
  const meeting = nextMeeting(meetings);
  if (meeting == null) return;

  await scheduleReminder({
    slug: series.slug,
    title: series.title,
    startsAt: meeting.starts_at,
  });
}

// «Ты ходишь постоянно» — это наличие device-local записи по slug серии.
function useMembership(slug: string) {
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    if (slug === "") return;
    let active = true;
    findMembership(slug)
      .then((found) => {
        if (active) setMembership(found);
      })
      .catch(() => {
        if (active) setMembership(null);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return { membership, setMembership };
}
