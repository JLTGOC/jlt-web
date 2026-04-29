import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  MoreVert,
  Search,
  ChevronRight,
} from "@nine-thirty-five/material-symbols-react/rounded";
import {
  ArrowRightAlt,
  CheckCircle,
  Autorenew,
  PanToolAlt,
} from "@nine-thirty-five/material-symbols-react/outlined";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";

const entryOptions = ["10", "25", "50"];

type RequestedQuotationRow = RequestedQuotationListItem;

const tableHead = ["REQUEST", "DETAILS", "STATUS", ""] as const;

export interface AppTable2Props {
  quotations: RequestedQuotationRow[];
  jobFilter: "all" | "my-items";
  isLoading?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  perPage: number;
  onPerPageChange: (value: number) => void;
  showingCount?: number;
  total?: number;
  onRowClick?: (row: RequestedQuotationRow) => void;
  searchPlaceholder?: string;
  onAcceptClick?: (row: RequestedQuotationRow) => void;
  onReassignClick?: (row: RequestedQuotationRow) => void;
  onJobFilterChange?: (filter: "all" | "my-items") => void;
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusLabel(row: RequestedQuotationRow) {
  return toTitleCase(
    row.assignment_status === "AVAILABLE"
      ? "Accept"
      : row.assignment_status === "ASSIGNED"
        ? "Accepted"
        : "Reassignment Requested",
  );
}

function getServiceLabel(service: string) {
  return toTitleCase(service);
}

export default function AppTable2({
  quotations,
  isLoading = false,
  searchValue,
  onSearchChange,
  onSearch,
  perPage,
  onPerPageChange,
  showingCount,
  total,
  onRowClick,
  searchPlaceholder = "SEARCH REFERENCE OR CLIENT",
  onAcceptClick,
  onReassignClick,
  jobFilter,
  onJobFilterChange,
}: AppTable2Props) {
  const [dateFilter, setDateFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const serviceOptions = useMemo(() => {
    const values = new Set<string>();

    quotations.forEach((row) => {
      if (row.service) {
        values.add(toTitleCase(row.service));
      }
    });

    return Array.from(values).map((value) => ({ value, label: value }));
  }, [quotations]);

  const statusOptions = useMemo(() => {
    const values = new Set<string>();

    quotations.forEach((row) => {
      values.add(getStatusLabel(row));
    });

    return Array.from(values).map((value) => ({ value, label: value }));
  }, [quotations]);

  const allClientCount = total ?? quotations.length;
  const newClientCount = quotations.filter(
    (row) => row.assignment_status === "AVAILABLE",
  ).length;
  const oldClientCount = Math.max(allClientCount - newClientCount, 0);
  const currentShowingCount = showingCount ?? quotations.length;
  const currentTotal = total ?? quotations.length;

  const topTabStyles = {
    root: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.45rem 0.7rem",
      borderBottom: "2px solid transparent",
    },
    label: {
      fontSize: "0.82rem",
      fontWeight: 700,
      color: "#2c3f55",
      textTransform: "uppercase" as const,
    },
  };

  const statusButtonBg = (row: RequestedQuotationRow) => {
    if (row.assignment_status === "AVAILABLE") return "#007406";
    if (row.assignment_status === "ASSIGNED") return "#3B82F6";
    return "#1D274E";
  };

  return (
    <Stack gap="xs">
      {/**/}
      <Box
        p="xs"
        style={{
          background: "#ffffff",
          borderRadius: "0.55rem",
          border: "1px solid #e2e6eb",
        }}
      >
        <Group gap="xs">
          {/* Tab: ALL CLIENTS */}
          <UnstyledButton
            onClick={() => onJobFilterChange?.("all")}
            styles={topTabStyles}
            style={{ 
              borderBottomColor: jobFilter === "all" ? "#ef8f27" : "transparent",
              cursor: "pointer",
              transition: "all 150ms ease"
            }}
          >
            <Text fz="0.82rem" fw={700} c="#2c3f55">ALL CLIENTS</Text>
            <Text fz="0.82rem" fw={700} c="#8a8f99">{allClientCount}</Text>
          </UnstyledButton>

          <Divider orientation="vertical" color="#dde2e8" />

          {/* Tab: NEW CLIENT */}
          <UnstyledButton
            onClick={() => onJobFilterChange?.("my-items")}
            styles={topTabStyles}
            style={{ 
              borderBottomColor: jobFilter === "my-items" ? "#ef8f27" : "transparent",
              cursor: "pointer",
              transition: "all 150ms ease"
            }}
          >
            <Badge circle size="8" color="teal" p={0} />
            <Text fz="0.82rem" fw={700} c="#2c3f55">NEW CLIENT</Text>
            <Text fz="0.82rem" fw={700} c="#8a8f99">{newClientCount}</Text>
          </UnstyledButton>

          <Divider orientation="vertical" color="#dde2e8" />

          {/* Tab: OLD CLIENT - Currently disabled (no separate filter) */}
          <UnstyledButton
            disabled
            styles={topTabStyles}
            style={{ 
              borderBottomColor: jobFilter === "my-items" ? "#ef8f27" : "transparent",
              opacity: 0.5,
              cursor: "not-allowed"
            }}
          >
            <Badge circle size="8" color="blue" p={0} />
            <Text fz="0.82rem" fw={700} c="#2c3f55">OLD CLIENT</Text>
            <Text fz="0.82rem" fw={700} c="#8a8f99">{oldClientCount}</Text>
          </UnstyledButton>
        </Group>
      </Box>

      <Box
        p="xs"
        style={{
          background: "#f3f5f7",
          borderRadius: "0.75rem",
          border: "1px solid #e0e5eb",
        }}
      >
        <Box
          p="xs"
          style={{
            background: "#ffffff",
            borderRadius: "0.55rem",
            border: "1px solid #e2e6eb",
          }}
        >
          <Group gap="xs" wrap="wrap" mb="sm">
            <TextInput
              w={220}
              size="sm"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSearch(searchValue);
                }
              }}
            />

            <Button
              type="button"
              h={36}
              px="sm"
              radius="sm"
              color="#4f657d"
              aria-label="Search"
              onClick={() => onSearch(searchValue)}
            >
              <Search width={16} />
            </Button>

            <TextInput
              w={170}
              size="sm"
              placeholder="REQ. DATE"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.currentTarget.value)}
              rightSection={
                <ActionIcon
                  size={28}
                  radius="xs"
                  variant="filled"
                  color="#4f657d"
                  aria-label="Request date"
                >
                  <ChevronRight width={16} />
                </ActionIcon>
              }
            />

            <Select
              w={185}
              size="sm"
              placeholder="ALL SERVICES"
              data={serviceOptions}
              value={serviceFilter}
              onChange={setServiceFilter}
              rightSection={<ChevronRight width={16} />}
            />

            <Select
              w={185}
              size="sm"
              placeholder="SELECT STATUS"
              data={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              rightSection={<ChevronRight width={16} />}
            />

            <Button
              type="button"
              h={36}
              px="md"
              radius="sm"
              color="#4f657d"
              onClick={() => {
                setDateFilter("");
                setServiceFilter(null);
                setStatusFilter(null);
                onSearchChange("");
                onSearch("");
              }}
            >
              RESET
            </Button>
          </Group>

          <Divider color="#e5e8ed" mb="xs" />

          <Group gap="xs" align="center">
            <Text c="#7a808a" fz="0.9rem">Show</Text>
            <Select
              w={70}
              size="xs"
              data={entryOptions}
              value={String(perPage)}
              onChange={(value) => {
                if (value) {
                  onPerPageChange(Number(value));
                }
              }}
            />
            <Text c="#7a808a" fz="0.9rem">entries</Text>
          </Group>
        </Box>

        <Box mt="sm" style={{ border: "1px solid #d7dce3" }}>
        <Table
          withTableBorder
          withColumnBorders={false}
          styles={{
            table: { width: "100%" },
            tr: { "&:hover": { background: "#f8fafc" } },
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
                  <Text c="#475569" fz="0.813rem" lh={1.45}>Loading quotations...</Text>
                </Table.Td>
              </Table.Tr>
            ) : quotations.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="#475569" fz="0.813rem" lh={1.45}>No quotations found.</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              quotations.map((row) => (
                <Table.Tr
                  key={String(row.id)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  <Table.Td style={{ minWidth: "16.25rem" }}>
                    <Stack gap={2}>
                      <Text c="#334155" fz="0.875rem" fw={700}>{row.reference_number}</Text>
                      <Text c="#475569" fz="0.813rem" lh={1.45}>{row.client_full_name}</Text>
                      <Text c="#475569" fz="0.813rem" lh={1.45}>Req. Date: {row.date}</Text>
                    </Stack>
                  </Table.Td>

                  <Table.Td style={{ minWidth: "22.5rem" }}>
                    <Stack gap={2}>
                      <Text c="#2a4058" fz="0.875rem" fw={700}>{getServiceLabel(row.service)}</Text>
                    {row.logistics_service ? (
                      <>
                        <Text c="#475569" fz="0.813rem" lh={1.45}>{row.logistics_service.commodity}</Text>
                        <Text c="#475569" fz="0.813rem" lh={1.45}>
                          {toTitleCase(row.logistics_service.service_type)} ·{" "}
                          {toTitleCase(row.logistics_service.transport_mode)}
                        </Text>
                        <Group gap={5} align="center" wrap="nowrap">
                          <Text c="#475569" fz="0.813rem" lh={1.45}>{row.logistics_service.origin}</Text>
                          <ArrowRightAlt width={15} />
                          <Text c="#475569" fz="0.813rem" lh={1.45}>{row.logistics_service.destination}</Text>
                        </Group>
                      </>
                    ) : row.regulatory_service ? (
                      <>
                        <Text c="#475569" fz="0.813rem" lh={1.45}>Application Type</Text>
                        <Text c="#2a4058" fz="0.875rem" fw={700}>
                          {toTitleCase(row.regulatory_service.application_type)}
                        </Text>
                      </>
                    ) : (
                      <Text c="#475569" fz="0.813rem" lh={1.45}>-</Text>
                    )}
                    </Stack>
                  </Table.Td>

                  <Table.Td style={{ minWidth: "18.125rem" }}>
                    <Stack gap={4}>
                    <Button
                      styles={{ root: { background: statusButtonBg(row) } }}
                      leftSection={
                        row.assignment_status === "AVAILABLE"
                          ? <PanToolAlt width={20} />
                          : row.assignment_status === "ASSIGNED"
                            ? <CheckCircle width={20} />
                            : <Autorenew width={20} />
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        if (row.assignment_status === "AVAILABLE") {
                          onAcceptClick?.(row);
                          return;
                        }

                        if (row.assignment_status !== "ASSIGNED") {
                          onReassignClick?.(row);
                        }
                      }}
                      disabled={row.assignment_status === "ASSIGNED"}
                    >
                      {getStatusLabel(row)}
                    </Button>
                    {row.account_specialist && (
                      <Text c="#334155" fz="0.75rem" lh={1.4}>{row.account_specialist}</Text>
                    )}
                    {row.assignment_status === "AVAILABLE" && (
                      <Text c="#16803d" fz="0.75rem" fw={700} lh={1.4}>{toTitleCase(row.assignment_status)}</Text>
                    )}
                    {row.assigned_at && (
                      <Text c="#334155" fz="0.75rem" lh={1.4}>Assigned at: {row.assigned_at}</Text>
                    )}
                    {row.prepared_by && (
                      <Text c="#334155" fz="0.75rem" lh={1.4}>Prepared by: {row.prepared_by}</Text>
                    )}
                    </Stack>
                  </Table.Td>

                  <Table.Td style={{ width: "2.75rem", textAlign: "center" }}>
                    <ActionIcon variant="subtle" color="#334155" aria-label="More actions">
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
      </Box>
    </Stack>
  );
}
