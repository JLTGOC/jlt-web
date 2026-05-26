import { ActionIcon, Avatar, Box, Group, Menu, Select, Stack, Table, Text } from "@mantine/core";
import { useEffect } from "react";
import { MoreVert } from "@nine-thirty-five/material-symbols-react/rounded";
import { Anchor as IconAnchor, DirectionsBoat } from "@nine-thirty-five/material-symbols-react/outlined/filled";
import { Box as BoxIcon, Folder } from "@nine-thirty-five/material-symbols-react/outlined";
import { Icons } from "@/assets/icons";
import { SearchBar } from "@/components/SearchBar";
import type { ClientShipment } from "@/features/accounts/types/accounts.types";
import styles from "../ClientTables.module.css";

interface SubShipmentTableProps {
  shipments: ClientShipment[];
  page: number;
  perPage: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

function titleCaseStatus(value?: string) {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(fullName?: string) {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .map((n) => (n ? n[0] : ""))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatEtaEtd(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const monthShort = d.toLocaleString("en-US", { month: "short" });
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${monthShort} ${dd} ${yyyy}`;
}

export function SubShipmentTable({
  shipments,
  page,
  perPage,
  searchValue,
  onSearchChange,
  onSearch,
  onPageChange,
  onPerPageChange,
}: SubShipmentTableProps) {
  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredShipments = shipments.filter((row) => {
    if (!normalizedSearch) return true;
    return row.referenceNumber?.toString().toLowerCase().includes(normalizedSearch);
  });

  const total = filteredShipments.length;
  const isShowAll = perPage === 0;
  const totalPages = isShowAll ? 1 : Math.max(1, Math.ceil(total / perPage));

  useEffect(() => {
    if (page > totalPages) {
      onPageChange(totalPages);
    }
  }, [page, totalPages, onPageChange]);

  const visibleShipments = isShowAll ? filteredShipments : filteredShipments.slice((page - 1) * perPage, page * perPage);

  return (
    <Box style={{ width: "100%", overflowX: "auto" }}>
      <Group justify="space-between" mb="0.75rem" align="center">
        <Group gap="0.4rem" align="center">
          <Text size="0.8rem" c="dimmed">
            Show
          </Text>
          <Select
          data={["10", "20", "30"]}
          value={String(perPage || 10)}
          onChange={(value) => {
            if (!value) return;
            onPerPageChange(Number(value));
          }}
          size="xs"
          w="4rem"
          allowDeselect={false}
          styles={{
            input: {
              textAlign: "center",
              fontSize: "0.75rem",
              height: "1.6rem",
              minHeight: "1.6rem",
              padding: "0 0.5rem",
            },
          }}
        />
        <Text size="0.8rem" c="dimmed">
          entries
        </Text>
      </Group>

      <SearchBar
        placeholder="Search Reference No."
        value={searchValue}
        onChange={onSearchChange}
        onSearch={onSearch}
      />
      </Group>

      <Table withTableBorder styles={{ table: { width: "100%" } }}>
        <Table.Thead style={{ backgroundColor: "#17324f", color: "white" }}>
          <Table.Tr>
            <Table.Th style={{ width: "20%" }}>SHIPMENT</Table.Th>
            <Table.Th style={{ width: "30%" }}>DETAILS</Table.Th>
            <Table.Th style={{ width: "15%" }}>SCHEDULE</Table.Th>
            <Table.Th style={{ width: "15%" }}>PERSON IN CHARGE</Table.Th>
            <Table.Th style={{ width: "15%" }}>STATUS</Table.Th>
            <Table.Th style={{ width: "5%" }}></Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {visibleShipments.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Box py="lg" style={{ textAlign: "center" }}>
                  <Text c="#475569">No shipments found.</Text>
                </Box>
              </Table.Td>
            </Table.Tr>
          ) : (
            visibleShipments.map((row, index) => (
              <Table.Tr
                key={row.referenceNumber}
                style={{ backgroundColor: index % 2 === 0 ? "white" : "#F1F3F4" }}
              >
                <Table.Td>
                  <Stack gap={4}>
                    <Text fw={700} c="#2a4058">
                      {row.referenceNumber}
                    </Text>
                    <Text fw={500} c="#2a4058">
                      BL: {row.blNumber || "—"}
                    </Text>
                  </Stack>
                </Table.Td>

                <Table.Td>
                  <Stack gap={4}>
                    <Text fw={700} c="#2a4058">
                      {row.serviceType} → {row.transportMode}
                    </Text>
                    <div style={{ display: "grid", gap: "0.25rem" }}>
                      <div>{row.origin}</div>
                      <div>{row.destination}</div>
                    </div>
                  </Stack>
                </Table.Td>

                <Table.Td>
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <Group gap="xs" align="center">
                      {row.transportMode?.toUpperCase() === "AIR" ? (
                        <img
                          src={Icons.ETA_air}
                          alt="ETA icon"
                          width={18}
                          height={18}
                          style={{ display: "block" }}
                        />
                      ) : (
                        <IconAnchor
                          width={18}
                          height={18}
                          style={{ display: "block", color: "#4E6174" }}
                          aria-label="Sea ETA icon"
                        />
                      )}
                      <Text c="#475569" fz="0.813rem">
                        {"ETA: " + formatEtaEtd(row.eta)}
                      </Text>
                    </Group>
                    <Group gap="xs" align="center">
                      {row.transportMode?.toUpperCase() === "AIR" ? (
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
                        {"ETD: " + formatEtaEtd(row.etd)}
                      </Text>
                    </Group>
                  </div>
                </Table.Td>

                <Table.Td>
                  <Group gap="sm" align="center">
                    <Avatar
                      size="md"
                      radius="xl"
                      src={row.pic_image_path ? row.pic_image_path : undefined}
                      name={row.personInCharge ? getInitials(row.personInCharge) : "?"}
                      color="blue"
                    />
                    <Stack gap={2}>
                      <Text fw={700} fz="0.75rem" c="#475569">
                        {row.personInCharge ? "PIC" : "OPS"}
                      </Text>
                      <Text c="#475569" fz="0.75rem">
                        {row.personInCharge ?? "—"}
                      </Text>
                    </Stack>
                  </Group>
                </Table.Td>

                <Table.Td>
                  <div className={styles.statusBadge} data-status={titleCaseStatus(row.status)}>
                    <Text fw={500} c="currentColor" style={{ position: "relative", zIndex: 2 }}>
                      {titleCaseStatus(row.status) || "—"}
                    </Text>
                  </div>
                </Table.Td>

                <Table.Td style={{ textAlign: "right" }}>
                  <Menu shadow="md" width={180} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="#334155" onClick={(e) => e.stopPropagation()}>
                        <MoreVert width={20} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<BoxIcon width={18} height={18} style={{ color: "#1D274E" }} />}
                        onClick={() => console.log("View Shipment", row)}
                      >
                        View Shipment
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<Folder width={18} height={18} style={{ color: "#1D274E" }} />}
                        onClick={() => console.log("View Documents", row)}
                      >
                        View Documents
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
  );
}
