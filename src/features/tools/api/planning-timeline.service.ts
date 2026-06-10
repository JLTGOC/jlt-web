import { apiClient } from "@/lib/api/client";

import type { PlanningConfigurationResponse } from "../types/planningTimeline";

export async function fetchPlanningConfiguration (serviceType: string): Promise<PlanningConfigurationResponse>{
const response =  await apiClient.get<{data:PlanningConfigurationResponse}>(`/planning-timeline/configs/${serviceType}`)
return response.data.data
}