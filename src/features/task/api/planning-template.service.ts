import { apiClient } from "@/lib/api/client";
import type { TemplateListResponse } from "@/features/tools/types/planningTimeline";
import type { PlanningTemplateResponse } from "../types/planningTemplate";

export async function fetchTemplateList(
  serviceType: string,
): Promise<TemplateListResponse[]> {
  const response = await apiClient.get<{ data: TemplateListResponse[] }>(
    `/planning-timeline/templates`,
    {
      params: { "filter[service]": serviceType },
    },
  );

  return response.data.data;
}

export async function fetchTemplateDetails(
  templateId: number,
): Promise<PlanningTemplateResponse[]> {
  const response = await apiClient.get<{ data: PlanningTemplateResponse[] }>(
    `/planning-timeline/templates/{template}`,
    { params: { template: templateId } },
  );

  return response.data.data;
}
