import { useState } from "react";
import { Box, Stack } from "@mantine/core";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageCard } from "@/components/PageCard";

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
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";

import { requestedQueryKeys } from "./utils/requestedQueryKeys";

import { RequestFilterClient } from "./components/RequestFilterClient";
import { RequestFilterTable } from "./components/RequestFilterTable";
import { RequestTable } from "./components/RequestTable";

import ReassignModal from "./components/ReassignModal";
import AcceptModal from "./components/AcceptModal";
import ReassignAcceptModal from "./components/ReassignAcceptModal";
import ReassignRejectModal from "./components/ReassignRejectModal";
import ReassignRequestModal from "./components/ReassignRequestModal";

export function QuotationsRequested() {
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

  const reassignPersonels =
    reassignEnumsData?.account_specialists.concat(
      reassignEnumsData?.operations || [],
    ) || [];

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
    if (!reassignStatus === null) return;

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

  return (
    <>
      <PageCard
        title="LIST OF NEW REQUEST"
        showJobSwitch
        jobSwitchValue={jobFilter}
        onJobSwitchChange={handleJobSwitchChange}
      >
        <Stack gap="xs">
          <RequestFilterClient
            clientFilter={clientFilter}
            setClientFilter={setClientFilter}
            clientCounts={data?.counts}
          />

          <Box
            p="xs"
            style={{
              borderRadius: "0.75rem",
              border: "1px solid #e0e5eb",
            }}
          >
            <Box>
              <RequestFilterTable
                quotations={
                  jobFilter === "all"
                    ? data?.quotations || []
                    : data?.my_quotations || []
                }
                clientSearchValue={search}
                onClientSearchChange={handleSearchChange}
                onClientSearch={handleSearch}
                asSearchValue={secondarySearch}
                onAsSearchChange={handleSecondarySearchChange}
                onAsSearch={handleSecondarySearch}
                perPage={perPage}
                setPerPage={setPerPage}
                serviceFilter={serviceFilter}
                setServiceFilter={setServiceFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                total={data?.counts.all_quotations}
              />

              <RequestTable
                rows={
                  jobFilter === "all"
                    ? data?.quotations || []
                    : data?.my_quotations || []
                }
                totalPages={
                  jobFilter === "all"
                    ? data?.pagination.total_pages || 0
                    : data?.my_quotations_pagination.total_pages || 0
                }
                perPaginationPage={perPaginationPage}
                setPerPaginationPage={setPerPaginationPage}
                jobFilter={jobFilter}
                isLoading={isLoading || isFetching}
                showingCount={data?.pagination.count}
                total={data?.counts.all_quotations}
                onAcceptClick={openAcceptModal}
                onReassignClick={openReassignModal}
                onReassignRequestClick={openReassignRequestModal}
                onRowClick={(row: RequestedQuotationListItem) => {
                  const quotationId = String(row.id);
                  prefetchQuotationDetails(quotationId);
                  navigate(
                    quotationRoutes.details({
                      tab: "requested",
                      quotationId,
                    }),
                  );
                }}
              />
            </Box>
          </Box>
        </Stack>
      </PageCard>

      <AcceptModal
        acceptModalOpen={acceptModalOpen}
        setAcceptModalOpen={setAcceptModalOpen}
        onConfirm={handleAcceptConfirm}
        isSubmitting={acceptQuotationMutation.isPending}
        onClose={closeModal}
      />

      <ReassignModal
        reassignModalOpen={reassignModalOpen}
        setReassignModalOpen={setReassignModalOpen}
        setReassignAcceptModalOpen={setReassignAccceptModalOpen}
        setReassignRejectModalOpen={setReassignRejectModalOpen}
        selectedQuotation={selectedQuotation}
        reassignPersonels={reassignPersonels}
        reassignSpecificDetails={reassignSpecificDetails}
        setReassignStatus={setReassignStatus}
        reassignASId={reassignASId}
        setReassignASId={setReassignASId}
        setReassignAS={setReassignAS}
        onClose={closeModal}
      />

      <ReassignAcceptModal
        reassignAcceptModalOpen={reassignAcceptModalOpen}
        onConfirm={handleReassignConfirm}
        currentPerson={selectedQuotation?.account_specialist || "-"}
        newPerson={reassignAS}
        isLoading={reassignQuotationMutation.isPending}
        onClose={closeModal}
      />

      <ReassignRejectModal
        reassignRejectModalOpen={reassignRejectModalOpen}
        onConfirm={handleReassignConfirm}
        isLoading={reassignQuotationMutation.isPending}
        onClose={closeModal}
      />

      <ReassignRequestModal
        requestReassignModalOpen={requestReassignModalOpen}
        selectedQuotation={selectedQuotation}
        reassignReasonEnums={reassignEnumsData?.reassignment_reasons}
        onClose={closeModal}
        onConfirm={handleReassignRequestSubmit}
        reassignReason={reassignReason}
        setReassignReason={setReassignReason}
        reassignAdditionalDetails={reassignAdditionalDetails}
        setReassignAdditionalDetails={setReassignAdditionalDetails}
      />
    </>
  );
}
