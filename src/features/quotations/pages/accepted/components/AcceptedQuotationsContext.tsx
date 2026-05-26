import { createContext, use } from "react";

import type {
  ClientCounts,
  RespondedQuotationListItem,
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
  rows: RespondedQuotationListItem[];
  myRows: RespondedQuotationListItem[];
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
  handleRowClick: (row: RespondedQuotationListItem) => void;
  handleRowHover: (row: RespondedQuotationListItem) => void;
  handleViewDocuments: (row: RespondedQuotationListItem) => void;
  handleUpdateQuotation: (row: RespondedQuotationListItem) => void;
  handleMakeJobOrder: (row: RespondedQuotationListItem) => void;
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
