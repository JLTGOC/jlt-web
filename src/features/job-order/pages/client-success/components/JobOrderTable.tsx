import { Box, Center, Loader, Table, Text } from "@mantine/core";
import { useAuthStore } from "@/stores/authStore";

import { JobOrderTableRow } from "./JobOrderTable/JobOrderTableRow";
import { JobOrderPagination } from "./JobOrderTable/JobOrderPagination";

import type { JobOrderResponse, JobOrderTableProps} from "@/features/job-order/types/operations";

type JobOrderRow = JobOrderResponse;

const tableHead = [
  "PRE-ALERT",
  "DETAILS",
  "SERVICE TYPE",
  "STATUS",
] as const;

export function JobOrderTable({
  rows,
  isLoading = false,
  showingCount,
  total,
  totalPages,
  perPaginationPage,
  setPerPaginationPage,
  modalOpenClick,
  setActiveModal,
  onRowClick,
  handleUnderLinedRefNumberCLick,
  openGenerateShipment,
  onMakeQuotationClick,
  onReassignClick,
  onReassignRequestClick,
  currentUserRole,
  jobFilter,
}: JobOrderTableProps) {
  const currentUser = useAuthStore();

  const userID = currentUser.user?.id;

  return (
    <>
      <Box>
        <Table
          withTableBorder
          withColumnBorders={false}
          styles={{
            table: {
              width: "100%",
            },
          }}
        >
          <Table.Thead
            style={{
              backgroundColor: "#17324f",
              color: "#FFFFFF",
            }}
          >
            <Table.Tr>
              {tableHead.map((heading) => (
                <Table.Th key={heading}>
                  {heading}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Center py="lg">
                    <Text mr={10}>
                      Loading job-orders...
                    </Text>

                    <Loader size="sm" />
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Center py="lg">
                    <Text>
                      No job-orders found.
                    </Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows.map((row, index) => (
                <JobOrderTableRow
                  key={row.id}
                  row={row}
                  index={index}
                  userID={userID}
                  jobFilter={jobFilter}
                  currentUserRole={currentUserRole}
                  onRowClick={onRowClick}
                  modalOpenClick={modalOpenClick}
                  setActiveModal={setActiveModal}
                  onMakeQuotationClick={onMakeQuotationClick}
                  onReassignClick={onReassignClick}
                  onReassignRequestClick={
                    onReassignRequestClick
                  }
                  handleUnderLinedRefNumberCLick={
                    handleUnderLinedRefNumberCLick
                  }
                  openGenerateShipment={
                    openGenerateShipment
                  }
                />
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <JobOrderPagination
        total={total}
        totalPages={totalPages}
        showingCount={showingCount}
        perPaginationPage={perPaginationPage}
        setPerPaginationPage={setPerPaginationPage}
      />
    </>
  );
}