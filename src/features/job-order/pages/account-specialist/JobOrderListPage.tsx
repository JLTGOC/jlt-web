import { useState, useMemo, useEffect } from "react";
import {
  Divider,
  Stack,
  Table,
  Menu,
  ActionIcon,
  Text,
  Group,
  Button,
} from "@mantine/core";
import {
  MoreVert,
  ChevronRight,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { useNavigate } from "react-router";
import type {
  JobOrderListItem,
  JobOrderClientType,
} from "../../types/jobOrder";
import { RequestCell } from "./components/RequestCell";
import { getJobOrderRowStyle } from "./components/JobOrderTableRow";
import { DetailsCell } from "./components/DetailsCell";
import { PersonInChargeCell } from "./components/PersonInChargeCell";
import { QuotationCell } from "./components/QuotationCell";
import { JobOrderFilterClient } from "./components/JobOrderFilterClient";
import { JobOrderFilterTable } from "./components/JobOrderFilterTable";
import { ShowEntriesControl } from "./components/ShowEntriesControl";
import { PageCard } from "@/components/PageCard";

// MOCK DATA (replace with API call/hook)
const MOCK_DATA: JobOrderListItem[] = [
  {
    id: 1,
    reference_number: "SJO-04-2026-013",
    client_full_name: "Jenny Carla Dela Cruz",
    created_at: "2026-04-16",
    assignment_status: "ASSIGNED",
    service: "Logistics",
    logistics_service: {
      commodity: "Import",
      service_type: "Air",
      transport_mode: "Air",
      origin: "YTN Port, China",
      destination: "MNL Port, Manila",
    },
    person_in_charge: {
      name: "LEAD OPS PEÑA",
      avatar_url: undefined,
    },
    quotation_reference: "QT-09-2026-052",
    quotation_id: "QT-09-2026-052",
  },
  {
    id: 2,
    reference_number: "SJO-04-2026-012",
    client_full_name: "Sample 2",
    created_at: "2026-04-16",
    assignment_status: "AVAILABLE",
    service: "Regulatory",
    regulatory_service: {
      application_type: "Renewal",
    },
    person_in_charge: undefined,
    quotation_reference: "QT-09-2026-055",
    quotation_id: "QT-09-2026-055",
  },
];

function getClientType(row: JobOrderListItem): JobOrderClientType {
  // Replace with real logic
  return row.id === 1 ? "new" : "old";
}

export default function JobOrderListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "new" | "old">("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [service, setService] = useState("");
  const [personInCharge, setPersonInCharge] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    let data = MOCK_DATA;

    if (activeTab === "new") {
      data = data.filter((row) => getClientType(row) === "new");
    }

    if (activeTab === "old") {
      data = data.filter((row) => getClientType(row) === "old");
    }

    if (search) {
      data = data.filter(
        (row) =>
          row.client_full_name.toLowerCase().includes(search.toLowerCase()) ||
          row.reference_number.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (date) data = data.filter((row) => row.created_at === date);
    if (service) data = data.filter((row) => row.service === service);

    if (personInCharge) {
      data = data.filter((row) =>
        row.person_in_charge?.name
          .toLowerCase()
          .includes(personInCharge.toLowerCase()),
      );
    }

    return data;
  }, [activeTab, search, date, service, personInCharge]);

  const pagedData = useMemo(
    () => filteredData.slice((page - 1) * perPage, page * perPage),
    [filteredData, page, perPage],
  );

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, date, service, personInCharge]);

  const counts = useMemo(() => {
    const all = MOCK_DATA.length;
    const newCount = MOCK_DATA.filter(
      (row) => getClientType(row) === "new",
    ).length;
    const oldCount = MOCK_DATA.filter(
      (row) => getClientType(row) === "old",
    ).length;
    return { all, new: newCount, old: oldCount };
  }, []);

  const serviceOptions = [
    { value: "Logistics", label: "Logistics" },
    { value: "Regulatory", label: "Regulatory" },
  ];

  function handleReset() {
    setSearch("");
    setDate("");
    setService("");
    setPersonInCharge("");
    setActiveTab("all");
    setPage(1);
  }

  function handlePerPageChange(value: number) {
    setPerPage(value);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));

  const pages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }, [page, totalPages]);

  return (
    <PageCard title="Job Order">
      <Stack>
        <JobOrderFilterClient
          activeTab={activeTab}
          counts={counts}
          onTabChange={setActiveTab}
        />
        <JobOrderFilterTable
          search={search}
          onSearchChange={setSearch}
          onSearch={() => {}}
          date={date}
          onDateChange={setDate}
          service={service}
          onServiceChange={(value: string) => setService(value || "")}
          personInCharge={personInCharge}
          onPersonInChargeChange={(value: string) =>
            setPersonInCharge(value || "")
          }
          onReset={handleReset}
          serviceOptions={serviceOptions}
        />
        <Divider />
        <ShowEntriesControl
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
        />
        <Table
          withRowBorders={false}
          highlightOnHover
          styles={{
            table: { width: "100%", borderCollapse: "collapse" },
            thead: { backgroundColor: "#1e2235" },
            th: {
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "0.65rem 1rem",
              whiteSpace: "nowrap",
            },
            td: {
              fontSize: "0.75rem",
              padding: "0.65rem 1rem",
              color: "var(--mantine-color-dark-7)",
            },
            tr: { borderBottom: "1px solid var(--mantine-color-gray-2)" },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: "16.25rem" }}>REQUEST</Table.Th>
              <Table.Th style={{ width: "20rem" }}>DETAILS</Table.Th>
              <Table.Th style={{ width: "12.5rem" }}>PERSON IN CHARGE</Table.Th>
              <Table.Th style={{ width: "11.25rem" }}>QUOTATION</Table.Th>
              <Table.Th style={{ width: "3rem" }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pagedData.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" py="xl" c="dimmed" size="sm">
                    No job orders found.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              pagedData.map((row) => (
                <Table.Tr
                  key={row.id}
                  style={{
                    ...getJobOrderRowStyle(getClientType(row)),
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/accounts/clients/${row.id}`)}
                >
                  <Table.Td>
                    <RequestCell item={row} />
                  </Table.Td>
                  <Table.Td>
                    <DetailsCell item={row} />
                  </Table.Td>
                  <Table.Td>
                    <PersonInChargeCell person={row.person_in_charge} />
                  </Table.Td>
                  <Table.Td>
                    <QuotationCell
                      reference={row.quotation_reference}
                      id={row.quotation_id}
                    />
                  </Table.Td>
                  <Table.Td
                    style={{ textAlign: "right" }}
                    onClick={(event) => event.stopPropagation()}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <Menu shadow="md" width="10rem" position="left-start">
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color="dark"
                          size="sm"
                          onClick={(event) => event.stopPropagation()}
                          onMouseDown={(event) => event.stopPropagation()}
                        >
                          <MoreVert width={18} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          style={{ fontSize: "0.75rem" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/job-orders/${row.id}`);
                          }}
                        >
                          View Details
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
        <Group justify="space-between" align="center" mt="0.75rem">
          <Text size="0.75rem" c="dimmed">
            Showing {pagedData.length} out of {filteredData.length} entries
          </Text>
          <Group gap="0.25rem">
            <Button
              variant="outline"
              size="xs"
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
              leftSection={
                <ChevronRight
                  width={14}
                  style={{ transform: "rotate(180deg)" }}
                />
              }
            >
              Previous
            </Button>

            {pages.map((currentPage, index) =>
              currentPage === "..." ? (
                <Text key={`ellipsis-${index}`} size="0.75rem" c="dimmed">
                  ...
                </Text>
              ) : (
                <Button
                  key={currentPage}
                  variant={currentPage === page ? "filled" : "default"}
                  size="xs"
                  onClick={() =>
                    typeof currentPage === "number" &&
                    currentPage !== page &&
                    setPage(currentPage)
                  }
                >
                  {currentPage}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="xs"
              onClick={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages}
              rightSection={<ChevronRight width={14} />}
            >
              Next
            </Button>
          </Group>
        </Group>
      </Stack>
    </PageCard>
  );
}
