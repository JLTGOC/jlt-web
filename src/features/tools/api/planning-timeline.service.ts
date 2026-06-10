import { apiClient } from "@/lib/api/client";

import type { PlanningConfigurationResponse } from "../types/planningTimeline";

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
  await apiClient.put(`/planning-timeline/configs/${serviceType}`, {version_number, phases, processes, tasks});
}
