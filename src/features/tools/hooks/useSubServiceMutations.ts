import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  StoreSubServiceRequest,
  SubServiceResource,
  UpdateSubServiceRequest,
} from "../api/sub-services.service";
import { subServicesService } from "../api/sub-services.service";
import { toolNotifications } from "../utils/toolNotifications";

type SubServicesQueryData = { data?: SubServiceResource[] } | undefined;

export function useSubServiceMutations(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: StoreSubServiceRequest) =>
      subServicesService.createSubService(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<SubServicesQueryData>(queryKey);

      queryClient.setQueryData(queryKey, (current: SubServicesQueryData) => ({
        ...current,
        data: [
          ...(current?.data ?? []),
          {
            id: Date.now(),
            name: payload.name,
            status: "ENABLED",
            service_type: payload.service_type,
          },
        ],
      }));

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toolNotifications.success("Sub-service created successfully");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }

      toolNotifications.error("Failed to create sub-service");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateSubServiceRequest;
    }) => subServicesService.updateSubService(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<SubServicesQueryData>(queryKey);

      queryClient.setQueryData(queryKey, (current: SubServicesQueryData) => ({
        ...current,
        data: (current?.data ?? []).map((item) =>
          item.id === id
            ? {
                ...item,
                name: payload.name ?? item.name,
                status: payload.status ?? item.status,
              }
            : item,
        ),
      }));

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toolNotifications.success("Sub-service updated successfully");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }

      toolNotifications.error("Failed to update sub-service");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => subServicesService.deleteSubService(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<SubServicesQueryData>(queryKey);

      queryClient.setQueryData(queryKey, (current: SubServicesQueryData) => ({
        ...current,
        data: (current?.data ?? []).filter((item) => item.id !== id),
      }));

      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toolNotifications.success("Sub-service deleted successfully");
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }

      toolNotifications.error("Failed to delete sub-service");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
