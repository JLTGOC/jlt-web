import { Box, Stack } from "@mantine/core";

import { PageCard } from "@/components/PageCard";

import { RequestFilterClient } from "./components/RequestFilterClient";
import { RequestFilterTable } from "./components/RequestFilterTable";
import { RequestTable } from "./components/RequestTable";

import ReassignModal from "./components/ReassignModal";
import AcceptModal from "./components/AcceptModal";
import ReassignAcceptModal from "./components/ReassignAcceptModal";
import ReassignRejectModal from "./components/ReassignRejectModal";
import ReassignRequestModal from "./components/ReassignRequestModal";
import { useRequestedQuotationsPage } from "./hooks/useRequestedQuotationsPage";

export default function JobOrderListPage() {
  const {
    acceptModalOpen,
    acceptQuotationPending,
    clientCounts,
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
    reassignPersonels,
    reassignQuotationPending,
    reassignReasonEnums,
    reassignReason,
    reassignRejectModalOpen,
    reassignSpecificDetails,
    requestReassignModalOpen,
    requestRows,
    search,
    secondarySearch,
    selectedQuotation,
    serviceFilter,
    setAcceptModalOpen,
    setClientFilter,
    setDateFilter,
    setPerPage,
    setPerPaginationPage,
    setReassignAS,
    setReassignASId,
    setReassignAccceptModalOpen,
    setReassignAdditionalDetails,
    setReassignModalOpen,
    setReassignReason,
    setReassignRejectModalOpen,
    setReassignStatus,
    setServiceFilter,
    setStatusFilter,
    showingCount,
    statusFilter,
    totalPages,
    totalQuotations,
  } = useRequestedQuotationsPage();

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
            clientCounts={clientCounts}
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
                quotations={requestRows}
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
                total={totalQuotations}
              />

              <RequestTable
                rows={requestRows}
                totalPages={totalPages}
                perPaginationPage={perPaginationPage}
                setPerPaginationPage={setPerPaginationPage}
                jobFilter={jobFilter}
                isLoading={isLoading || isFetching}
                showingCount={showingCount}
                total={totalQuotations}
                onAcceptClick={openAcceptModal}
                onReassignClick={openReassignModal}
                onReassignRequestClick={openReassignRequestModal}
                onMakeQuotationClick={handleMakeQuotationClick}
                onRowClick={handleRowClick}
              />
            </Box>
          </Box>
        </Stack>
      </PageCard>

      <AcceptModal
        acceptModalOpen={acceptModalOpen}
        setAcceptModalOpen={setAcceptModalOpen}
        onConfirm={handleAcceptConfirm}
        isSubmitting={acceptQuotationPending}
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
        isLoading={reassignQuotationPending}
        onClose={closeModal}
      />

      <ReassignRejectModal
        reassignRejectModalOpen={reassignRejectModalOpen}
        onConfirm={handleReassignConfirm}
        isLoading={reassignQuotationPending}
        onClose={closeModal}
      />

      <ReassignRequestModal
        requestReassignModalOpen={requestReassignModalOpen}
        selectedQuotation={selectedQuotation}
        reassignReasonEnums={reassignReasonEnums}
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
