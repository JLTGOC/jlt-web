import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import {
  fetchQuotation,
  reassignQuotationEnums,
} from "@/features/quotations/api/quotations.api";

import {
  fetchJobOrders,
  acceptJobOrder,
  reassignRequestJobOrder,
  reassignJobOrder,
  reassignJobOrderDetails,
  fetchJobOrderQuotation,
} from "@/features/job-order/api/jobOrder.api";

import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import type { JobOrderResponse } from "@/features/job-order/types/jobOrder";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { jobOrderRoutes } from "@/features/job-order/utils/jobOrderRoutes";
import { useCurrentUserRole } from "@/stores/authStore";

import { jobOrdersQueryKeys } from "../utils/jobOrdersQueryKeys";

export function useJobOrderPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUserRole = useCurrentUserRole();

  console.log("khate", currentUserRole);

  const [selectedQuotation, setSelectedQuotation] =
    useState<JobOrderResponse | null>(null);

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
  const [reassignOPSId, setReassignOPSId] = useState<number | null>(null);
  const [reassignOPS, setReassignOPS] = useState<string>("");

  const [jobFilter, setJobFilter] = useState<"all" | "my-items">("all");
  const [clientFilter, setClientFilter] = useState<
    "ALL" | "LOGISTICS" | "REGULATORY"
  >("ALL");
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
    queryKey: jobOrdersQueryKeys.jobOrdersList({
      searchQuery,
      asSearchQuery: secondarySearchQuery,
      clientFilter,
      serviceFilter,
      statusFilter,
      perPage,
      jobFilter,
      perPaginationPage,
    }),
    queryFn: () =>
      fetchJobOrders({
        "filter[assignment_status]":
          statusFilter === "ALL" ? undefined : clientFilter,
        "filter[service]": serviceFilter === "ALL" ? undefined : serviceFilter,
        search: searchQuery || undefined,
        // client_type: clientFilter === "ALL" ? undefined : clientFilter,
        per_page: perPage,
        page: perPaginationPage,
      }),
    staleTime: 0,
  });

  const { data: reassignEnumsData } = useQuery({
    queryKey: jobOrdersQueryKeys.jobOrdersRoot,
    queryFn: () => reassignQuotationEnums("", "fetch", "fetch"),
  });

  const reassignPersonels = useMemo(
    () => [...(reassignEnumsData?.operations ?? [])],
    [reassignEnumsData],
  );

  const { data: reassignSpecificDetails } = useQuery({
    queryKey: [
      "reassignment-details",
      selectedQuotation?.reassignment_request_id,
    ],
    queryFn: () =>
      reassignJobOrderDetails(
        selectedQuotation?.reassignment_request_id || null,
      ),
    enabled: !!selectedQuotation?.reassignment_request_id,
  });

  // MUTATION

  const reassignJobOrderMutation = useMutation({
    mutationFn: ({
      id,
      status,
      operations_id,
    }: {
      id: number;
      status: string;
      operations_id: number | null;
    }) => reassignJobOrder(id, status, operations_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobOrdersQueryKeys.jobOrdersRoot,
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
      id: number;
      reason: string;
      additionalDetails: string | null;
    }) => reassignRequestJobOrder(id, reason, additionalDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobOrdersQueryKeys.jobOrdersRoot,
      });
      closeModal();
    },
    onError: (error) => {
      console.error("Error reassigning quotation:", error);
    },
  });

  const acceptJobOrderMutation = useMutation({
    mutationFn: (id: number) => acceptJobOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobOrdersQueryKeys.jobOrdersRoot,
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

  const fetchDetails = (quotationId: string) => {};

  const handleReassignConfirm = () => {
    if (!selectedQuotation) return;
    if (!reassignStatus) return;
    if (selectedQuotation.id == null) return;

    reassignJobOrderMutation.mutate({
      id: selectedQuotation.id,
      status: reassignStatus,
      operations_id: reassignOPSId,
    });
  };

  const handleAcceptConfirm = () => {
    if (!selectedQuotation) return;
    if (selectedQuotation.id == null) return;

    acceptJobOrderMutation.mutate(selectedQuotation.id);
  };

  const handleReassignRequestSubmit = () => {
    if (!selectedQuotation) return;
    if (selectedQuotation.id == null) return;

    reassignRequestMutation.mutate({
      id: selectedQuotation.id,
      reason: reassignReason,
      additionalDetails: reassignAdditionalDetails,
    });

    setReassignAdditionalDetails("");
    setReassignReason("");
  };

  const closeModal = () => {
    setAcceptModalOpen(false);
    setReassignModalOpen(false);
    setReassignRejectModalOpen(false);
    setReassignAccceptModalOpen(false);
    setReassignRequestModalOpen(false);

    setReassignOPSId(null);
    setSelectedQuotation(null);
    setReassignOPS("");
    setReassignStatus("");
  };

  const openAcceptModal = (row: JobOrderResponse) => {
    setSelectedQuotation(row);
    setAcceptModalOpen(true);
  };

  const openReassignModal = (row: JobOrderResponse) => {
    setSelectedQuotation(row);
    setReassignModalOpen(true);
  };

  const openReassignRequestModal = (row: JobOrderResponse) => {
    setSelectedQuotation(row);
    setReassignRequestModalOpen(true);
  };

  const handleJobSwitchChange = (value: "all" | "my-items") => {
    setJobFilter(value);
  };

  const requestRows =
    jobFilter === "all" ? data?.job_orders || [] : data?.my_job_orders || [];

  const totalPages =
    jobFilter === "all"
      ? data?.pagination.total_pages || 0
      : data?.my_job_orders_pagination.total_pages || 0;

  const showingCount =
    jobFilter === "all"
      ? data?.pagination.count
      : data?.my_job_orders_pagination.count;

  const handleMakeQuotationClick = (row: JobOrderResponse) => {
    const quotationId = String(row.id);
    prefetchQuotationDetails(quotationId);
    navigate(
      quotationRoutes.compose({
        tab: "requested",
        quotationId,
      }),
    );
  };

  const handleRowClick = (row: JobOrderResponse) => {
    const jobOrderId = row.id;
    navigate(jobOrderRoutes.clientDetails(jobOrderId), { state: { jobOrder: row } });
  };

  const handleUnderLinedRefNumberCLick = (row: JobOrderResponse) => {
    const jobOrderId = row.id;
    navigate(jobOrderRoutes.details(jobOrderId), { state: { jobOrder: row } });
  };

  return {
    acceptModalOpen,
    acceptQuotationPending: acceptJobOrderMutation.isPending,
    clientCounts: data?.counts,
    clientFilter,
    closeModal,
    currentUserRole,
    handleAcceptConfirm,
    handleJobSwitchChange,
    handleMakeQuotationClick,
    handleReassignConfirm,
    handleReassignRequestSubmit,
    handleRowClick,
    handleUnderLinedRefNumberCLick,
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
    reassignOPS,
    reassignOPSId,
    reassignAcceptModalOpen,
    reassignAdditionalDetails,
    reassignModalOpen,
    reassignReasonEnums: reassignEnumsData?.reassignment_reasons,
    reassignPersonels,
    reassignReason,
    reassignRejectModalOpen,
    reassignSpecificDetails,
    reassignStatus,
    reassignQuotationPending: reassignJobOrderMutation.isPending,
    requestReassignModalOpen,
    requestRows,
    search,
    secondarySearch,
    selectedQuotation,
    serviceFilter,
    setAcceptModalOpen,
    setClientFilter,
    setJobFilter,
    setPerPage,
    setPerPaginationPage,
    setReassignOPS,
    setReassignOPSId,
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
    totalQuotations: data?.counts.all_job_orders ?? 0,
  };
}
