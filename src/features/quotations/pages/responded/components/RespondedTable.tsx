import { ActionIcon, Menu, Box, Group, Stack, Table, Text, Center, Loader, Avatar } from "@mantine/core";
import { MoreVert } from "@nine-thirty-five/material-symbols-react/rounded";
import type { RespondedQuotationListItem } from "@/features/quotations/types/quotations.types";
import styles from "./RespondedTable.module.css";

interface RespondedTableProps {
  rows: RespondedQuotationListItem[];
  isLoading?: boolean;
  showingCount?: number;
  total?: number;
  onRowClick?: (quotationId: string) => void;
}

function toTitleCase(value: string) {
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
}: RespondedTableProps) {
  const currentShowingCount = showingCount ?? rows.length;
  const currentTotal = total ?? rows.length;

  function getInitials(fullName: string | undefined): string {
    if (!fullName) return "?";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <>
      <Box mt="sm">
        <Table withTableBorder withColumnBorders={false} styles={{ table: { width: "100%" }, tbody: { borderTop: "none", borderBottom: "none" } }}>
          <Table.Thead style={{ backgroundColor: "#17324f", color: "white" }}>
            <Table.Tr>
              <Table.Th>REF NO.</Table.Th>
              <Table.Th>DETAILS</Table.Th>
              <Table.Th>PERSON IN CHARGE</Table.Th>
              <Table.Th>STATUS</Table.Th>
              <Table.Th></Table.Th>
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
                      <Stack gap={2}>
                        <Text fw={700} style={{ textDecoration: "underline" }} c="#475569">
                          {row.reference_number}
                        </Text>
                        <Text c="#475569" fz="0.813rem">{row.client_full_name}</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text fw={700}>{toTitleCase(row.service)}</Text>
                        {row.logistics_service ? (
                          <>
                            <Text c="#475569" fz="0.813rem">
                              {row.logistics_service.commodity}
                            </Text>
                            <Group gap={6} align="center" wrap="nowrap">
                              <Text c="#475569" fz="0.813rem">
                                {toTitleCase(row.logistics_service.service_type)}
                              </Text>
                              <Text c="#475569" fz="0.813rem">→</Text>
                              <Text c="#475569" fz="0.813rem">
                                {toTitleCase(row.logistics_service.transport_mode)}
                              </Text>
                            </Group>
                            <Group gap={6} align="center" wrap="nowrap">
                              <Text c="#475569" fz="0.813rem">
                                {row.logistics_service.origin}
                              </Text>
                              <Text c="#475569" fz="0.813rem">→</Text>
                              <Text c="#475569" fz="0.813rem">
                                {row.logistics_service.destination}
                              </Text>
                            </Group>
                          </>
                        ) : (
                          <Text c="#475569" fz="0.813rem">-</Text>
                        )}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="sm" align="center">
                        <Avatar
                          size="sm"
                          radius="xl"
                          name={getInitials(row.as_full_name)}
                          color="blue"
                        />
                        <Stack gap={2}>
                          <Text fw={700} fz="0.813rem" c="#475569">
                            AS
                          </Text>
                          <Text c="#475569" fz="0.75rem">
                            {row.as_full_name ? row.as_full_name : "-"}
                          </Text>
                        </Stack>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text fw={700}>
                          {row.status === "VIEWED BY CLIENT"
                            ? "Viewed By Client"
                            : row.status === "RESPONDED"
                              ? ""
                              : toTitleCase(row.status)}
                        </Text>
                        <Text c="#475569" fz="0.813rem">Quoted By: {row.as_full_name}</Text>
                        <Text c="#475569" fz="0.813rem">Date Quoted: {row.assigned_at}</Text>
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
                          <Menu.Item>Documents</Menu.Item>
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
      <Text mt="lg" ml="xs" c="#8a8f99" fz="0.813rem">
        Showing {currentShowingCount} out of {currentTotal} entries
      </Text>
    </>
  );
}
