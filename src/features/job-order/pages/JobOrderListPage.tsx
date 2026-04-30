import { useState, useMemo } from "react";
import { Box, Divider, Stack, Text } from "@mantine/core";
import { AppTable } from "../../../components/AppTable";
import type { JobOrderListItem, JobOrderClientType } from "../types/jobOrder";
import { RequestCell } from "../components/RequestCell";
import { getJobOrderRowStyle } from "../components/JobOrderTableRow";
import { DetailsCell } from "../components/DetailsCell";
import { PersonInChargeCell } from "../components/PersonInChargeCell";
import { QuotationCell } from "../components/QuotationCell";
import { JobOrderTabs } from "../components/JobOrderTabs";
import { JobOrderFilters } from "../components/JobOrderFilters";
import { ShowEntriesControl } from "../components/ShowEntriesControl";
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
  // State
  const [activeTab, setActiveTab] = useState<"all" | "new" | "old">("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [service, setService] = useState("");
  const [personInCharge, setPersonInCharge] = useState("");
  const [perPage, setPerPage] = useState(10);

  // Filtering logic
  const filteredData = useMemo(() => {
    let data = MOCK_DATA;
    if (activeTab === "new")
      data = data.filter((row) => getClientType(row) === "new");
    if (activeTab === "old")
      data = data.filter((row) => getClientType(row) === "old");
    if (search)
      data = data.filter(
        (row) =>
          row.client_full_name.toLowerCase().includes(search.toLowerCase()) ||
          row.reference_number.toLowerCase().includes(search.toLowerCase()),
      );
    if (date) data = data.filter((row) => row.created_at === date);
    if (service) data = data.filter((row) => row.service === service);
    if (personInCharge)
      data = data.filter(
        (row) => row.person_in_charge?.name === personInCharge,
      );
    return data;
  }, [activeTab, search, date, service, personInCharge]);

  // Counts for tabs
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

  // Service/person options
  const serviceOptions = [
    { value: "Logistics", label: "Logistics" },
    { value: "Regulatory", label: "Regulatory" },
  ];
  const personOptions = MOCK_DATA.map((row) => row.person_in_charge?.name)
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map((name) => ({ value: name!, label: name! }));

  // Table columns
  const columns = [
    {
      key: "request",
      label: "REQUEST",
      render: (row: JobOrderListItem) => <RequestCell item={row} />,
      width: "16.25rem", // 260px
    },
    {
      key: "details",
      label: "DETAILS",
      render: (row: JobOrderListItem) => <DetailsCell item={row} />,
      width: "20rem", // 320px
    },
    {
      key: "person_in_charge",
      label: "PERSON IN CHARGE",
      render: (row: JobOrderListItem) => (
        <PersonInChargeCell person={row.person_in_charge} />
      ),
      width: "12.5rem", // 200px
    },
    {
      key: "quotation",
      label: "QUOTATION",
      render: (row: JobOrderListItem) => (
        <QuotationCell
          reference={row.quotation_reference}
          id={row.quotation_id}
        />
      ),
      width: "11.25rem", // 180px
    },
  ];

  // Reset handler
  function handleReset() {
    setSearch("");
    setDate("");
    setService("");
    setPersonInCharge("");
    setActiveTab("all");
  }

  return (
    <PageCard title="Job Order">
      <Stack>
        <JobOrderTabs
          activeTab={activeTab}
          counts={counts}
          onTabChange={setActiveTab}
        />
        <JobOrderFilters
          search={search}
          onSearchChange={setSearch}
          onSearch={() => {}}
          date={date}
          onDateChange={setDate}
          service={service}
          onServiceChange={(v) => setService(v || "")}
          personInCharge={personInCharge}
          onPersonInChargeChange={(v) => setPersonInCharge(v || "")}
          onReset={handleReset}
          serviceOptions={serviceOptions}
          personOptions={personOptions}
        />
        <Divider />
        <ShowEntriesControl perPage={perPage} onPerPageChange={setPerPage} />
        <AppTable
          columns={columns}
          data={filteredData.slice(0, perPage)}
          rowKey={(row: JobOrderListItem) => row.id}
          total={filteredData.length}
          showingCount={filteredData.slice(0, perPage).length}
          getRowProps={(row) => ({
            style: getJobOrderRowStyle(getClientType(row)),
          })}
        />
        <Box mt="xs">
          <Text size="sm" c="dimmed">
            Showing {Math.min(filteredData.length, perPage)} out of{" "}
            {filteredData.length} entries
          </Text>
        </Box>
      </Stack>
    </PageCard>
  );
}
