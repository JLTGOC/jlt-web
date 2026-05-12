import { apiClient } from "@/lib/api/client";

export async function acceptJobOrder(jobOrderID: number): Promise<void> {
  await apiClient.put(`/job-orders/${jobOrderID}/accept`);
}

export async function reassignRequestJobOrder(
  jobOrderID: number,
  reason: string,
  additional_details: string | null,
): Promise<void> {
  await apiClient.post(`/job-orders/${jobOrderID}/request-reassignment`, {
    reason,
    additional_details,
  });
}

export async function reassignJobOrder(jobOrderID: number, status: string, operations_id: number | null):Promise<void>{
  const response = await apiClient.put(`/job-orders/${jobOrderID}/reassign-ops`,{status, operations_id: operations_id ?? null})

  return response.data
}

export async function reassignJobOrderDetails(reassignMentRequestID: number |  null): Promise<void>{
  const response = await apiClient.get(`/reassignment-requests/${reassignMentRequestID}`)

return response.data.data
}