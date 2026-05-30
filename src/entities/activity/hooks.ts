import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createActivity,
  getActivityByEditToken,
  getActivityBySlug,
  listActivities,
  updateActivity,
} from "./api";
import type { UpdateActivityInput } from "./types";

export const activityKeys = {
  all: ["activities"] as const,
  slug: (slug: string) => ["activities", "slug", slug] as const,
  edit: (token: string) => ["activities", "edit", token] as const,
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
export function useActivityByEditToken(token?: string) {
  return useQuery({
    queryKey: activityKeys.edit(token ?? ""),
    queryFn: () => getActivityByEditToken(token ?? ""),
    enabled: Boolean(token),
  });
}
export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createActivity,
    onSuccess: () => qc.invalidateQueries({ queryKey: activityKeys.all }),
  });
}
export function useUpdateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateActivityInput }) =>
      updateActivity(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: activityKeys.all }),
  });
}
