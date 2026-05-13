import { apiClient } from "@/lib/api/client";
import type { JobOrderDetail } from "../types/jobOrderDetail";

export async function fetchJobOrderDetail(
  jobOrderId: number | string,
): Promise<JobOrderDetail> {
  const response = await apiClient.get<{ data: unknown }>(
    `/job-orders/${jobOrderId}`,
  );

  if (!response || !response.data) {
    throw new Error("Failed to fetch job order detail.");
  }

  return response.data.data as JobOrderDetail;
}
