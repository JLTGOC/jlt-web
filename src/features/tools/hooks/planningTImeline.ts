import { useQuery } from "@tanstack/react-query";
import { fetchPlanningConfiguration } from "@/features/tools/api/planning-timeline.service";

export function usePlanningConfigurations(serviceType: string) {
  return useQuery({
    queryKey: ["planning-configuration", serviceType],
    queryFn: () => fetchPlanningConfiguration(serviceType),
    enabled: !!serviceType,
  });
}