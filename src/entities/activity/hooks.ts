import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createActivity,
  getActivityByEditToken,
  getActivityBySlug,
  listActivities,
  updateActivity,
} from "./api";
import { addMyActivity, readMyActivities } from "./local";
import type { UpdateActivityInput } from "./types";

export const activityKeys = {
  all: ["activities"] as const,
  mine: ["activities", "mine"] as const,
  slug: (slug: string) => ["activities", "slug", slug] as const,
  edit: (editToken: string) => ["activities", "edit", editToken] as const,
};

export function useActivities() {
  return useQuery({ queryKey: activityKeys.all, queryFn: listActivities });
}
export function useActivityBySlug(slug?: string) {
  return useQuery({
    queryKey: activityKeys.slug(slug ?? ""),
    queryFn: () => getActivityBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });
}
export function useActivityByEditToken(editToken?: string) {
  return useQuery({
    queryKey: activityKeys.edit(editToken ?? ""),
    queryFn: () => getActivityByEditToken(editToken ?? ""),
    enabled: Boolean(editToken),
  });
}
export function useMyActivities() {
  return useQuery({ queryKey: activityKeys.mine, queryFn: readMyActivities });
}
export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createActivity,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: activityKeys.all }),
  });
}
export function useTrackMyActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMyActivity,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: activityKeys.mine }),
  });
}
export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateActivityInput }) =>
      updateActivity(id, input),
    onSuccess: (activity) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({
        queryKey: activityKeys.edit(activity.edit_token),
      });
    },
  });
}
