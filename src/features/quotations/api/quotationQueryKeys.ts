import type { QuotationStatus } from "@/features/quotations/types/quotations.types";

export type QuotationRouteTab = "requested" | "responded" | "accepted";

interface StatusListKeyParams {
  searchQuery: string;
  perPage: number;
  clientFilter?: "ALL" | "NEW" | "OLD";
  serviceFilter?: string;
  statusFilter?: string;
  dateFilter?: string;
  jobFilter?: "all" | "my-items";
  currentPage?: number;
}

export const quotationQueryKeys = {
  quotationsRoot: () => ["quotations"] as const,
  byStatusRoot: (status: QuotationStatus) =>
    [...quotationQueryKeys.quotationsRoot(), status] as const,
  byStatusList: (status: QuotationStatus, params: StatusListKeyParams) =>
    [
      ...quotationQueryKeys.byStatusRoot(status),
      params.searchQuery,
      params.perPage,
      params.clientFilter,
      params.serviceFilter,
      params.dateFilter,
      params.statusFilter,
      params.jobFilter,
      params.currentPage,
    ] as const,
  quotationDetails: (quotationId?: string, status?: QuotationRouteTab) =>
    ["quotation", quotationId, status] as const,
  quotationFiles: (
    quotationId?: string,
    type: "REQUESTED" | "PROPOSAL" = "REQUESTED",
  ) => ["quotation-files", quotationId, type] as const,
  issuedQuotation: (quotationId?: string, issuedQuotationId?: string) =>
    ["issued-quotation", quotationId, issuedQuotationId] as const,
};
