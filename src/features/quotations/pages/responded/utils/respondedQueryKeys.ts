import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { QUOTATION_STATUS } from "@/features/quotations/types/quotations.types";

export const respondedQueryKeys = {
  root: () => quotationQueryKeys.byStatusRoot(QUOTATION_STATUS.RESPONDED),
  list: ({ 
    searchQuery, 
    perPage,
    clientFilter,
    serviceFilter,
    statusFilter,   
    dateFilter,
    jobFilter,
    currentPage,
  }: { 
    searchQuery: string; 
    perPage: number;
    clientFilter?: "ALL" | "NEW" | "OLD";
    serviceFilter?: string;
    statusFilter?: string;   
    dateFilter?: string;
    jobFilter?: "all" | "my-items";
    currentPage?: number;
  }) =>
    quotationQueryKeys.byStatusList(QUOTATION_STATUS.RESPONDED, {
      searchQuery,
      perPage,
      clientFilter,
      serviceFilter,
      statusFilter,   
      dateFilter,
      jobFilter,
      currentPage,
    }),
};
