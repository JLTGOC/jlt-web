import { apiClient } from "@/lib/api/client";
import type {
  FetchRequestedQuotationsParams,
  QuotationsResponse,
  ReassignEnumsResponse,
  ReassignQuotationSpecificDetailsResponse,
} from "../../types/quotations.types";

export async function acceptQuotation(
  quotationID: number | string,
): Promise<void> {
  await apiClient.put(`/quotations/${quotationID}/accept-assignment`);
}

export async function reassignQuotation(
  quotationID: number | string,
  status: string,
  as_id: number | null,
): Promise<void> {
  const normalizedAsId = as_id ?? null;

  await apiClient.put(`/quotations/${quotationID}/reassign-specialist`, {
    status,
    as_id: normalizedAsId,
  });
}

export async function reassignRequest(
  quotationID: number | string,
  reason: string,
  additional_details: string,
): Promise<void> {
  await apiClient.post(`/quotations/${quotationID}/request-reassignment`, {
    reason,
    additional_details,
  });
}

export async function reassignQuotationSpecificDetails(
  reassignmentRequest: number | null,
): Promise<ReassignQuotationSpecificDetailsResponse> {
  const response = await apiClient.get<{
    data: ReassignQuotationSpecificDetailsResponse;
  }>(`/reassignment-requests/${reassignmentRequest}`);
  return response.data.data;
}

export async function reassignQuotationEnums(
  as: string,
  ops: string,
  reasons: string,
): Promise<ReassignEnumsResponse> {
  const response = await apiClient.get<{ data: ReassignEnumsResponse }>(
    `/reassignment-requests/enums`,
    { params: { as, ops, reasons } },
  );
  return response.data.data;
}
