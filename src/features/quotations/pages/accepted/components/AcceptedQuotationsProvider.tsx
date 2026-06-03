import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import {
  fetchAcceptedQuotations,
  fetchQuotation,
} from "@/features/quotations/api/quotations.api";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import type { QuotationRouteTab } from "@/features/quotations/api/quotationQueryKeys";
import { acceptedQueryKeys } from "@/features/quotations/pages/accepted/utils/acceptedQueryKeys";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";

import {
  AcceptedQuotationsContext,
  type AcceptedQuotationsActions,
  type AcceptedQuotationsContextValue,
  type AcceptedQuotationsMeta,
  type AcceptedQuotationsState,
  type ClientFilter,
  type JobScope,
  type ServiceFilter,
} from "./AcceptedQuotationsContext";

interface AcceptedQuotationsProviderProps {
  children: ReactNode;
}

export function AcceptedQuotationsProvider({
  children,
}: AcceptedQuotationsProviderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    search,
    searchQuery,
    perPage,
    setPerPage,
    perPaginationPage,
    setPerPaginationPage,
    handleSearch,
    handleSearchChange,
  } = useQuotationTableSearch();

  const [jobScope, setJobScope] = useState<JobScope>("all");
  const [clientFilter, setClientFilter] = useState<ClientFilter>("ALL");
  const [serviceFilter, setServiceFilter] =
    useState<ServiceFilter>("ALL SERVICES");
  const [dateAccepted, setDateAccepted] = useState("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: acceptedQueryKeys.list({
      searchQuery,
      perPage,
      clientFilter,
      serviceFilter,
      dateFilter: dateAccepted,
      jobFilter: jobScope,
      currentPage: perPaginationPage,
    }),
    queryFn: () =>
      fetchAcceptedQuotations({
        search: searchQuery || undefined,
        "filter[service]":
          serviceFilter === "ALL SERVICES" ? undefined : serviceFilter,
        "filter[created_at]": dateAccepted || undefined,
        client_type: clientFilter,
        perPage,
        page: perPaginationPage,
      }),
    staleTime: 30_000,
  });

  const rows = useMemo(() => data?.quotations ?? [], [data?.quotations]);
  const myRows = useMemo(
    () => data?.my_quotations ?? [],
    [data?.my_quotations],
  );
  const pagination = data?.pagination;
  const allShowingCount = pagination?.count ?? rows.length;
  const allTotal = pagination?.total ?? rows.length;
  const allTotalPages = Math.max(
    1,
    (pagination?.total_pages ?? Math.ceil(allTotal / perPage)) || 1,
  );

  const prefetchQuotationDetails = useCallback(
    (quotationId: string) => {
      void queryClient.prefetchQuery({
        queryKey: quotationQueryKeys.quotationDetails(
          quotationId,
          "accepted" as QuotationRouteTab,
        ),
        queryFn: () => fetchQuotation(quotationId, "accepted"),
        staleTime: 30_000,
      });
    },
    [queryClient],
  );

  const state = useMemo<AcceptedQuotationsState>(
    () => ({
      jobScope,
      clientFilter,
      serviceFilter,
      dateAccepted,
      searchValue: search,
      perPage,
      currentPage: perPaginationPage,
      rows,
      myRows,
      counts: data?.counts,
      isLoading: isLoading || isFetching,
      allShowingCount,
      allTotal,
      allTotalPages,
    }),
    [
      jobScope,
      clientFilter,
      serviceFilter,
      dateAccepted,
      search,
      perPage,
      perPaginationPage,
      rows,
      myRows,
      data?.counts,
      isLoading,
      isFetching,
      allShowingCount,
      allTotal,
      allTotalPages,
    ],
  );

  const actions = useMemo<AcceptedQuotationsActions>(
    () => ({
      setJobScope,
      setClientFilter: (value: ClientFilter) => {
        setClientFilter(value);
        setPerPaginationPage(1);
      },
      setSearchValue: (value: string) => {
        handleSearchChange(value);
        setPerPaginationPage(1);
      },
      submitSearch: () => {
        handleSearch(search);
        setPerPaginationPage(1);
      },
      setDateAccepted: (value: string) => {
        setDateAccepted(value);
        setPerPaginationPage(1);
      },
      setServiceFilter: (value: ServiceFilter) => {
        setServiceFilter(value);
        setPerPaginationPage(1);
      },
      resetFilters: () => {
        handleSearchChange("");
        handleSearch("");
        setDateAccepted("");
        setServiceFilter("ALL SERVICES");
        setPerPaginationPage(1);
      },
      setPerPage: (value: number) => {
        setPerPage(value);
        setPerPaginationPage(1);
      },
      setCurrentPage: (value: number) => {
        setPerPaginationPage(value);
      },
    }),
    [
      handleSearch,
      handleSearchChange,
      search,
      setClientFilter,
      setDateAccepted,
      setJobScope,
      setPerPage,
      setPerPaginationPage,
      setServiceFilter,
    ],
  );

  const meta = useMemo<AcceptedQuotationsMeta>(
    () => ({
      handleRowClick: (row) => {
        if (row.id == null) return;
        const quotationId = String(row.id);
        prefetchQuotationDetails(quotationId);
        navigate(
          quotationRoutes.details({
            tab: "accepted",
            quotationId,
          }),
        );
      },
      handleRowHover: (row) => {
        if (row.id == null) return;
        prefetchQuotationDetails(String(row.id));
      },
      handleViewDocuments: (row) => {
        if (row.id == null) return;
        const quotationId = String(row.id);
        navigate(
          quotationRoutes.documents({
            tab: "accepted",
            quotationId,
          }),
        );
      },
      handleUpdateQuotation(row) {
        if (row.id == null) return;
        navigate(`/quotations/accepted/${row.id}/compose`);
      },
      handleMakeJobOrder: (row) => {
        if (row.id == null) return;
        navigate(
          quotationRoutes.jobOrder({
            tab: "accepted",
            quotationId: String(row.id),
            referenceNumber: row.reference_number,
            jobType: row.service,
          }),
        );
      },
    }),
    [navigate, prefetchQuotationDetails],
  );

  const value = useMemo<AcceptedQuotationsContextValue>(
    () => ({
      state,
      actions,
      meta,
    }),
    [actions, meta, state],
  );

  return (
    <AcceptedQuotationsContext.Provider value={value}>
      {children}
    </AcceptedQuotationsContext.Provider>
  );
}
