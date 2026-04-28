import {
  ActionIcon,
  Box,
  Button,
  Group,
  Stack,
  Table,
  Text,
  Center,
  Loader,
} from "@mantine/core";
import { MoreVert } from "@nine-thirty-five/material-symbols-react/rounded";
import {
  RequestQuote,
  Autorenew,
  CheckCircle,
  PanToolAlt,
} from "@nine-thirty-five/material-symbols-react/outlined";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";

type RequestedQuotationRow = RequestedQuotationListItem;

const tableHead = [
  "REQUEST",
  "DETAILS",
  "PERSON IN CHARGE",
  "STATUS",
  "",
] as const;

interface RequestTableProps {
  rows: RequestedQuotationRow[];
  isLoading?: boolean;
  showingCount?: number;
  total?: number;
  jobFilter?: "all" | "my-items";
  onRowClick?: (row: RequestedQuotationRow) => void;
  onAcceptClick?: (row: RequestedQuotationRow) => void;
  onReassignClick?: (row: RequestedQuotationRow) => void;
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getServiceLabel(service: string) {
  return toTitleCase(service);
}

function statusButtonBg(row: RequestedQuotationRow) {
  if (row.assignment_status === "AVAILABLE") return "#007406";
  if (row.assignment_status === "ASSIGNED") return "#3B82F6";
  return "#1D274E";
}

export function RequestTable({
  rows,
  isLoading = false,
  showingCount,
  total,
  jobFilter,
  onRowClick,
  onAcceptClick,
  onReassignClick,
}: RequestTableProps) {
  const currentShowingCount = showingCount ?? rows.length;
  const currentTotal = total ?? rows.length;

  console.log("khate", rows);

  return (
    <>
      <Box mt="sm">
        <Table
          withTableBorder
          withColumnBorders={false}
          styles={{
            table: { width: "100%" },
          }}
        >
          <Table.Thead style={{ backgroundColor: "#17324f", color: "white" }}>
            <Table.Tr>
              {tableHead.map((heading, index) => (
                <Table.Th key={`${heading}-${index}`}>{heading}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Center py="lg">
                    <Text c="#475569" fz="0.813rem" lh={1.45} mr={10}>
                      Loading quotations...
                    </Text>
                    <Loader size="sm" />
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Center py="lg">
                    <Text c="#475569" fz="0.813rem" lh={1.45}>
                      No quotations found.
                    </Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows.map((row) => (
                <Table.Tr
                  key={String(row.id)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  <Table.Td style={{ maxWidth: "150px" }}>
                    <Stack gap={2}>
                      <Text c="#334155" fz="0.875rem" fw={700}>
                        {row.reference_number}
                      </Text>
                      <Text c="#475569" fz="0.813rem" lh={1.45}>
                        {row.client_full_name}
                      </Text>
                      <Text c="#475569" fz="0.813rem" lh={1.45}>
                        Req. Date: {row.date}
                      </Text>
                    </Stack>
                  </Table.Td>

                  <Table.Td style={{ maxWidth: "250px" }}>
                    <Stack gap={2}>
                      <Text c="#2a4058" fz="0.875rem" fw={700}>
                        {getServiceLabel(row.service)}
                      </Text>
                      {row.logistics_service ? (
                        <>
                          <Text c="#475569" fz="0.813rem" lh={1.45}>
                            {row.logistics_service.commodity}
                          </Text>

                          <Text c="#475569" fz="0.813rem" lh={1.45}>
                            {toTitleCase(row.logistics_service.service_type)}{" "}
                            ---&gt; {""}
                            {toTitleCase(row.logistics_service.transport_mode)}
                          </Text>
                          <Group gap={6} align="center" wrap="nowrap">
                            <Text c="#475569" fz="0.813rem" lh={1.45}>
                              {row.logistics_service.origin}
                            </Text>
                            ---&gt; {""}
                            <Text c="#475569" fz="0.813rem" lh={1.45}>
                              {row.logistics_service.destination}
                            </Text>
                          </Group>
                        </>
                      ) : row.regulatory_service ? (
                        <Group gap={6} align="center" wrap="nowrap">
                          <Text c="#475569" fz="0.813rem" lh={1.45}>
                            Application Type
                          </Text>
                          ---&gt; {""}
                          <Text c="#2a4058" fz="0.875rem">
                            {toTitleCase(
                              row.regulatory_service.application_type,
                            )}
                          </Text>
                        </Group>
                      ) : (
                        <Text c="#475569" fz="0.813rem" lh={1.45}>
                          -
                        </Text>
                      )}
                    </Stack>
                  </Table.Td>

                  <Table.Td>
                    {row.account_specialist !== null ? (
                      <Text c="#334155" fz="0.75rem" lh={1.4}>
                        {row.account_specialist}
                      </Text>
                    ) : (
                      <Text c="#334155" fz="0.75rem" lh={1.4}>
                        Unassigned
                      </Text>
                    )}
                  </Table.Td>

                  <Table.Td style={{ maxWidth: "150px" }}>
                    <Stack gap={4}>
                      {jobFilter === "my-items" && (
                        <>
                          <Button
                            styles={{ root: { background: "#FF8800" } }}
                            leftSection={<RequestQuote width={20} />}
                            onClick={(event) => {
                              event.stopPropagation();

                              if (row.assignment_status !== "ASSIGNED") {
                                onReassignClick?.(row);
                              }
                            }}
                          >
                            Make Quotation
                          </Button>
                          {/* Michael */}
                          <Button
                            styles={{ root: { background: "#1D274E" } }}
                            leftSection={<Autorenew width={20} />}
                            onClick={(event) => {
                              event.stopPropagation();

                              row.assignment_status === "AVAILABLE"
                                ? onAcceptClick?.(row)
                                : onReassignClick?.(row);
                            }}
                          >
                            Request Reassignment
                          </Button>
                        </>
                      )}

                      {row.assignment_status === "REASSIGNMENT REQUESTED" && (
                        <>
                        <Button
                          styles={{ root: { background: statusButtonBg(row) } }}
                          leftSection={<Autorenew width={20} />}
                          onClick={(event) => {
                            event.stopPropagation();
                            onReassignClick?.(row);
                          }}
                        >
                          Reassignment Request
                        </Button>
                        <Text c="#334155" fz="0.75rem" fw={400} lh={1.4}>
                          Req. Reassignmet: 
                        </Text>
                        </>
                      )}

                      {row.assignment_status === "AVAILABLE" && (
                        <Button
                          styles={{ root: { background: statusButtonBg(row) } }}
                          leftSection={<PanToolAlt width={20} />}
                          onClick={(event) => {
                            event.stopPropagation();
                            onAcceptClick?.(row)
                          }}
                        >
                          Accept
                        </Button>
                      )}

                      {row.assignment_status === "ASSIGNED" && (
                        <Text c="#334155" fz="0.75rem" fw={400} lh={1.4}>
                          Req. Accepted: 
                        </Text>
                      )}
                    </Stack>
                  </Table.Td>

                  <Table.Td style={{ width: "2.75rem", textAlign: "center" }}>
                    <ActionIcon
                      variant="subtle"
                      color="#334155"
                      aria-label="More actions"
                    >
                      <MoreVert width={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Text mt="lg" ml="xs" c="#8a8f99" fz="0.813rem">
        Showing {currentShowingCount} out of {currentTotal} entries
      </Text>
    </>
  );
}
