import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import type { AccountListItem, AccountDashboardStats } from "../../../types/accounts.types";
import { accountsService } from "../../../services/accounts.service";
import { Box, Text } from "@mantine/core";
import { AccountSpecialistsFilters } from "./AccountSpecialistsFilters.tsx";
import { AccountSpecialistsSummary } from "./AccountSpecialistsSummary.tsx";
import { AccountSpecialistsTable } from "./AccountSpecialistsTable.tsx";
import { useQuery } from "@tanstack/react-query";

export function AccountSpecialistsEmployees() {
  const navigate = useNavigate();
  const { category } = useParams();
  const tab = category || "employees";

  const [searchValue, setSearchValue] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [dateCreatedValue, setDateCreatedValue] = useState<string | null>(null);
  const [roleValue, setRoleValue] = useState("ALL");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCommittedSearch(value);
    setPage(1);
  };

  const { data, isLoading, error } = useQuery<{
    data: AccountListItem[];
    total: number;
    totalPages: number;
  }>(
    {
      queryKey: ["accounts", "employees", "account-specialists", page, perPage, committedSearch, dateCreatedValue, roleValue],
      queryFn: () => {
        const params = {
          page,
          perPage,
          "filter[search]": committedSearch || undefined,
          "filter[role]": roleValue === "ALL" ? undefined : roleValue,
          "filter[date_created]": dateCreatedValue || undefined,
        };

        console.log("AccountSpecialists search params:", params);

        return accountsService.getAccountSpecialistsList(page, perPage, {
          "filter[search]": committedSearch || undefined,
          "filter[role]": roleValue === "ALL" ? undefined : roleValue,
          "filter[date_created]": dateCreatedValue || undefined,
        });
      },
      retry: false,
    },
  );

  const handleReset = () => {
    setSearchValue("");
    setCommittedSearch("");
    setDateCreatedValue(null);
    setRoleValue("ALL");
    setPage(1);
    setPerPage(10);
  };

  const handleSetPerPage = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRoleValue(value);
    setPage(1);
  };

  const {
    data: stats,
    error: statsError,
  } = useQuery({
    queryKey: ["accounts", "employees", "dashboard"],
    queryFn: () => accountsService.getAccountDashboardStats(),
    retry: false,
  });

  const total = data?.total ?? 0;

  const dashboardStats: AccountDashboardStats = stats ?? {
    totalEmployees: 0,
    activeShipments: 0,
    activeRegulatory: 0,
    pendingQuotations: 0,
  };

  return (
    <Box>
      <AccountSpecialistsSummary stats={dashboardStats} />

      <PageCard>
        <AccountSpecialistsFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearch={handleSearch}
          roleValue={roleValue}
          onRoleChange={handleRoleChange}
          onReset={handleReset}
          perPage={perPage}
          setPerPage={handleSetPerPage}
        />

        {error ? (
          <Text c="red" mb="md">
            Unable to load account specialists. {error.message}
          </Text>
        ) : null}

        {statsError ? (
          <Text c="red" mb="md">
            Unable to load summary stats. {statsError.message}
          </Text>
        ) : null}

        <AccountSpecialistsTable
          rows={data?.data ?? []}
          isLoading={isLoading}
          total={total}
          perPage={perPage}
          page={page}
          setPage={setPage}
          onPerPageChange={handleSetPerPage}
          onRowClick={(row) => navigate(`/accounts/${tab}/${row.id}`)}
        />
      </PageCard>
    </Box>
  );
}
