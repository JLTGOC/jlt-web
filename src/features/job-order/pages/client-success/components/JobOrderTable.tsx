import { useMemo } from "react";
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
  Avatar,
  Menu,
} from "@mantine/core";
import {
  MoreVert,
  RequestQuote,
  FileOpen,
} from "@nine-thirty-five/material-symbols-react/rounded";
import {
  Autorenew,
  PanToolAlt,
  CheckCircle,
  ChevronRight,
  Delete,
} from "@nine-thirty-five/material-symbols-react/outlined";
import type { JobOrderResponse } from "@/features/job-order/types/jobOrder";

type JobOrderRow = JobOrderResponse;

const tableHead = [
  "REQUEST",
  "DETAILS",
  "SERVICE LEVEL",
  "PERSON IN CHARGE",
  "",
] as const;

interface JobOrderTableProps {
  rows: JobOrderRow[];
  isLoading?: boolean;
  showingCount?: number;
  total?: number;
  totalPages?: number;
  jobFilter?: "all" | "my-items";
  perPaginationPage?: number;
  currentUserRole?: string | null;
  setPerPaginationPage?: (page: number) => void;
  onRowClick?: (row: JobOrderRow) => void;
  handleUnderLinedRefNumberCLick?: (row: JobOrderRow) => void;
  onAcceptClick?: (row: JobOrderRow) => void;
  onReassignClick?: (row: JobOrderRow) => void;
  onReassignRequestClick?: (row: JobOrderRow) => void;
  openGenerateShipment?: (row: JobOrderRow) => void;
}

