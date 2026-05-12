import {
  ActionIcon,
  Menu,
  Box,
  Group,
  Stack,
  Table,
  Text,
  Center,
  Loader,
  Avatar,
  Pagination,
} from "@mantine/core";
import { MoreVert } from "@nine-thirty-five/material-symbols-react/rounded";
import { Anchor, DirectionsBoat } from "@nine-thirty-five/material-symbols-react/outlined/filled";
import { Icons } from "@/assets/icons";
import { Assignment, Folder, EventNote} from "@nine-thirty-five/material-symbols-react/outlined";
import { useNavigate } from "react-router";
import { shipmentRoutes } from "@/features/shipments/utils/shipmentRoutes";
import type { ShipmentListItem } from "@/features/shipments/types/shipments.types";
import styles from "./ShipmentTable.module.css";

interface ShipmentTableProps {
  rows: ShipmentListItem[];
  isLoading?: boolean;
  showingCount?: number;
  total?: number;
  perPaginationPage?: number;
  setPerPaginationPage?: (page: number) => void;
  onRowClick?: (shipmentId: number) => void;
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(fullName: string | undefined): string {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStatusColor(status: string | undefined): string {
  if (!status) return "#999";
  
  // Map status to CSS variable name
  const statusMap: Record<string, string> = {
    "Not Yet Departed": "var(--status-button-color-not-yet-departed)",
    "In Transit": "var(--status-button-color-in-transit)",
    "Arrived": "var(--status-button-color-arrived)",
    "Berthed": "var(--status-button-color-berthed)",
    "Discharged": "var(--status-button-color-discharged)",
    "Delivered": "var(--status-button-color-delivered)",
  };
  
  // Direct match first
  if (statusMap[status]) {
    return statusMap[status];
  }
  
  // Try normalized version
  const normalized = toTitleCase(status);
  if (statusMap[normalized]) {
    return statusMap[normalized];
  }
  
  // Default fallback
  return "#999";
}

function getStatusTextColor(status: string | undefined): string {
  if (!status) return "#666";
  
  // Map status to CSS variable name
  const statusMap: Record<string, string> = {
    "Not Yet Departed": "var(--status-outline-color-not-yet-departed)",
    "In Transit": "var(--status-outline-color-in-transit)",
    "Arrived": "var(--status-outline-color-arrived)",
    "Berthed": "var(--status-outline-color-berthed)",
    "Discharged": "var(--status-outline-color-discharged)",
    "Delivered": "var(--status-outline-color-delivered)",
  };
  
  // Direct match first
  if (statusMap[status]) {
    return statusMap[status];
  }
  
  // Try normalized version
  const normalized = toTitleCase(status);
  if (statusMap[normalized]) {
    return statusMap[normalized];
  }
  
  // Default fallback
  return "#666";
}

export function ShipmentTable({
  rows,
  isLoading = false,
  total = 0,
  showingCount,
  onRowClick,
  perPaginationPage = 1,
  setPerPaginationPage,
}: ShipmentTableProps) {
  const navigate = useNavigate();
  const currentShowingCount = showingCount ?? rows.length;
  const currentTotal = total ?? rows.length;
  const totalPages = Math.ceil(currentTotal / 10);

  return (
    <>
      <Box mt="sm" style={{ width: "100%", overflowX: "auto" }}>
        <Table
          withTableBorder
          withColumnBorders={false}
          styles={{
            table: { width: "100%", minWidth: 980 },
            tbody: { borderTop: "none", borderBottom: "none" },
          }}
        >
          <Table.Thead style={{ backgroundColor: "#17324f", color: "white" }}>
            <Table.Tr>
              <Table.Th style={{ width: "15%" }}>SHIPMENT</Table.Th>
              <Table.Th style={{ width: "28%" }}>DETAILS</Table.Th>
              <Table.Th style={{ width: "15%" }}>SERVICE INFO</Table.Th>
              <Table.Th style={{ width: "15%" }}>PERSON IN CHARGE</Table.Th>
              <Table.Th style={{ width: "10%" }}>STATUS</Table.Th>
              <Table.Th style={{ width: "5%" }}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Center py="lg">
                    <Group>
                      <Text c="#475569" fz="0.813rem" lh={1.45}>
                        Loading shipments...
                      </Text>
                      <Loader size="sm" />
                    </Group>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Center py="lg">
                    <Text c="#475569" fz="0.813rem" lh={1.45}>
                      No shipments found.
                    </Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows.map((row, index) => {
                const rowBackgroundColor =
                  index % 2 === 0 ? "white" : "#F1F3F4";
                const statusColor = getStatusColor(row.status);
                const statusTextColor = getStatusTextColor(row.status);
                // Default to OLD color when undefined or explicitly OLD
                const rowBarColor = row.client_type !== "NEW" ? "#368DC4" : "#54B99B";

                return (
                  <Table.Tr
                    key={row.id}
                    onClick={
                      onRowClick ? () => onRowClick(row.id) : undefined
                    }
                    style={{
                      ...(onRowClick ? { cursor: "pointer" } : {}),
                      backgroundColor: rowBackgroundColor,
                    }}
                  >
                    {/* SHIPMENT column with color bar */}
                    <Table.Td style={{ position: "relative", paddingLeft: "16px" }}>
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
                      <Stack gap={2} style={{ minWidth: 0 }}>
                        <Text fw={700} c="#475569" fz="0.813rem" lineClamp={1}>
                          {row.reference_number}
                        </Text>
                        <Text fw={500} c="#475569" fz="0.813rem" lh={1.45} lineClamp={1}>
                          {typeof row.client === 'object' ? row.client.full_name : row.client_full_name || row.client || "—"}
                        </Text>
                        <Text fw={500} c="#475569" fz="0.813rem" lh={1.45} lineClamp={1}>
                          {typeof row.client === 'object' ? row.client.company_name : row.company_name || "—"}
                        </Text>
                      </Stack>
                    </Table.Td>

                    {/* DETAILS column */}
                    <Table.Td>
                      <Stack gap={2}>
                        <Text c="#475569" fz="0.813rem" lh={1.45}>
                          {row.service_type ?? "—"}{" "}
                          ---&gt; {""}
                          {row.transport_mode ?? "—"}
                        </Text>
                        <Group gap={6} align="center" wrap="nowrap">
                          <Text c="#475569" fz="0.813rem" lh={1.45}>
                            {row.origin || "—"}
                          </Text>
                          <Text c="#475569" fz="0.813rem" lh={1.45}>
                            ---&gt;
                          </Text>
                          <Text c="#475569" fz="0.813rem" lh={1.45}>
                            {row.destination || "—"}
                          </Text>
                        </Group>
                      </Stack>
                    </Table.Td>

                    {/* SERVICE INFO column */}
                    <Table.Td>
                      <Stack gap={2}>
                        <Text c="#475569" fz="0.813rem">
                          Service Level: {row.service_level ?? "—"}
                        </Text>
                        <Text fw={700} c="#475569" fz="0.813rem">
                          BL: {row.bl_number || "—"}
                        </Text>
                        <Group gap="xs" align="center">
                            {row.transport_mode?.toUpperCase() === "AIR" ? (
                            <img
                              src={Icons.ETA_air}
                              alt="ETA icon"
                              width={18}
                              height={18}
                              style={{ display: "block" }}
                            />
                          ) : (
                            <Anchor
                              width={18}
                              height={18}
                              style={{ display: "block", color: "#4E6174" }}
                              aria-label="Sea ETA icon"
                            />
                          )}
                          <Text c="#475569" fz="0.813rem">
                            {"ETA: " + (row.eta || "—")}
                          </Text>
                        </Group>
                        <Group gap="xs" align="center">
                          {row.transport_mode?.toUpperCase() === "AIR" ? (
                            <img
                              src={Icons.ETD_air}
                              alt="ETD icon"
                              width={18}
                              height={18}
                              style={{ display: "block" }}
                            />
                          ) : (
                            <DirectionsBoat
                              width={18}
                              height={18}
                              style={{ display: "block", color: "#4E6174" }}
                              aria-label="Sea ETD icon"
                            />
                          )}
                          <Text c="#475569" fz="0.813rem">
                            {"ETD: " + (row.etd || "—")}
                          </Text>
                        </Group>
                      </Stack>
                    </Table.Td>

                    {/* PERSON IN CHARGE column */}
                    <Table.Td>
                      <Group gap="sm" align="center">
                        <Avatar
                          size="md"
                          radius="xl"
                          src={row.person_in_charge?.avatar_url}
                          name={
                            row.person_in_charge
                              ? getInitials(row.person_in_charge.full_name)
                              : "?"
                          }
                          color="blue"
                        />
                        <Stack gap={2}>
                          <Text fw={700} fz="0.75rem" c="#475569">
                            {row.person_in_charge?.role || "OPS"}
                          </Text>
                          <Text c="#475569" fz="0.75rem">
                            {row.person_in_charge?.full_name || "—"}
                          </Text>
                        </Stack>
                      </Group>
                    </Table.Td>

                    {/* STATUS column */}
                    <Table.Td>
                      <Box
                        style={{
                          backgroundColor: statusColor,
                          padding: "0.375rem 0.75rem",
                          borderRadius: "0.375rem",
                          display: "inline-block",
                          textAlign: "center",
                          position: "relative",
                        }}
                      >
                        <Text fw={500} c={statusTextColor} fz="0.8rem" style={{ position: "relative", zIndex: 2 }}>
                          {row.status || "—"}
                        </Text>
                      </Box>
                    </Table.Td>

                    {/* ACTIONS column */}
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
                          <Menu.Item>
                            <Group gap={8}>
                              <Assignment width={20} height={20} style={{ color: "#1C213B" }} />
                              <Text fz="0.813rem">Job Order</Text>
                            </Group>
                          </Menu.Item>
                          <Menu.Item
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(
                                shipmentRoutes.documents({
                                  tab: "logistics",
                                  shipmentId: String(row.id),
                                }),
                              );
                            }}
                          >
                            <Group gap={8}>
                              <Folder width={20} height={20} style={{ color: "#1C213B" }} />
                              <Text fz="0.813rem">Documents</Text>
                            </Group>
                          </Menu.Item>
                          <Menu.Item>
                            <Group gap={8}>
                              <EventNote width={20} height={20} style={{ color: "#1C213B" }} />
                              <Text fz="0.813rem">Planning & Timeline</Text>
                            </Group>
                          </Menu.Item>
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
