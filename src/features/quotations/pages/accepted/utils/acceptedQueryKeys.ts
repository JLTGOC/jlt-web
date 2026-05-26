import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { QUOTATION_STATUS } from "@/features/quotations/types/quotations.types";

export const acceptedQueryKeys = {
  root: () => quotationQueryKeys.byStatusRoot(QUOTATION_STATUS.ACCEPTED),
  list: ({
    searchQuery,
    perPage,
    clientFilter,
    serviceFilter,
    dateFilter,
    jobFilter,
    currentPage,
  }: {
    searchQuery: string;
    perPage: number;
    clientFilter?: "ALL" | "NEW" | "OLD";
    serviceFilter?: string;
    dateFilter?: string;
    jobFilter?: "all" | "my-items";
    currentPage?: number;
  }) =>
    quotationQueryKeys.byStatusList(QUOTATION_STATUS.ACCEPTED, {
      searchQuery,
      perPage,
      clientFilter,
      serviceFilter,
      dateFilter,
      jobFilter,
      currentPage,
    }),
};
