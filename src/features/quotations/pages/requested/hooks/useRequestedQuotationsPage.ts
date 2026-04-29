import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import {
  fetchQuotation,
  fetchRequestedQuotations,
  acceptQuotation,
  reassignQuotation,
  reassignQuotationEnums,
  reassignQuotationSpecificDetails,
  reassignRequest,
} from "@/features/quotations/api/quotations.api";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";

import { requestedQueryKeys } from "../utils/requestedQueryKeys";

export function useRequestedQuotationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedQuotation, setSelectedQuotation] =
    useState<RequestedQuotationListItem | null>(null);

  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [reassignAcceptModalOpen, setReassignAccceptModalOpen] =
    useState(false);
  const [reassignRejectModalOpen, setReassignRejectModalOpen] = useState(false);
  const [requestReassignModalOpen, setReassignRequestModalOpen] =
    useState(false);

  const [reassignReason, setReassignReason] = useState<string>("");
  const [reassignAdditionalDetails, setReassignAdditionalDetails] =
    useState<string>("");
  const [reassignStatus, setReassignStatus] = useState<string>("");
  const [reassignASId, setReassignASId] = useState<number | null>(null);
  const [reassignAS, setReassignAS] = useState<string>("");

  const [jobFilter, setJobFilter] = useState<"all" | "my-items">("all");
  const [dateFilter, setDateFilter] = useState("");
  const [clientFilter, setClientFilter] = useState<"ALL" | "NEW" | "OLD">(
    "ALL",
  );
  const [serviceFilter, setServiceFilter] = useState<
    "LOGISTICS" | "REGULATORY" | "ALL"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "AVAILABLE" | "ASSIGNED" | "REASSIGNMENT REQUESTED" | "ALL"
  >("ALL");

  const {
    search,
    searchQuery,
    secondarySearch,
    secondarySearchQuery,
    perPage,
    setPerPage,
    perPaginationPage,
    setPerPaginationPage,
    handleSearch,
    handleSearchChange,
    handleSecondarySearch,
    handleSecondarySearchChange,
  } = useQuotationTableSearch();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: requestedQueryKeys.requestedList({
      searchQuery,
      asSearchQuery: secondarySearchQuery,
      clientFilter,
      serviceFilter,
      statusFilter,
      dateFilter,
      perPage,
      jobFilter,
      perPaginationPage,
    }),
    queryFn: () =>
      fetchRequestedQuotations({
        "filter[assignment_status]":
          statusFilter === "ALL" ? undefined : statusFilter,
        "filter[service]": serviceFilter === "ALL" ? undefined : serviceFilter,
        "filter[created_at]": dateFilter || undefined,
        search: searchQuery || undefined,
        as_search: secondarySearchQuery || undefined,
        client_type: clientFilter === "ALL" ? undefined : clientFilter,
        per_page: perPage,
        page: perPaginationPage,
      }),
  });

  const { data: reassignEnumsData } = useQuery({
    queryKey: requestedQueryKeys.requestedRoot(),
    queryFn: () => reassignQuotationEnums("fetch", "fetch", "fetch"),
  });

  const reassignPersonels = useMemo(
    () => [
      ...(reassignEnumsData?.account_specialists ?? []),
      ...(reassignEnumsData?.operations ?? []),
    ],
    [reassignEnumsData],
  );

  const { data: reassignSpecificDetails } = useQuery({
    queryKey: [
      "reassignment-details",
      selectedQuotation?.reassignment_request_id,
    ],
    queryFn: () =>
      reassignQuotationSpecificDetails(
        selectedQuotation?.reassignment_request_id || null,
      ),
    enabled: !!selectedQuotation?.reassignment_request_id,
  });

  const reassignQuotationMutation = useMutation({
    mutationFn: ({
      id,
      status,
      as_id,
    }: {
      id: number | string;
      status: string;
      as_id: number | null;
    }) => reassignQuotation(id, status, as_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: requestedQueryKeys.requestedRoot(),
      });
      closeModal();
    },
    onError: (error) => {
      console.error("Error reassigning quotation:", error);
    },
  });

  const reassignRequestMutation = useMutation({
    mutationFn: ({
      id,
      reason,
      additionalDetails,
    }: {
      id: number | string;
      reason: string;
      additionalDetails: string;
    }) => reassignRequest(id, reason, additionalDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: requestedQueryKeys.requestedRoot(),
      });
      closeModal();
    },
    onError: (error) => {
      console.error("Error reassigning quotation:", error);
    },
  });

  const acceptQuotationMutation = useMutation({
    mutationFn: (id: number | string) => acceptQuotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: requestedQueryKeys.requestedRoot(),
      });
      setAcceptModalOpen(false);
      setSelectedQuotation(null);
    },
    onError: (error) => {
      console.error("Error accepting quotation:", error);
    },
  });

  const prefetchQuotationDetails = (quotationId: string) => {
    void queryClient.prefetchQuery({
      queryKey: quotationQueryKeys.quotationDetails(quotationId),
      queryFn: () => fetchQuotation(quotationId),
      staleTime: 30_000,
    });
  };

  const handleReassignConfirm = () => {
    if (!selectedQuotation) return;
    if (!reassignStatus) return;

    reassignQuotationMutation.mutate({
      id: selectedQuotation.id,
      status: reassignStatus,
      as_id: reassignASId,
    });
  };

  const handleAcceptConfirm = () => {
    if (!selectedQuotation) return;

    acceptQuotationMutation.mutate(selectedQuotation.id);
  };

  const handleReassignRequestSubmit = () => {
    if (!selectedQuotation) return;

    reassignRequestMutation.mutate({
      id: selectedQuotation.id,
      reason: reassignReason,
      additionalDetails: reassignAdditionalDetails,
    });
  };

  const closeModal = () => {
    setAcceptModalOpen(false);
    setReassignModalOpen(false);
    setReassignRejectModalOpen(false);
    setReassignAccceptModalOpen(false);
    setReassignRequestModalOpen(false);

    setReassignASId(null);
    setSelectedQuotation(null);
    setReassignAS("");
    setReassignStatus("");
  };

  const openAcceptModal = (row: RequestedQuotationListItem) => {
    setSelectedQuotation(row);
    setAcceptModalOpen(true);
  };

  const openReassignModal = (row: RequestedQuotationListItem) => {
    setSelectedQuotation(row);
    setReassignModalOpen(true);
  };

  const openReassignRequestModal = (row: RequestedQuotationListItem) => {
    setSelectedQuotation(row);
    setReassignRequestModalOpen(true);
  };

  const handleJobSwitchChange = (value: "all" | "my-items") => {
    setJobFilter(value);
  };

  const requestRows =
    jobFilter === "all" ? data?.quotations || [] : data?.my_quotations || [];

  const totalPages =
    jobFilter === "all"
      ? data?.pagination.total_pages || 0
      : data?.my_quotations_pagination.total_pages || 0;

  const showingCount =
    jobFilter === "all"
      ? data?.pagination.count
      : data?.my_quotations_pagination.count;

  const handleMakeQuotationClick = (row: RequestedQuotationListItem) => {
    const quotationId = String(row.id);
    prefetchQuotationDetails(quotationId);
    navigate(
      quotationRoutes.compose({
        tab: "requested",
        quotationId,
      }),
    );
  };

  const handleRowClick = (row: RequestedQuotationListItem) => {
    const quotationId = String(row.id);
    prefetchQuotationDetails(quotationId);
    navigate(
      quotationRoutes.details({
        tab: "requested",
        quotationId,
      }),
    );
  };

  return {
    acceptModalOpen,
    acceptQuotationPending: acceptQuotationMutation.isPending,
    clientCounts: data?.counts,
    clientFilter,
    closeModal,
    dateFilter,
    handleAcceptConfirm,
    handleJobSwitchChange,
    handleMakeQuotationClick,
    handleReassignConfirm,
    handleReassignRequestSubmit,
    handleRowClick,
    handleSearch,
    handleSearchChange,
    handleSecondarySearch,
    handleSecondarySearchChange,
    isFetching,
    isLoading,
    jobFilter,
    openAcceptModal,
    openReassignModal,
    openReassignRequestModal,
    perPage,
    perPaginationPage,
    reassignAS,
    reassignASId,
    reassignAcceptModalOpen,
    reassignAdditionalDetails,
    reassignModalOpen,
    reassignReasonEnums: reassignEnumsData?.reassignment_reasons,
    reassignPersonels,
    reassignReason,
    reassignRejectModalOpen,
    reassignSpecificDetails,
    reassignStatus,
    reassignQuotationPending: reassignQuotationMutation.isPending,
    requestReassignModalOpen,
    requestRows,
    search,
    secondarySearch,
    selectedQuotation,
    serviceFilter,
    setAcceptModalOpen,
    setClientFilter,
    setDateFilter,
    setJobFilter,
    setPerPage,
    setPerPaginationPage,
    setReassignAS,
    setReassignASId,
    setReassignAccceptModalOpen,
    setReassignAdditionalDetails,
    setReassignModalOpen,
    setReassignReason,
    setReassignRejectModalOpen,
    setReassignRequestModalOpen,
    setReassignStatus,
    setServiceFilter,
    setSelectedQuotation,
    setStatusFilter,
    statusFilter,
    showingCount,
    totalPages,
    totalQuotations: data?.counts.all_quotations ?? 0,
  };
}