function toTitleCase(value?: string) {
  if (!value || typeof value !== "string") return "";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusButtonBg(row: JobOrderRow) {
  if (row.assignment_status === "AVAILABLE") return "#007406";
  if (row.assignment_status === "ASSIGNED") return "#3B82F6";
  return "#1D274E";
}

function rowBorderColor(_row: JobOrderRow) {
  // Default border color (client_type removed from response)
  return "#368DC4";
}

export function JobOrderTable({
  rows,
  isLoading = false,
  showingCount,
  total,
  jobFilter,
  currentUserRole,
  totalPages,
  perPaginationPage,
  setPerPaginationPage,
  openGenerateShipment,
  onRowClick,
  handleUnderLinedRefNumberCLick,
  onAcceptClick,
  onReassignClick,
  onReassignRequestClick,
}: JobOrderTableProps) {
  const currentShowingCount = showingCount ?? rows.length;
  const currentTotal = total ?? rows.length;
  const currentPage = perPaginationPage ?? 1;
  const resolvedTotalPages = Math.max(totalPages ?? 1, 1);

  const pages = useMemo(() => {
    if (resolvedTotalPages <= 5) {
      return Array.from(
        { length: resolvedTotalPages },
        (_, index) => index + 1,
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", resolvedTotalPages];
    }

    if (currentPage >= resolvedTotalPages - 2) {
      return [
        1,
        "...",
        resolvedTotalPages - 2,
        resolvedTotalPages - 1,
        resolvedTotalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      resolvedTotalPages,
    ];
  }, [currentPage, resolvedTotalPages]);

  return (
    <>
      <Box>
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
                    <Text c="#1D274E" fz="0.813rem" lh={1.45} mr={10}>
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
                    <Text c="#1D274E" fz="0.813rem" lh={1.45}>
                      No job-orders found.
                    </Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows.map((row, index) => (
                <Table.Tr
                  key={String(row.id)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={{
                    cursor: onRowClick ? "pointer" : "default",
                    boxShadow: `inset 6px 0 0 ${rowBorderColor(row)}`,
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#F1F3F4",
                  }}
                >
                  <Table.Td style={{ maxWidth: "150px" }}>
                    <Stack gap={2}>
                      <Text
                        component="button"
                        type="button"
                        c="#000000"
                        fz="0.875rem"
                        fw={700}
                        style={{
                          background: "transparent",
                          border: 0,
                          padding: 0,
                          textAlign: "left",
                          textDecoration: "underline",
                          cursor: onRowClick ? "pointer" : "default",
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleUnderLinedRefNumberCLick?.(row);
                        }}
                      >
                        {row.reference_number}
                      </Text>
                      <Text c="#000000" fz="0.813rem" lh={1.45}>
                        {row.client}
                      </Text>
                    </Stack>
                  </Table.Td>

                  <Table.Td style={{ maxWidth: "250px" }}>
                    <Stack gap={2}>
                      <Text c="#000000" fz="0.813rem" lh={1.45} fw={700}>
                        {row.job_type ? toTitleCase(row.job_type) : "-"}
                      </Text>

                      {row.job_type === "REGULATORY" ? (
                        <Group gap={6} align="center" wrap="nowrap">
                          <Text c="#000000" fz="0.813rem" lh={1.45}>
                            Application Type
                          </Text>
                          ---&gt; {""}
                          <Text c="#000000" fz="0.813rem" lh={1.45}>
                            {row.application_type}
                          </Text>
                        </Group>
                      ) : (
                        <>
                          <Group gap={6} align="center" wrap="nowrap">
                            <Text c="#000000" fz="0.813rem" lh={1.45}>
                              {row.service_type}
                            </Text>
                            ---&gt; {""}
                            <Text c="#000000" fz="0.813rem" lh={1.45}>
                              {row.transport_mode}
                            </Text>
                          </Group>
                          <Group gap={6} align="center" wrap="nowrap">
                            <Text c="#000000" fz="0.813rem" lh={1.45}>
                              {row.origin}
                            </Text>
                            ---&gt; {""}
                            <Text c="#000000" fz="0.813rem" lh={1.45}>
                              {row.destination}
                            </Text>
                          </Group>
                        </>
                      )}
                    </Stack>
                  </Table.Td>

                  <Table.Td style={{ maxWidth: "200px" }}>
                    <Stack gap={2}>
                      <Group gap={6} align="center" wrap="nowrap">
                        <Text c="#000000" fz="0.813rem" lh={1.45}>
                          BL No.
                        </Text>
                        ---&gt; {""}
                        <Text c="#000000" fz="0.813rem" lh={1.45}>
                          {row.bl_no ?? ""}
                        </Text>
                      </Group>

                      {row.quotation_reference_number ? (
                        <Text component="a" href="#" c="#2563EB" fz="0.813rem">
                          {row.quotation_reference_number}
                        </Text>
                      ) : null}
                    </Stack>
                  </Table.Td>

                  <Table.Td>
                    {row.assigned_to ? (
                      <Group>
                        <Avatar
                          radius="xl"
                          size={50}
                          src={row.ops_image ?? undefined}
                          name={row.assigned_to}
                          color="blue"
                        />
                        <Text c="#000000" fz="0.75rem" lh={1.4}>
                          {row.assigned_to}
                        </Text>
                      </Group>
                    ) : (
                      <Group>
                        <Avatar radius="xl" size={50} color="gray">
                          Un
                        </Avatar>
                        <Text c="#000000" fz="0.75rem" lh={1.4}>
                          Unassigned
                        </Text>
                      </Group>
                    )}
                  </Table.Td>

                  <Table.Td style={{ maxWidth: "150px" }}>
                    <Stack gap={4}>
                      {jobFilter === "my-items" && (
                        <>
                          {/* <Button
                            styles={{ root: { background: "#FF8800" } }}
                            leftSection={<RequestQuote width={20} />}
                            onClick={(event) => {
                              event.stopPropagation();

                              onMakeQuotationClick?.(row);
                            }}
                          >
                            Make Quotation
                          </Button> */}
                          {row.assignment_status ===
                          "REASSIGNMENT REQUESTED" ? (
                            <Button
                              disabled
                              c={"#CD862C"}
                              styles={{
                                root: {
                                  background: "#E4D8CA",
                                },
                              }}
                              leftSection={<Autorenew width={20} />}
                              onClick={(event) => {
                                event.stopPropagation();
                                onReassignRequestClick?.(row);
                              }}
                            >
                              Pending...
                            </Button>
                          ) : (
                            <Button
                              styles={{
                                root: {
                                  background:
                                    row.assignment_status ===
                                    "REASSIGNMENT REQUESTED"
                                      ? "#FF8800"
                                      : "#1D274E",
                                },
                              }}
                              leftSection={<Autorenew width={20} />}
                              onClick={(event) => {
                                event.stopPropagation();
                                onReassignRequestClick?.(row);
                              }}
                            >
                              Request Reassignment
                            </Button>
                          )}
                        </>
                      )}

                      {row.assignment_status === "ASSIGNED"  && row.generate_shipment ? (
                        <Button
                          styles={{ root: { background: "#FF8800" } }}
                          leftSection={<RequestQuote width={20} />}
                          onClick={(event) => {
                            event.stopPropagation();
                            openGenerateShipment?.(row);
                          }}
                        >
                          Generate Shipment
                        </Button>
                      ) : row.assignment_status === "ASSIGNED" ? (
                        <Group>
                          <CheckCircle width={20} color={"green"} />
                          <Text>Accepted</Text>
                        </Group>
                      ) : row.assignment_status === "REASSIGNMENT REQUESTED" &&
                        jobFilter === "all" ? (
                        <>
                          <Button
                            styles={{
                              root: { background: statusButtonBg(row) },
                            }}
                            leftSection={<Autorenew width={20} />}
                            onClick={(event) => {
                              event.stopPropagation();
                              onReassignClick?.(row);
                            }}
                          >
                            Reassignment Request
                          </Button>
                          <Text c="#1D274E" fz="0.65rem" fw={400} lh={1.4}>
                            Accepted: {row.assigned_at ?? row.date_created}
                          </Text>
                        </>
                      ) : jobFilter === "all" ? (
                        <>
                          <Button
                            styles={{
                              root: { background: statusButtonBg(row) },
                            }}
                            leftSection={<PanToolAlt width={20} />}
                            onClick={(event) => {
                              event.stopPropagation();
                              onAcceptClick?.(row);
                            }}
                          >
                            Accept
                          </Button>
                          <Text c="#007406" fz="0.65rem" fw={400} lh={1.4}>
                            Available
                          </Text>
                        </>
                      ) : (
                        ""
                      )}

                      {row.assignment_status === "ASSIGNED" && (
                        <Text c="#1D274E" fz="0.65rem" fw={400} lh={1.4}>
                          Req. Accepted: {row.assigned_at}
                        </Text>
                      )}
                    </Stack>
                  </Table.Td>

                  <Table.Td
                    style={{ width: "2.75rem", textAlign: "center" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Menu position="left">
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color="#334155"
                          aria-label="More actions"
                        >
                          <MoreVert width={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<FileOpen width={16} />}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleUnderLinedRefNumberCLick?.(row);
                          }}
                        >
                          View Details
                        </Menu.Item>
                        <Menu.Item leftSection={<FileOpen width={16} />}>
                          Documents
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          color="red"
                          leftSection={<Delete width={16} />}
                        >
                          Discard
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group align="center" justify="space-between" mt="md">
        <Text c="#8a8f99" fz="0.813rem">
          Showing {currentShowingCount} out of {currentTotal} entries
        </Text>

        {resolvedTotalPages > 1 && setPerPaginationPage ? (
          <Group gap={6} wrap="nowrap">
            <Button
              variant="outline"
              size="xs"
              radius="sm"
              leftSection={
                <ChevronRight
                  width={14}
                  style={{ transform: "rotate(180deg)" }}
                />
              }
              onClick={() =>
                currentPage > 1 && setPerPaginationPage(currentPage - 1)
              }
              disabled={currentPage === 1}
              styles={{
                root: {
                  minWidth: 92,
                  height: 30,
                  borderColor: "#D1D5DB",
                  color: "#4B5563",
                  fontWeight: 500,
                  paddingInline: 12,
                },
                section: {
                  marginRight: 4,
                },
              }}
            >
              Previous
            </Button>

            {pages.map((page, index) =>
              page === "..." ? (
                <Text key={`ellipsis-${index}`} c="#8a8f99" fz="0.813rem">
                  ...
                </Text>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? "filled" : "outline"}
                  size="xs"
                  radius="sm"
                  onClick={() =>
                    typeof page === "number" &&
                    page !== currentPage &&
                    setPerPaginationPage(page)
                  }
                  styles={{
                    root: {
                      minWidth: 30,
                      height: 30,
                      borderColor: page === currentPage ? "#1D274E" : "#D1D5DB",
                      backgroundColor:
                        page === currentPage ? "#1D274E" : "#FFFFFF",
                      color: page === currentPage ? "#FFFFFF" : "#4B5563",
                      fontWeight: 600,
                      paddingInline: 10,
                    },
                  }}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="xs"
              radius="sm"
              rightSection={<ChevronRight width={14} />}
              onClick={() =>
                currentPage < resolvedTotalPages &&
                setPerPaginationPage(currentPage + 1)
              }
              disabled={currentPage === resolvedTotalPages}
              styles={{
                root: {
                  minWidth: 74,
                  height: 30,
                  borderColor: "#D1D5DB",
                  color: "#4B5563",
                  fontWeight: 500,
                  paddingInline: 12,
                },
                section: {
                  marginLeft: 4,
                },
              }}
            >
              Next
            </Button>
          </Group>
        ) : null}
      </Group>
    </>
  );
}
