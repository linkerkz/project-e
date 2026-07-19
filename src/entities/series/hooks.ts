import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CategoryKey } from "../../shared/lib/categories";
import {
  cancelMeeting,
  createSeries,
  ensureUpcomingMeetings,
  getSeriesByEditToken,
  getSeriesBySlug,
  joinSeries,
  leaveSeries,
  listMarks,
  listMeetings,
  listMembers,
  listSeries,
  rescheduleMeeting,
  updateSeries,
  upsertMark,
} from "./api";
import { addMySeries, readMemberships, readMySeries } from "./local";
import type { Series, UpdateSeriesInput } from "./types";

type SeriesFilter = {
  city?: string;
  query?: string;
  categories?: CategoryKey[];
};

export const seriesKeys = {
  all: ["series"] as const,
  list: (filter: SeriesFilter) => ["series", "list", filter] as const,
  mine: ["series", "mine"] as const,
  memberships: ["series", "memberships"] as const,
  slug: (slug: string) => ["series", "slug", slug] as const,
  edit: (editToken: string) => ["series", "edit", editToken] as const,
  meetings: (seriesId: string) => ["series", "meetings", seriesId] as const,
  members: (seriesId: string) => ["series", "members", seriesId] as const,
  marks: (meetingIds: string[]) => ["series", "marks", meetingIds] as const,
};

export function useSeries(filter: SeriesFilter = {}) {
  return useQuery({
    queryKey: seriesKeys.list(filter),
    queryFn: () => listSeries(filter),
  });
}
export function useSeriesBySlug(slug?: string) {
  return useQuery({
    queryKey: seriesKeys.slug(slug ?? ""),
    queryFn: () => getSeriesBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });
}
export function useSeriesByEditToken(editToken?: string) {
  return useQuery({
    queryKey: seriesKeys.edit(editToken ?? ""),
    queryFn: () => getSeriesByEditToken(editToken ?? ""),
    enabled: Boolean(editToken),
  });
}
export function useMySeries() {
  return useQuery({ queryKey: seriesKeys.mine, queryFn: readMySeries });
}
export function useMyMemberships() {
  return useQuery({
    queryKey: seriesKeys.memberships,
    queryFn: readMemberships,
  });
}
export function useMeetings(seriesId?: string) {
  return useQuery({
    queryKey: seriesKeys.meetings(seriesId ?? ""),
    queryFn: () => listMeetings(seriesId ?? ""),
    enabled: Boolean(seriesId),
  });
}
export function useMembers(seriesId?: string) {
  return useQuery({
    queryKey: seriesKeys.members(seriesId ?? ""),
    queryFn: () => listMembers(seriesId ?? ""),
    enabled: Boolean(seriesId),
  });
}
export function useMarks(meetingIds: string[]) {
  return useQuery({
    queryKey: seriesKeys.marks(meetingIds),
    queryFn: () => listMarks(meetingIds),
    enabled: meetingIds.length > 0,
  });
}

export function useCreateSeries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSeries,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: seriesKeys.all }),
  });
}
export function useTrackMySeries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMySeries,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: seriesKeys.mine }),
  });
}
export function useUpdateSeries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSeriesInput }) =>
      updateSeries(id, input),
    onSuccess: (series) => {
      queryClient.invalidateQueries({ queryKey: seriesKeys.all });
      queryClient.invalidateQueries({
        queryKey: seriesKeys.edit(series.edit_token),
      });
    },
  });
}
export function useEnsureUpcomingMeetings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (series: Series) => ensureUpcomingMeetings(series),
    onSuccess: (_meetings, series) =>
      queryClient.invalidateQueries({
        queryKey: seriesKeys.meetings(series.id),
      }),
  });
}
export function useRescheduleMeeting(seriesId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, startsAt }: { id: string; startsAt: string }) =>
      rescheduleMeeting(id, startsAt),
    onSuccess: () => invalidateMeetings(queryClient, seriesId),
  });
}
export function useCancelMeeting(seriesId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelMeeting,
    onSuccess: () => invalidateMeetings(queryClient, seriesId),
  });
}
export function useJoinSeries(seriesId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinSeries,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: seriesKeys.members(seriesId),
      }),
  });
}
export function useLeaveSeries(seriesId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveSeries,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: seriesKeys.members(seriesId),
      }),
  });
}
export function useUpsertMark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertMark,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["series", "marks"] }),
  });
}

function invalidateMeetings(
  queryClient: ReturnType<typeof useQueryClient>,
  seriesId: string,
) {
  queryClient.invalidateQueries({ queryKey: seriesKeys.meetings(seriesId) });
  queryClient.invalidateQueries({ queryKey: seriesKeys.all });
}
