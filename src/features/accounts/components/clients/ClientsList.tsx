// src/features/accounts/components/clients/ClientsList.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { PageCard } from "@/components/PageCard";
import type { AccountListItem } from "../../types/accounts.types";
import { Group, Text, Stack, Button } from "@mantine/core";
import { ChevronRight } from "@nine-thirty-five/material-symbols-react/rounded";
import { accountsService } from "../../services/accounts.service";
import { ClientsStatus } from "./ClientsStatus";
import { ClientsFilters } from "./ClientsFilters";
import { ClientsTable } from "./ClientsTable";

export function ClientsList() {
  const navigate = useNavigate();
  const { category, subCategory } = useParams();
  const tab = category || "clients";

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateCreated, setDateCreated] = useState<string | null>(null);
  const [clientType, setClientType] = useState("ALL");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (perPage === 0 && page > 1) {
      setPage(1);
    }
  }, [perPage, page]);

  const status = subCategory ?? "all";

  const { data, isLoading } = useQuery({
    queryKey: ["accounts", "clients", status, searchQuery, perPage, dateCreated, clientType, page],
    queryFn: () => {
      const currentPage = perPage === 0 ? 1 : page;
      return accountsService.getClientAccountsList(currentPage, perPage, {
        search: searchQuery,
        type: clientType === "ALL" ? undefined : clientType,
        dateCreated: dateCreated ?? undefined,
      });
    },
    retry: false,
  });

  // Destructure the service return
  const clients = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const getProfilePath = (rowId: number) =>
    subCategory ? `/accounts/${tab}/${subCategory}/${rowId}` : `/accounts/${tab}/${rowId}/${rowId}`;

  return (
    <Stack gap="xl">
      <ClientsStatus />

      <PageCard>
        <ClientsFilters
          searchValue={search}
          onSearchChange={setSearch}
          onSearch={setSearchQuery}
          dateCreatedValue={dateCreated}
          onDateCreatedChange={setDateCreated}
          clientTypeValue={clientType}
          onClientTypeChange={setClientType}
          onReset={() => {
            setSearch("");
            setSearchQuery("");
            setDateCreated(null);
            setClientType("ALL");
            setPage(1);
          }}
          perPage={perPage}
          setPerPage={setPerPage}
        />

        <ClientsTable
          data={clients}
          isLoading={isLoading}
          perPage={perPage}
          setPerPage={setPerPage}
          total={total}
          onRowClick={(row: AccountListItem) => navigate(getProfilePath(row.id))}
          getProfilePath={getProfilePath}
        />

        {/* Footer below the table */}
        <Group justify="space-between" align="center" mt="0.75rem">
          <Text size="0.75rem" c="dimmed">
            Showing {clients.length} out of {total} entries
          </Text>

          <Group gap="0.25rem">
            {/* Previous button */}
            <Button
              variant="outline"
              size="xs"
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
              leftSection={<ChevronRight width={14} style={{ transform: "rotate(180deg)" }} />}
            >
              Previous
            </Button>

            {/* Page numbers with ellipsis */}
            {Array.from({ length: totalPages }).map((_, index) => {
              const currentPage = index + 1;

              if (currentPage === 1 || currentPage === totalPages) {
                return (
                  <Button
                    key={currentPage}
                    variant={currentPage === page ? "filled" : "default"}
                    size="xs"
                    onClick={() => setPage(currentPage)}
                  >
                    {currentPage}
                  </Button>
                );
              }

              if (currentPage >= page - 2 && currentPage <= page + 2) {
                return (
                  <Button
                    key={currentPage}
                    variant={currentPage === page ? "filled" : "default"}
                    size="xs"
                    onClick={() => setPage(currentPage)}
                  >
                    {currentPage}
                  </Button>
                );
              }

              if (
                (currentPage === 2 && page > 4) ||
                (currentPage === totalPages - 1 && page < totalPages - 3)
              ) {
                return (
                  <Text key={`ellipsis-${index}`} size="0.75rem" c="dimmed">
                    …
                  </Text>
                );
              }

              return null;
            })}

            {/* Next button */}
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
      </PageCard>
    </Stack>
  );
}
