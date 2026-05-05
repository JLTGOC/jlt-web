import { QUOTATION_STATUS } from "@/features/quotations/types/quotations.types";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";

interface RequestedListKeyParams {
  searchQuery: string;
  asSearchQuery: string;
  clientFilter: "ALL" | "NEW" | "OLD";
  serviceFilter: "LOGISTICS" | "REGULATORY" | "ALL";
  statusFilter: "AVAILABLE" | "ASSIGNED" | "REASSIGNMENT REQUESTED" | "ALL";
  dateFilter: string;
  perPage: number;
  jobFilter: "all" | "my-items";
  perPaginationPage: number;
}

interface RequestedClientListKeyParams {
  clientId?: string;
  searchQuery: string;
  perPage: number;
}

export const requestedQueryKeys = {
  quotationsRoot: quotationQueryKeys.quotationsRoot,
  requestedRoot: () =>
    quotationQueryKeys.byStatusRoot(QUOTATION_STATUS.REQUESTED),
  requestedList: ({
    searchQuery,
    asSearchQuery,
    clientFilter,
    serviceFilter,
    statusFilter,
    dateFilter,
    perPage,
    jobFilter,
    perPaginationPage,
  }: RequestedListKeyParams) =>
    [
      ...requestedQueryKeys.requestedRoot(),
      searchQuery,
      asSearchQuery,
      clientFilter,
      serviceFilter,
      statusFilter,
      dateFilter,
      perPage,
      jobFilter,
      perPaginationPage
    ] as const,
  requestedClientList: ({
    clientId,
    searchQuery,
    perPage,
  }: RequestedClientListKeyParams) =>
    [
      ...requestedQueryKeys.requestedRoot(),
      clientId,
      searchQuery,
      perPage,
    ] as const,
  quotationDetails: (quotationId?: string) =>
    quotationQueryKeys.quotationDetails(quotationId),
  quotationFiles: (
    quotationId?: string,
    type: "REQUESTED" | "PROPOSAL" = "REQUESTED",
  ) => quotationQueryKeys.quotationFiles(quotationId, type),
  accountSpecialists: () => ["users", "account-specialists"] as const,
};
