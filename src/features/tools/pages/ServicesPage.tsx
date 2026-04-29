import { useNavigate } from "react-router";
import { useState } from "react";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { PageCard } from "@/components/PageCard";
import {
  SERVICE_TYPES,
  type ServiceTypeItem,
} from "@/features/tools/config/servicesConfig";

const columns: AppTableColumn<ServiceTypeItem>[] = [
  {
    key: "name",
    label: "SERVICE NAME",
    render: (row) => row.name,
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);

  const searchTerm = search.trim().toLowerCase();
  const filteredServices = searchTerm
    ? SERVICE_TYPES.filter((service) =>
        service.name.toLowerCase().includes(searchTerm),
      )
    : SERVICE_TYPES;
  const paginatedServices = filteredServices.slice(0, perPage);

  return (
    <PageCard title="List of Services" showDivider>
      <AppTable
        columns={columns}
        data={paginatedServices}
        rowKey={(row) => row.key}
        withNumbering={{ label: "NO" }}
        withEntryControls
        perPage={perPage}
        onPerPageChange={setPerPage}
        total={filteredServices.length}
        showingCount={paginatedServices.length}
        searchPlaceholder="SEARCH SERVICE NAME"
        searchValue={search}
        onSearchChange={setSearch}
        onRowClick={(row) => navigate(`/tools/services/${row.key}`)}
      />
    </PageCard>
  );
}
