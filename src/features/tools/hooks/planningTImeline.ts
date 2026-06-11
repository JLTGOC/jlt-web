import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPlanningConfiguration,
  saveTemplateConfiguration,
  fetchTemplateList,
} from "@/features/tools/api/planning-timeline.service";
import type { PlanningConfigurationResponse, TemplateListResponse } from "../types/planningTimeline";
export function usePlanningConfigurations(serviceType: string) {
  return useQuery({
    queryKey: ["planning-configuration", serviceType],
    queryFn: () => fetchPlanningConfiguration(serviceType),
    enabled: !!serviceType,
  });
}

export function useSavePlanningConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      serviceType,
    }: {
      payload: PlanningConfigurationResponse;
      serviceType: string;
    }) => saveTemplateConfiguration(payload, serviceType),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["planning-configuration", variables.serviceType],
      });
    },
  });
}

export function usePlanningTemplateList() {
  return useQuery<TemplateListResponse[]>({
    queryKey: ["planning-template-list"],
    queryFn: () => fetchTemplateList(),
  });
}
