import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toolsQueryKeys } from "../config/queryKeys";
import {
  billingConfigsService,
  type BillingConfigResource,
  type BillingConfigType,
} from "../api/billing-configs.service";
import { toolNotifications } from "../utils/toolNotifications";

type BillingQueryData =
  | { data?: Record<BillingConfigType, BillingConfigResource[]> }
  | undefined;

export function useBillingConfigMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: billingConfigsService.createBillingConfig,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.billingConfigs,
      });
      const previous = queryClient.getQueryData<BillingQueryData>(
        toolsQueryKeys.billingConfigs,
      );

      queryClient.setQueryData(
        toolsQueryKeys.billingConfigs,
        (current: BillingQueryData) => {
          const optimisticItem: BillingConfigResource = {
            id: Date.now(),
            label: payload.label,
            type: payload.type,
          };

          const nextData = current?.data ?? {
            "RECEIPT CHARGES": [],
            CURRENCY: [],
            UOM: [],
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
        queryKey: toolsQueryKeys.billingConfigs,
      });
      toolNotifications.success("Billing configuration added");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.billingConfigs,
          context.previous,
        );
      }
      toolNotifications.error("Failed to save billing configuration");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { label: string } }) =>
      billingConfigsService.updateBillingConfig(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.billingConfigs,
      });
      const previous = queryClient.getQueryData<BillingQueryData>(
        toolsQueryKeys.billingConfigs,
      );

      queryClient.setQueryData(
        toolsQueryKeys.billingConfigs,
        (current: BillingQueryData) => {
          if (!current?.data) {
            return current;
          }

          return {
            ...current,
            data: {
              ...current.data,
              "RECEIPT CHARGES": (current.data["RECEIPT CHARGES"] ?? []).map(
                (item) =>
                  item.id === id ? { ...item, label: payload.label } : item,
              ),
              CURRENCY: (current.data.CURRENCY ?? []).map((item) =>
                item.id === id ? { ...item, label: payload.label } : item,
              ),
              UOM: (current.data.UOM ?? []).map((item) =>
                item.id === id ? { ...item, label: payload.label } : item,
              ),
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.billingConfigs,
      });
      toolNotifications.success("Billing configuration updated");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.billingConfigs,
          context.previous,
        );
      }
      toolNotifications.error("Failed to update billing configuration");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => billingConfigsService.deleteBillingConfig(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.billingConfigs,
      });
      const previous = queryClient.getQueryData<BillingQueryData>(
        toolsQueryKeys.billingConfigs,
      );

      queryClient.setQueryData(
        toolsQueryKeys.billingConfigs,
        (current: BillingQueryData) => {
          if (!current?.data) {
            return current;
          }

          return {
            ...current,
            data: {
              ...current.data,
              "RECEIPT CHARGES": (current.data["RECEIPT CHARGES"] ?? []).filter(
                (item) => item.id !== id,
              ),
              CURRENCY: (current.data.CURRENCY ?? []).filter(
                (item) => item.id !== id,
              ),
              UOM: (current.data.UOM ?? []).filter((item) => item.id !== id),
            },
          };
        },
      );

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.billingConfigs,
      });
      toolNotifications.success("Billing configuration deleted");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          toolsQueryKeys.billingConfigs,
          context.previous,
        );
      }
      toolNotifications.error("Failed to delete billing configuration");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
