import { ActionIcon, Menu, Box, Group, Stack, Table, Text, Center, Loader, Pagination } from "@mantine/core";
import { MoreVert, Notifications } from "@nine-thirty-five/material-symbols-react/outlined";
import { useNavigate } from "react-router";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import type { RespondedQuotationListItem } from "@/features/quotations/types/quotations.types";
import styles from "./RespondedTable.module.css";

interface RespondedTableProps {
  rows: RespondedQuotationListItem[];
  isLoading?: boolean;
  showingCount?: number;
  total?: number;
  perPaginationPage?: number;
  setPerPaginationPage?: (page: number) => void;
  onRowClick?: (quotationId: string) => void;
}

function toTitleCase(value?: string) {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function RespondedTable({
  rows,
  isLoading = false,
  total = 0,
  showingCount,
  onRowClick,
  perPaginationPage = 1,
  setPerPaginationPage,
}: RespondedTableProps) {
  const navigate = useNavigate();
  const currentShowingCount = showingCount ?? rows.length;
  const currentTotal = total ?? rows.length;
  const totalPages = Math.ceil(currentTotal / 10);

  /*function getInitials(fullName: string | undefined): string {
    if (!fullName) return "?";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }*/

  return (
    <>
      <Box mt="sm">
        <Table withTableBorder withColumnBorders={false} styles={{ table: { width: "100%" }, tbody: { borderTop: "none", borderBottom: "none" } }}>
          <Table.Thead style={{ backgroundColor: "#17324f", color: "white" }}>
            <Table.Tr>
              <Table.Th style={{ width: "15%" }}>REF NO.</Table.Th>
              <Table.Th style={{ width: "30%" }}>DETAILS</Table.Th>
              <Table.Th style={{ width: "18%" }}>DATE</Table.Th>
              <Table.Th style={{ width: "15%" }}>STATUS</Table.Th>
              <Table.Th style={{ width: "0%" }}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center py="lg">
                    <Text c="#475569" fz="0.813rem" lh={1.45}>
                      Loading quotations...
                    </Text>
                    <Loader size="sm" />
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center py="lg">
                    <Text c="#475569" fz="0.813rem" lh={1.45}>
                      No responded quotations found.
                    </Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows.map((row, index) => {
                // Default to OLD color when undefined or explicitly OLD
                const rowBarColor = row.client_type !== "NEW" ? "#368DC4" : "#54B99B";
                const rowBackgroundColor = index % 2 === 0 ? "white" : "#F1F3F4";

                return (
                  <Table.Tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(String(row.id)) : undefined}
                    style={{
                      ...(onRowClick ? { cursor: "pointer" } : {}),
                      backgroundColor: rowBackgroundColor,
                    }}
                  >
                    {/* REF NO. column with color bar always shown */}
                    <Table.Td style={{ position: "relative", paddingLeft: "16px", minHeight: "80px", verticalAlign: "top" }}>
                      <Box
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 6,
                          background: rowBarColor,
                          borderRadius: "0px",
                          zIndex: 1,
                        }}
                      />
                      <Stack gap={2}>
                        <Text fw={700} style={{ textDecoration: "underline" }} c="#2a4058" fz="0.875rem">
                          {row.reference_number}
                        </Text>
                        <Stack gap={0}>
                          <Text c="#475569" fz="0.813rem">
                            {row.client_full_name}
                          </Text>
                          <Text c="#475569" fz="0.75rem">
                            {row.company_name ? `${row.company_name}` : ""}
                          </Text>
                        </Stack>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text fw={700} c="#2a4058" fz="0.875rem">{toTitleCase(row.service)}</Text>
                        {row.logistics_service ? (
                          <>
                            <Text c="#475569" fz="0.813rem">
                              {row.logistics_service.commodity}
                            </Text>
                            <Text c="#475569" fz="0.813rem">
                              {toTitleCase(row.logistics_service.service_type)}{" "}
                              ---&gt; {""}
                              {toTitleCase(row.logistics_service.transport_mode)}
                            </Text>
                            <Group gap={6} align="center" wrap="nowrap">
                              <Text c="#475569" fz="0.813rem">
                                {row.logistics_service.origin}
                              </Text>
                              ---&gt; {""}
                              <Text c="#475569" fz="0.813rem">
                                {row.logistics_service.destination}
                              </Text>
                            </Group>
                          </>
                        ) : row.regulatory_service ? (
                          <>
                            <Text c="#475569" fz="0.813rem">
                              {toTitleCase(row.regulatory_service.type_of_regulatory_assistance)}
                            </Text>
                            <Text c="#475569" fz="0.813rem">
                              Application Type: {toTitleCase(row.regulatory_service.application_type)}
                            </Text>
                            <Text c="#475569" fz="0.813rem">
                              Business Type: {row.regulatory_service.business_type ? toTitleCase(row.regulatory_service.business_type) : "—"}
                            </Text>
                          </>
                        ) : (
                          <Text c="#475569" fz="0.813rem">-</Text>
                        )}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="sm" align="center">
                        <Stack gap={2}>
                          <Group gap={4}>
                            <Text fz="0.813rem" c="#898989">
                              Quoted Date:
                            </Text>
                            <Text
                              fw={400}
                              fz="0.813rem"
                              c="#000"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {row.assigned_at}
                            </Text>
                          </Group>

                          <Group gap={4}>
                            <Text fz="0.813rem" c="#898989">
                              Valid Until:
                            </Text>
                            <Text
                              fw={400}
                              fz="0.813rem"
                              c="#000"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {(() => {
                                if (!row.assigned_at) return "-";
                                const quotedDate = new Date(row.assigned_at);
                                quotedDate.setDate(quotedDate.getDate() + 7);
                                return quotedDate.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                });
                              })()}
                            </Text>
                          </Group>

                          {/* Days left */}
                          <Text
                            fw={500}
                            fz="0.813rem"
                            style={{
                              whiteSpace: "nowrap",
                              color: (() => {
                                if (!row.assigned_at) return "#475569";
                                const quotedDate = new Date(row.assigned_at);
                                quotedDate.setDate(quotedDate.getDate() + 7);
                                const today = new Date();
                                const diffTime = quotedDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                if (diffDays <= 1) {
                                  return "#AA4851"; // today or 1 day left
                                }
                                return "#FF9933"; // more than 1 day left
                              })(),
                            }}
                          >
                            {(() => {
                              if (!row.assigned_at) return "";
                              const quotedDate = new Date(row.assigned_at);
                              quotedDate.setDate(quotedDate.getDate() + 7);
                              const today = new Date();
                              const diffTime = quotedDate.getTime() - today.getTime();
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                              if (diffDays <= 0) return "Expired";
                              if (diffDays === 1) return "1 day left";
                              if (diffDays === 0) return "Today";
                              return `${diffDays} days left`;
                            })()}
                          </Text>
                        </Stack>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={4}>
                        {(() => {
                          let displayLabel = "—";
                          let statusColor = "#ccc";
                          let statusTextColor = "#000";
                          let statusIcon: React.ReactNode = null;

                          switch (row.status) {
                            case "RESPONDED":
                              displayLabel = "Follow Up";
                              statusColor = "#FFECBF";
                              statusTextColor = "#F5940A";
                              statusIcon = (
                                <Notifications
                                  width={16}
                                  height={16}
                                  color="#FF9933"
                                  style={{ marginRight: 4 }}
                                />
                              );
                              break;
                            case "VIEWED BY CLIENT":
                              displayLabel = "Viewed by Client";
                              statusColor = "#D1E6FD";   // fill color
                              statusTextColor = "#0963E3"; // text color
                              break;
                            default:
                              displayLabel = toTitleCase(row.status || "—");
                              statusColor = "#9C9DA1";   // fallback gray
                              statusTextColor = "#fff";
                              break;
                          }

                          return (
                            <Box
                              style={{
                                backgroundColor: statusColor,
                                padding: "0.375rem 0.75rem",
                                borderRadius: "0.375rem",
                                display: "inline-flex",
                                alignItems: "center",
                                textAlign: "center",
                                position: "relative",
                                width: "9rem",
                                justifyContent: "center",
                              }}
                            >
                              {statusIcon}
                              <Text
                                fw={500}
                                c={statusTextColor}
                                fz="0.813rem"
                                style={{ position: "relative", zIndex: 2 }}
                              >
                                {displayLabel}
                              </Text>
                            </Box>
                          );
                        })()}

                        {/* Quoted By line */}
                        <Text c="#898989" fz="0.813rem">
                          Quoted By: {row.account_specialist ?? row.as_full_name ?? "—"}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={180} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon
                            variant="subtle"
                            color="#334155"
                            aria-label="More actions"
                            className={styles.menuActionIcon}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVert width={20} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item>View Details</Menu.Item>
                          <Menu.Item
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(
                                quotationRoutes.documents({
                                  tab: "responded",
                                  quotationId: String(row.id),
                                }),
                              );
                            }}
                          >
                            View Documents
                          </Menu.Item>
                          <Menu.Item>Update Quotation</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Box>
      <Group align="center" justify="space-between" mt="md">
        <Text c="#8a8f99" fz="0.813rem">
            Showing {currentShowingCount} out of {currentTotal} entries
        </Text>
      
        <Pagination total={totalPages || 1} value={perPaginationPage} onChange={setPerPaginationPage} size="xs" />
      </Group>
    </>
  );
}
