import { Box, Center, Group, Loader, Table, Text } from "@mantine/core";
import { useCurrentUserRole } from "@/stores/authStore";

import { useAcceptedQuotationsContext } from "./AcceptedQuotationsContext";
import {
  ActionsMenu,
  DetailsCell,
  MyJobsStatusCell,
  RequestCell,
} from "./AcceptedQuotationsCells";
import { getRowAccentColor } from "../utils/acceptedQuotations.utils";

export function AcceptedQuotationsMyJobsTable() {
  const { state, meta } = useAcceptedQuotationsContext();

  // khate - papa adjust yata soon need yung role dito
  const role = useCurrentUserRole();
  const total = state.myRows.length;

  return (
    <>
      <Box mt="sm">
        <Table
          withTableBorder
          withColumnBorders={false}
          styles={{
            table: { width: "100%" },
            thead: { backgroundColor: "#17324f" },
            th: {
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "0.65rem 1rem",
              whiteSpace: "nowrap",
            },
            td: {
              fontSize: "0.75rem",
              padding: "0.65rem 1rem",
              color: "#475569",
              verticalAlign: "top",
            },
          }}
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: "12rem" }}>REF NO.</Table.Th>
              <Table.Th style={{ width: "24rem" }}>DETAILS</Table.Th>
              <Table.Th style={{ width: "8rem" }}>STATUS</Table.Th>
              <Table.Th style={{ width: "3rem" }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {state.isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Center py="lg">
                    <Text c="#475569" fz="0.813rem" lh={1.45} mr={10}>
                      Loading accepted quotations...
                    </Text>
                    <Loader size="sm" />
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : state.myRows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Center py="lg">
                    <Text c="#475569" fz="0.813rem" lh={1.45}>
                      No accepted quotations found.
                    </Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              state.myRows.map((row) => (
                <Table.Tr
                  key={row.id}
                  onClick={() => meta.handleRowClick(row)}
                  onMouseEnter={() => meta.handleRowHover(row)}
                  style={{
                    cursor: "pointer",
                    boxShadow: `inset 6px 0 0 ${getRowAccentColor(row)}`,
                  }}
                >
                  <Table.Td>
                    <RequestCell row={row} />
                  </Table.Td>
                  <Table.Td>
                    <DetailsCell row={row} />
                  </Table.Td>
                  <Table.Td>
                    <MyJobsStatusCell
                      row={row}
                      onMakeJobOrder={meta.handleMakeJobOrder}
                    />
                  </Table.Td>
                  <Table.Td
                    style={{ width: "2.75rem", textAlign: "center" }}
                    onClick={(event) => event.stopPropagation()}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <ActionsMenu
                      row={row}
                      onViewDetails={meta.handleRowClick}
                      onViewDocuments={meta.handleViewDocuments}
                      actionLabel="Update Quotation"
                      onAction={meta.handleUpdateQuotation}
                    />
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group align="center" justify="space-between" mt="md">
        <Text c="#8a8f99" fz="0.813rem">
          Showing {total} out of {total} entries
        </Text>
      </Group>
    </>
  );
}
