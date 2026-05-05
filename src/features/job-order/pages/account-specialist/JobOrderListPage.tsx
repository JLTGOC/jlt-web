import { useState, useMemo, useEffect } from "react";
import { Divider, Stack } from "@mantine/core";
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
      data = data.filter(
        (row) => row.person_in_charge?.name === personInCharge,
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

  const personOptions = MOCK_DATA.map((row) => row.person_in_charge?.name)
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .map((name) => ({ value: name!, label: name! }));

  const columns = [
    {
      key: "request",
      label: "REQUEST",
      render: (row: JobOrderListItem) => <RequestCell item={row} />,
      width: "16.25rem",
    },
    {
      key: "details",
      label: "DETAILS",
      render: (row: JobOrderListItem) => <DetailsCell item={row} />,
      width: "20rem",
    },
    {
      key: "person_in_charge",
      label: "PERSON IN CHARGE",
      render: (row: JobOrderListItem) => (
        <PersonInChargeCell person={row.person_in_charge} />
      ),
      width: "12.5rem",
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
      width: "11.25rem",
    },
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
          onServiceChange={(value) => setService(value || "")}
          personInCharge={personInCharge}
          onPersonInChargeChange={(value) => setPersonInCharge(value || "")}
          onReset={handleReset}
          serviceOptions={serviceOptions}
          personOptions={personOptions}
        />
        <Divider />
        <ShowEntriesControl
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
        />
        <AppTable
          columns={columns}
          data={pagedData}
          rowKey={(row: JobOrderListItem) => row.id}
          total={filteredData.length}
          showingCount={pagedData.length}
          page={page}
          onPageChange={setPage}
          getRowProps={(row) => ({
            style: getJobOrderRowStyle(getClientType(row)),
          })}
        />
      </Stack>
    </PageCard>
  );
}
