import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Box, Stack, Flex, Pagination } from "@mantine/core";

import { PageCard } from "@/components/PageCard";
import { useQuotationTableSearch } from "@/features/quotations/hooks/useQuotationTableSearch";
import { fetchRespondedQuotations } from "@/features/quotations/api/quotations.api";
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
  const [statusFilter, setStatusFilter] = useState<string>("ALL STATUS");   
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: respondedQueryKeys.list({
      searchQuery,
      clientFilter,
      serviceFilter,
      statusFilter,
      dateFilter,
      perPage,
      jobFilter,
      currentPage,
    }),
    queryFn: () => {
      const params: any = {
        "filter[status]": "RESPONDED",
        search: searchQuery || undefined,
        "filter[service]": serviceFilter === "ALL SERVICES" ? undefined : serviceFilter,
        "filter[created_at]": dateFilter || undefined,
        client_type: clientFilter === "ALL" ? undefined : clientFilter,
        perPage,
        page: currentPage,
      };
      if (statusFilter !== "ALL STATUS") {
        params["filter[status]"] = statusFilter;
      }
      return fetchRespondedQuotations(params);
    },
  });

  const rows = data?.quotations ?? [];
  const myRows = data?.my_quotations ?? [];
  const total = data?.pagination.total ?? 0;
  const count = data?.pagination.count ?? rows.length;

  const handleReset = () => {
    setClientSearchValue("");
    setDateFilter("");
    setServiceFilter("ALL SERVICES");
    setStatusFilter("ALL STATUS");
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
          p="sm"
          style={{
            borderRadius: "0.75rem",
            border: "none",
          }}
        >
          <RespondedFilterTable
            searchValue={clientSearchValue}
            onSearchChange={setClientSearchValue}
            onSearch={handleSearch}
            dateValue={dateFilter}
            onDateChange={(dateString: string) => setDateFilter(dateString)}
            serviceValue={serviceFilter}
            onServiceChange={setServiceFilter}
            statusValue={statusFilter}                 
            onStatusChange={setStatusFilter}           
            onReset={handleReset}
            perPage={perPage}
            setPerPage={setPerPage}
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
