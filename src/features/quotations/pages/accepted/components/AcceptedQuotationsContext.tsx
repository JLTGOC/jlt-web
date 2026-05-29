import { createContext, use } from "react";

import type {
  ClientCounts,
  QuotationListItem,
} from "@/features/quotations/types/quotations.types";

export type JobScope = "all" | "my-items";
export type ClientFilter = "ALL" | "NEW" | "OLD";
export type ServiceFilter = "ALL SERVICES" | "LOGISTICS" | "REGULATORY";

export interface AcceptedQuotationsState {
  jobScope: JobScope;
  clientFilter: ClientFilter;
  serviceFilter: ServiceFilter;
  dateAccepted: string;
  searchValue: string;
  perPage: number;
  currentPage: number;
  rows: QuotationListItem[];
  myRows: QuotationListItem[];
  counts: ClientCounts | undefined;
  isLoading: boolean;
  allShowingCount: number;
  allTotal: number;
  allTotalPages: number;
}

export interface AcceptedQuotationsActions {
  setJobScope: (value: JobScope) => void;
  setClientFilter: (value: ClientFilter) => void;
  setSearchValue: (value: string) => void;
  submitSearch: () => void;
  setDateAccepted: (value: string) => void;
  setServiceFilter: (value: ServiceFilter) => void;
  resetFilters: () => void;
  setPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
}

export interface AcceptedQuotationsMeta {
  handleRowClick: (row: QuotationListItem) => void;
  handleRowHover: (row: QuotationListItem) => void;
  handleViewDocuments: (row: QuotationListItem) => void;
  handleUpdateQuotation: (row: QuotationListItem) => void;
  handleMakeJobOrder: (row: QuotationListItem) => void;
}

export interface AcceptedQuotationsContextValue {
  state: AcceptedQuotationsState;
  actions: AcceptedQuotationsActions;
  meta: AcceptedQuotationsMeta;
}

export const AcceptedQuotationsContext =
  createContext<AcceptedQuotationsContextValue | null>(null);

export function useAcceptedQuotationsContext() {
  const context = use(AcceptedQuotationsContext);
  if (!context) {
    throw new Error(
      "AcceptedQuotations components must be used within AcceptedQuotations.Provider",
    );
  }
  return context;
}
