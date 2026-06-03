import { Box, Stack } from "@mantine/core";
import { useNavigate } from "react-router";

import { PageCard } from "@/components/PageCard";

import { JobOrderFilterClient } from "./components/JobOrderFilterClient";
import { JobOrderFilterTable } from "./components/JobOrderFilterTable";
import { JobOrderTable } from "./components/JobOrderTable";

import ReassignModal from "./components/ReassignModal";
import AcceptModal from "./components/AcceptModal";
import ReassignAcceptModal from "./components/ReassignAcceptModal";
import ReassignRejectModal from "./components/ReassignRejectModal";
import ReassignRequestModal from "./components/ReassignRequestModal";
import GenerateShipmentModal from "./components/GenerateShipmentModal";
import GenerateShipmentConfirmModal from "./components/GenerateShipmentConfirmModal";

import { useJobOrderPage } from "./hooks/useJobOrderPage";

export default function JobOrderListPage() {
  const navigate = useNavigate();
  const {
    acceptModalOpen,
    acceptQuotationPending,
    clientCounts,
    clientFilter,
    closeModal,
    currentUserRole,
    handleAcceptConfirm,
    handleJobSwitchChange,
    handleReassignConfirm,
    handleReassignRequestSubmit,
    handleRowClick,
    handleUnderLinedRefNumberCLick,
    handleSearch,
    handleSearchChange,
    handleSecondarySearch,
    handleSecondarySearchChange,
    handleGenerateShipment,
    isFetching,
    isLoading,
    jobFilter,
    openAcceptModal,
    openReassignModal,
    openReassignRequestModal,
    openGenerateShipment,
    perPage,
    perPaginationPage,
    reassignOPS,
    reassignOPSId,
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
    generateShipmentModalOpen,
    generateShipmentConfirmModalOpen,
    search,
    secondarySearch,
    selectedQuotation,
    setAcceptModalOpen,
    setClientFilter,
    setPerPage,
    setPerPaginationPage,
    setReassignOPS,
    setReassignOPSId,
    setReassignAccceptModalOpen,
    setReassignAdditionalDetails,
    setReassignModalOpen,
    setReassignReason,
    setReassignRejectModalOpen,
    setReassignStatus,
    setGenerateShipmentModalOpen,
    setGenerateShipmentConfirmModalOpen,
    setStatusFilter,
    showingCount,
    statusFilter,
    totalPages,
    totalQuotations,
  } = useJobOrderPage();

  return (
    <>
      <PageCard
        title="LIST OF PENDING PRE-ALERT"
        showJobSwitch
        jobSwitchValue={jobFilter}
        onJobSwitchChange={handleJobSwitchChange}
      >
        <Stack gap="xs">
          <JobOrderFilterClient
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
              <JobOrderFilterTable
                quotations={requestRows}
                clientSearchValue={search}
                onClientSearchChange={handleSearchChange}
                onClientSearch={handleSearch}
                asSearchValue={secondarySearch}
                onAsSearchChange={handleSecondarySearchChange}
                onAsSearch={handleSecondarySearch}
                perPage={perPage}
                setPerPage={setPerPage}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                total={totalQuotations}
              />

              <JobOrderTable
                rows={requestRows}
                totalPages={totalPages}
                perPaginationPage={perPaginationPage}
                setPerPaginationPage={setPerPaginationPage}
                jobFilter={jobFilter}
                isLoading={isLoading || isFetching}
                showingCount={showingCount}
                total={totalQuotations}
                currentUserRole={currentUserRole}
                onAcceptClick={openAcceptModal}
                onReassignClick={openReassignModal}
                onReassignRequestClick={openReassignRequestModal}
                onRowClick={handleRowClick}
                handleUnderLinedRefNumberCLick={handleUnderLinedRefNumberCLick}
                openGenerateShipment={openGenerateShipment}
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
        reassignOPSId={reassignOPSId}
        setReassignOPSId={setReassignOPSId}
        reassignOPS={reassignOPS}
        setReassignOPS={setReassignOPS}
        onClose={closeModal}
      />

      <ReassignAcceptModal
        reassignAcceptModalOpen={reassignAcceptModalOpen}
        onConfirm={handleReassignConfirm}
        currentPerson={selectedQuotation?.assigned_to || "-"}
        newPerson={reassignOPS}
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

      <GenerateShipmentModal
        generateShipmentModalOpen={generateShipmentModalOpen}
        setGenerateShipmentConfirmModalOpen={
          setGenerateShipmentConfirmModalOpen
        }
        onConfirm={handleGenerateShipment}
        onClose={() => setGenerateShipmentModalOpen(false)}
      />

      <GenerateShipmentConfirmModal
        opened={generateShipmentConfirmModalOpen}
        onClose={() => setGenerateShipmentConfirmModalOpen(false)}
        onConfirm={() => {
          setGenerateShipmentConfirmModalOpen(false);
          const jobType = selectedQuotation?.job_type?.toLowerCase();
          const shipmentCategory =
            jobType === "REGULATORY" ? "regulatory" : "logistics";
          navigate(`/shipments/${shipmentCategory}`);
        }}
      />
    </>
  );
}
