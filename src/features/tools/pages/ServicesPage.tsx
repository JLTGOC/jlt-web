import { useNavigate } from "react-router";
import { useState } from "react";
import { Center, Loader, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { PageCard } from "@/components/PageCard";
import {
  SERVICE_TYPES,
  type ServiceTypeItem,
} from "@/features/tools/config/servicesConfig";
import { toolsQueryKeys } from "@/features/tools/config/queryKeys";

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
  const { data: serviceTypes = [], isLoading: isServiceTypesLoading } =
    useQuery({
      queryKey: toolsQueryKeys.serviceTypes,
      queryFn: async () => SERVICE_TYPES,
      staleTime: Infinity,
    });

  const searchTerm = search.trim().toLowerCase();
  const filteredServices = searchTerm
    ? SERVICE_TYPES.filter((service) =>
        service.name.toLowerCase().includes(searchTerm),
      )
    : SERVICE_TYPES;
  const paginatedServices = filteredServices.slice(0, perPage);

  return (
    <PageCard title="List of Services" showDivider>
      {isServiceTypesLoading ? (
        <Center py="4rem">
          <Stack align="center" gap="xs">
            <Loader size="sm" />
            <Text size="sm" c="dimmed">
              Loading services...
            </Text>
          </Stack>
        </Center>
      ) : (
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
      )}
    </PageCard>
  );
}
