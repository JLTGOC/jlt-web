import { apiClient } from "@/lib/api/client";

import type {
  PlanningConfigurationResponse,
  TemplateListResponse,
  ServiceTypeResponse,
  TemplateConfigurationPayload,
  TemplateDetailsResponse,
} from "../types/planningTimeline";

export async function fetchPlanningConfiguration(
  serviceType: string,
): Promise<PlanningConfigurationResponse> {
  const response = await apiClient.get<{ data: PlanningConfigurationResponse }>(
    `/planning-timeline/configs/${serviceType}`,
  );

  return response.data.data;
}

export async function saveTemplateConfiguration(
  payload: PlanningConfigurationResponse,
  serviceType: string,
): Promise<void> {
  const version_number = payload.version_number;
  const phases = payload.phases;
  const processes = payload.processes;
  const tasks = payload.tasks;

  await apiClient.put(`/planning-timeline/configs/${serviceType}`, {
    version_number,
    phases,
    processes,
    tasks,
  });
}

export async function fetchTemplateList(): Promise<TemplateListResponse[]> {
  const response = await apiClient.get<{ data: TemplateListResponse[] }>(
    `/planning-timeline/templates`,
  );

  return response.data.data;
}

export async function fetchServiceTypeEnums(
  serviceType: any,
): Promise<ServiceTypeResponse[]> {
  const response = await apiClient.get<{ data: ServiceTypeResponse[] }>(
    `/service-types`,
    { params: { service_category: serviceType } },
  );

  return response.data.data;
}

export async function createTemplate(payload: TemplateConfigurationPayload) {
  return await apiClient.post(`/planning-timeline/templates`, payload );
}

export async function fetchTemplateDetails(
  templateId: number,
): Promise<TemplateDetailsResponse> {
  const response = await apiClient.get<{ data: TemplateDetailsResponse }>(
    `/planning-timeline/templates/${templateId}`,
  );

  return response.data.data;
}

export async function updateTemplateDetails(
  templateId: number,
  payload: TemplateDetailsResponse,
): Promise<TemplateDetailsResponse> {
  const response = await apiClient.put<{ data: TemplateDetailsResponse }>(
    `/planning-timeline/templates/${templateId}`,
    payload,
  );

  return response.data.data;
}
