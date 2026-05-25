import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toolsQueryKeys } from "../config/queryKeys";
import {
  detailsConfigsService,
  type DetailConfigOption,
  type DetailConfigResource,
  type DetailConfigType,
} from "../api/details-configs.service";
import { toolNotifications } from "../utils/toolNotifications";

type DetailsQueryData =
  | { data?: Record<DetailConfigType, DetailConfigResource[]> }
  | undefined;

export function useDetailsConfigMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: detailsConfigsService.createDetailsConfig,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.detailsConfigs,
      });
      const previous = queryClient.getQueryData<DetailsQueryData>(
        toolsQueryKeys.detailsConfigs,
      );

      queryClient.setQueryData(
        toolsQueryKeys.detailsConfigs,
        (current: DetailsQueryData) => {
          const optimisticItem: DetailConfigResource = {
            id: Date.now(),
            label: payload.label,
            type: payload.type,
            ...(payload.type === "DROPDOWN"
              ? { count: payload.options?.length ?? 0 }
              : {}),
          };

          const nextData = current?.data ?? {
            DROPDOWN: [],
            TEXT: [],
            "DATE PICKER": [],
          };

          return {
            ...current,
            data: {
              ...nextData,
              [payload.type]: [
                ...(nextData[payload.type] ?? []),
                optimisticItem,
              ],
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.detailsConfigs,
      });
      toolNotifications.success("Details configuration added");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.detailsConfigs,
          context.previous,
        );
      }
      toolNotifications.error("Failed to save details configuration");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { label: string; options?: DetailConfigOption[] };
    }) => detailsConfigsService.updateDetailsConfig(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.detailsConfigs,
      });
      const previous = queryClient.getQueryData<DetailsQueryData>(
        toolsQueryKeys.detailsConfigs,
      );

      queryClient.setQueryData(
        toolsQueryKeys.detailsConfigs,
        (current: DetailsQueryData) => {
          if (!current?.data) {
            return current;
          }

          const updateItem = (item: DetailConfigResource) =>
            item.id === id
              ? {
                  ...item,
                  label: payload.label,
                  ...(item.type === "DROPDOWN" && payload.options
                    ? { count: payload.options.length }
                    : {}),
                }
              : item;

          return {
            ...current,
            data: {
              ...current.data,
              DROPDOWN: (current.data.DROPDOWN ?? []).map(updateItem),
              TEXT: (current.data.TEXT ?? []).map(updateItem),
              "DATE PICKER": (current.data["DATE PICKER"] ?? []).map(
                updateItem,
              ),
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.detailsConfigs,
      });
      toolNotifications.success("Details configuration updated");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.detailsConfigs,
          context.previous,
        );
      }
      toolNotifications.error("Failed to update details configuration");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => detailsConfigsService.deleteDetailsConfig(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.detailsConfigs,
      });
      const previous = queryClient.getQueryData<DetailsQueryData>(
        toolsQueryKeys.detailsConfigs,
      );

      queryClient.setQueryData(
        toolsQueryKeys.detailsConfigs,
        (current: DetailsQueryData) => {
          if (!current?.data) {
            return current;
          }

          return {
            ...current,
            data: {
              ...current.data,
              DROPDOWN: (current.data.DROPDOWN ?? []).filter(
                (item) => item.id !== id,
              ),
              TEXT: (current.data.TEXT ?? []).filter((item) => item.id !== id),
              "DATE PICKER": (current.data["DATE PICKER"] ?? []).filter(
                (item) => item.id !== id,
              ),
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.detailsConfigs,
      });
      toolNotifications.success("Details configuration deleted");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.detailsConfigs,
          context.previous,
        );
      }
      toolNotifications.error("Failed to delete details configuration");
    },
  });

  const detailsByIdMutation = useMutation({
    mutationFn: (id: number) => detailsConfigsService.getDetailsConfig(id),
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    detailsByIdMutation,
  };
}
