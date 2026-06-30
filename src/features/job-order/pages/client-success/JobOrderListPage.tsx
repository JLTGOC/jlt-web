import { Box, Stack } from "@mantine/core";
import { useNavigate } from "react-router";

import { PageCard } from "@/components/PageCard";

import { JobOrderFilterClient } from "./components/JobOrderFilterClient";
import { JobOrderFilterTable } from "./components/JobOrderFilterTable";
import { JobOrderTable } from "./components/JobOrderTable";

// import ReassignModal from "./components/Modals/ReassignModal";
import AcceptModal from "./components/Modals/AcceptModal";
import CreatePlanningTimelineModal from "./components/Modals/CreatePlanningTimelineModal";
// import ReassignAcceptModal from "./components/Modals/ReassignAcceptModal";
// import ReassignRejectModal from "./components/Modals/ReassignRejectModal";
// import ReassignRequestModal from "./components/Modals/ReassignRequestModal";
// import GenerateShipmentModal from "./components/Modals/GenerateShipmentModal";
// import GenerateShipmentConfirmModal from "./components/Modals/GenerateShipmentConfirmModal";

import { useJobOrderPage } from "./hooks/useJobOrderPage";

export default function JobOrderListPage() {
  const navigate = useNavigate();
  const {
    activeModal,
    acceptQuotationPending,
    clientCounts,
    clientFilter,
    closeModal,
    currentUserRole,
    handleAcceptConfirm,
    handleJobSwitchChange,
    handleRowClick,
    handleUnderLinedRefNumberCLick,
    handleSearch,
    handleSearchChange,
    handleSecondarySearch,
    handleSecondarySearchChange,
    isFetching,
    isLoading,
    jobFilter,
    openModal,
    // openReassignModal,
    // openReassignRequestModal,
    // openGenerateShipment,
    perPage,
    perPaginationPage,
    requestRows,
    search,
    secondarySearch,
    setActiveModal,
    setClientFilter,
    setPerPage,
    setPerPaginationPage,
    setStatusFilter,
    showingCount,
    statusFilter,
    selectedQuotation,
    totalPages,
    totalQuotations,
  } = useJobOrderPage();

  console.log("khate", selectedQuotation);

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
                setActiveModal={setActiveModal}
                modalOpenClick={openModal}
                // onReassignClick={openReassignModal}
                // onReassignRequestClick={openReassignRequestModal}
                onRowClick={handleRowClick}
                handleUnderLinedRefNumberCLick={handleUnderLinedRefNumberCLick}
                // openGenerateShipment={openGenerateShipment}
              />
            </Box>
          </Box>
        </Stack>
      </PageCard>

      <AcceptModal
        activeModal={activeModal}
        onConfirm={handleAcceptConfirm}
        isSubmitting={acceptQuotationPending}
        onClose={closeModal}
      />

      <CreatePlanningTimelineModal
        activeModal={activeModal}
        onClose={closeModal}
        onConfirm={() =>
          navigate("/tasks/template", {
            state: { serviceType: selectedQuotation?.job_type },
          })
        }
      />

      {/* <ReassignModal
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
      /> */}
    </>
  );
}
