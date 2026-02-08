/**
 * @file useData.ts
 * @description Custom hooks for data fetching with TanStack Query (no caching)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService, type CreateDataPayload, type UpdateDataPayload } from "../services/data.service";
import { toast } from "sonner";

export const dataKeys = {
  all: ["data"] as const,
  lists: () => [...dataKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) => [...dataKeys.lists(), filters] as const,
  details: () => [...dataKeys.all, "detail"] as const,
  detail: (id: string) => [...dataKeys.details(), id] as const,
};

export function useData() {
  return useQuery({
    queryKey: dataKeys.lists(),
    queryFn: () => dataService.getAll(),
  });
}

export function useDataById(id: string | null | undefined) {
  return useQuery({
    queryKey: dataKeys.detail(id!),
    queryFn: () => {
      if (!id) throw new Error("ID is required");
      return dataService.getById(id);
    },
    enabled: !!id,
  });
}

export function useCreateData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDataPayload) => dataService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataKeys.lists() });
      toast.success("Data item created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create data item");
    },
  });
}

export function useUpdateData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDataPayload }) =>
      dataService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dataKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: dataKeys.lists() });
      toast.success("Data item updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update data item");
    },
  });
}

export function useDeleteData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dataService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dataKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dataKeys.lists() });
      toast.success("Data item deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete data item");
    },
  });
}

