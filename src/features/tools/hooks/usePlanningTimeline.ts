import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPlanningConfiguration,
  saveTemplateConfiguration,
  fetchTemplateList,
  fetchServiceTypeEnums,
  createTemplate,
} from "@/features/tools/api/planning-timeline.service";

import type {
  PlanningConfigurationResponse,
  TemplateListResponse,
  ServiceTypeResponse,
  TemplateConfigurationPayload,
} from "../types/planningTimeline";

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

export function useServiceTypeEnums(sericeType: string) {
  return useQuery<ServiceTypeResponse[]>({
    queryKey: ["service-type-enums"],
    queryFn: () => fetchServiceTypeEnums(sericeType),
  });
}

export function useCreateTemplate(serviceType: string) {
  const queryClient = useQueryClient();
const navigate = useNavigate()

  return useMutation({
    mutationFn: ( payload: TemplateConfigurationPayload ) =>
      createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planning-template-list"],
      });
      navigate("/tools/planning-timeline", {state: {serviceType}})
    },
  });
}
