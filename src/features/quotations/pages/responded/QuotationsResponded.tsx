import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Box, Stack, Flex, Pagination } from "@mantine/core";

import { PageCard } from "@/components/PageCard";
import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import { fetchQuotations } from "@/features/quotations/api/quotations.api";
import { respondedQueryKeys } from "./utils/respondedQueryKeys";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";

import { RespondedFilterClient } from "./components/RespondedFilterClient";
import { RespondedFilterTable } from "./components/RespondedFilterTable";
import { RespondedTable } from "./components/RespondedTable";

export function QuotationsResponded() {
  const navigate = useNavigate();

  const {
    search,
    searchQuery,
    perPage,
    setPerPage,
    handleSearch,
  } = useQuotationTableSearch();

  // Filter states
  const [jobFilter, setJobFilter] = useState<"all" | "my-items">("all");
  const [clientFilter, setClientFilter] = useState<"ALL" | "NEW" | "OLD">("ALL");
  const [clientSearchValue, setClientSearchValue] = useState(search);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL SERVICES");
  const [personInChargeFilter, setPersonInChargeFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: respondedQueryKeys.list({
      searchQuery,
      clientFilter,
      serviceFilter,
      dateFilter,
      personInChargeFilter,
      perPage,
      jobFilter,
      currentPage,
    }),
    queryFn: () =>
      fetchQuotations({
        "filter[status]": "RESPONDED",
        search: searchQuery || undefined,
        "filter[service]": serviceFilter === "ALL SERVICES" ? undefined : serviceFilter,
        "filter[created_at]": dateFilter || undefined,
        "filter[as_full_name]": personInChargeFilter || undefined,
        client_type: clientFilter === "ALL" ? undefined : clientFilter,
        perPage,
        page: currentPage,
      }),
  });

  const rows = data?.quotations ?? [];
  const myRows = data?.my_quotations ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? rows.length;

  const handleReset = () => {
    setClientSearchValue("");
    setDateFilter("");
    setServiceFilter("ALL SERVICES");
    setPersonInChargeFilter("");
    handleSearch("");
    setCurrentPage(1);
  };

  const handleJobSwitchChange = (value: "all" | "my-items") => {
    setJobFilter(value);
  };

  const handleRowClick = (quotationId: string) => {
    navigate(
      quotationRoutes.details({
        tab: "responded",
        quotationId,
      }),
    );
  };

  return (
    <PageCard
      title="LIST OF RESPONDED"
      showJobSwitch
      jobSwitchValue={jobFilter}
      onJobSwitchChange={handleJobSwitchChange}
    >
      <Stack gap="xs">
        <RespondedFilterClient
          clientFilter={clientFilter}
          setClientFilter={setClientFilter}
          clientCounts={data?.counts}
        />

        <Box
          p="xs"
          style={{
            borderRadius: "0.75rem",
            border: "none",
            backgroundColor: "transparent",
          }}
        >
          <RespondedFilterTable
            searchValue={clientSearchValue}
            onSearchChange={setClientSearchValue}
            onSearch={handleSearch}
            dateValue={dateFilter}
            onDateChange={(dateString) => setDateFilter(dateString)}
            serviceValue={serviceFilter}
            onServiceChange={setServiceFilter}
            personInChargeValue={personInChargeFilter}
            onPersonInChargeChange={setPersonInChargeFilter}
            onReset={handleReset}
            perPage={perPage}
            setPerPage={setPerPage}
            total={total}
          />

          <RespondedTable
            rows={jobFilter === "all" ? rows : myRows}
            isLoading={isLoading || isFetching}
            total={total}
            showingCount={count}
            onRowClick={handleRowClick}
          />
        </Box>

        <Flex justify="flex-end" align="center" mt="md">
          {Math.ceil(total / perPage) > 1 && (
            <Pagination
              value={currentPage}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              total={Math.ceil(total / perPage)}
              size="sm"
            />
          )}
        </Flex>
      </Stack>
    </PageCard>
  );
}
