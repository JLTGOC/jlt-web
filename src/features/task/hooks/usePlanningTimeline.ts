import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { TemplateListResponse,  } from "@/features/tools/types/planningTimeline";
import type { PlanningTemplateResponse } from "../types/planningTimeline";

import { fetchTemplateList, fetchTemplateDetails } from "../api/planning-timeline.service";

export function useTemplateList(serviceType: string){
    console.log(serviceType)
 return useQuery<TemplateListResponse[]>({
     queryKey: ["planning-template-list"],
     queryFn: () => fetchTemplateList(serviceType)
 })
}

export function useTemplateDetails(templateId: number){
    return useQuery<PlanningTemplateResponse[]>({
        queryKey: ["planning-template-details"],
        queryFn: () => fetchTemplateDetails(templateId)
    })
}