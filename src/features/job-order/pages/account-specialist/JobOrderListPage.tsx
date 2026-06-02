import {
  Divider,
  Stack,
  Table,
  Menu,
  ActionIcon,
  Text,
  Group,
  Button,
  Center,
  Loader,
} from "@mantine/core";
import {
  MoreVert,
  ChevronRight,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import type { JobOrderServiceType } from "../../types/jobOrder";
import { JOCell } from "./components/JOCell";
import { getJobOrderRowStyle } from "./components/JobOrderTableRow";
import { DetailsCell } from "./components/DetailsCell";
import { ServiceInformationCell } from "./components/ServiceInformationCell";
import { PersonInChargeCell } from "./components/PersonInChargeCell";
import { StatusCell } from "./components/StatusCell";
import { JobOrderFilterClient } from "./components/JobOrderFilterClient";
import { JobOrderFilterTable } from "./components/JobOrderFilterTable";
import { ShowEntriesControl } from "./components/ShowEntriesControl";
import { PageCard } from "@/components/PageCard";
import { fetchJobOrders } from "../../api/jobOrder.api";
import { jobOrdersQueryKeys } from "../../api/jobOrdersQueryKeys";
import { mapJobOrderResponses } from "../../utils/jobOrderListMapper";
import { jobOrderRoutes } from "@/lib/jobOrder.routes";

export default function JobOrderListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function buildJoDetailPath(id: number | string) {
    return jobOrderRoutes.details(Number(id));
  }

  function buildClientDetailPath(id: number | string) {
    return jobOrderRoutes.clientDetails(Number(id));
  }

  // derive filter state from query params (source of truth)
  const activeTab =
    (searchParams.get("service") as "all" | "Logistics" | "Regulatory") ||
    "all";
  const search = searchParams.get("q") || "";
  const tradeType = searchParams.get("trade") || "";
  const personInCharge = searchParams.get("person") || "";
  const status = searchParams.get("status") || "";
  const perPage =
    parseInt(
      searchParams.get("per_page") || searchParams.get("perPage") || "10",
      10,
    ) || 10;
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    // reset page when filters change (except when explicitly setting page)
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  }

  const setPageParam = useCallback(
    (p: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(p));
        return next;
      });
    },
    [setSearchParams],
  );

  function mapServiceFilter(value: "all" | JobOrderServiceType) {
    if (value === "Logistics") return "LOGISTICS";
    if (value === "Regulatory") return "REGULATORY";
    return undefined;
  }

  function mapTradeTypeFilter(value: string) {
    if (value === "Import") return "IMPORT";
    if (value === "Export") return "EXPORT";
    return undefined;
  }

  function mapStatusFilter(value: string) {
    if (value === "Accepted") return "ACCEPTED";
    if (value === "Pending") return "PENDING";
    return undefined;
  }

  const listParams = {
    search: search || undefined,
    ops_search: personInCharge || undefined,
    "filter[service]": mapServiceFilter(activeTab),
    "filter[service_type]": mapTradeTypeFilter(tradeType),
    "filter[assignment_status]": mapStatusFilter(status),
    per_page: perPage,
    page,
  };

  const {
    data: jobOrdersResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: jobOrdersQueryKeys.list({
      search,
      service: activeTab,
      tradeType,
      status,
      personInCharge,
      perPage,
      page,
    }),
    queryFn: () => fetchJobOrders(listParams),
    staleTime: 30_000,
  });

  const jobOrders = mapJobOrderResponses(jobOrdersResponse?.job_orders ?? []);
  const pagination = jobOrdersResponse?.pagination;
  const totalPages = Math.max(1, pagination?.total_pages ?? 1);
  const pages = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  })();

  const counts = {
    all: jobOrdersResponse?.counts?.all_job_orders ?? 0,
    Logistics: jobOrdersResponse?.counts?.logistics_job_orders ?? 0,
    Regulatory: jobOrdersResponse?.counts?.regulatory_job_orders ?? 0,
  };

  const showingCount = pagination?.count ?? jobOrders.length;
  const totalCount = pagination?.total ?? jobOrders.length;
  const isTableLoading = isLoading || isFetching;

  useEffect(() => {
    if (pagination?.current_page && pagination.current_page !== page) {
      setPageParam(pagination.current_page);
    }
  }, [page, pagination?.current_page, setPageParam]);

  const tradeTypeOptions = [
    { value: "Import", label: "Import" },
    { value: "Export", label: "Export" },
  ];

  const statusOptions = [
    { value: "Accepted", label: "Accepted" },
    { value: "Pending", label: "Pending" },
  ];

  function handleReset() {
    setSearchParams({});
  }

  function handlePerPageChange(value: number) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("per_page", String(value));
    next.delete("perPage");
    next.set("page", "1");
    setSearchParams(next);
  }

  const perPageValue = pagination?.per_page ?? perPage;

  return (
    <PageCard title="PRE-ALERT">
      <Stack>
        <JobOrderFilterClient
          activeTab={activeTab}
          counts={counts}
          onTabChange={(tab) => setParam("service", tab === "all" ? "" : tab)}
        />
        <JobOrderFilterTable
          search={search}
          onSearchChange={(value: string) => setParam("q", value)}
          onSearch={() => setParam("q", search)}
          tradeType={tradeType}
          onTradeTypeChange={(value: string) => setParam("trade", value || "")}
          personInCharge={personInCharge}
          onPersonInChargeChange={(value: string) =>
            setParam("person", value || "")
          }
          status={status}
          onStatusChange={(value: string) => setParam("status", value || "")}
          onReset={handleReset}
          tradeTypeOptions={tradeTypeOptions}
          statusOptions={statusOptions}
        />
        <Divider />
        <ShowEntriesControl
          perPage={perPageValue}
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
              <Table.Th style={{ width: "16.25rem" }}>PRE-ALERT</Table.Th>
              <Table.Th style={{ width: "20rem" }}>DETAILS</Table.Th>
              <Table.Th style={{ width: "14rem" }}>
                SERVICE INFORMATION
              </Table.Th>
              <Table.Th style={{ width: "12.5rem" }}>PERSON IN CHARGE</Table.Th>
              <Table.Th style={{ width: "11.25rem" }}>STATUS</Table.Th>
              <Table.Th style={{ width: "3rem" }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isTableLoading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Center py="xl">
                    <Group gap="xs">
                      <Loader size="sm" />
                      <Text size="sm" c="dimmed">
                        Loading job orders...
                      </Text>
                    </Group>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : jobOrders.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" py="xl" c="dimmed" size="sm">
                    No job orders found.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              jobOrders.map((row) => (
                <Table.Tr
                  key={row.id}
                  style={{
                    ...getJobOrderRowStyle(row.service as JobOrderServiceType),
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(buildClientDetailPath(row.id))}
                >
                  <Table.Td>
                    <JOCell item={row} detailPath={buildJoDetailPath(row.id)} />
                  </Table.Td>
                  <Table.Td>
                    <DetailsCell item={row} />
                  </Table.Td>
                  <Table.Td>
                    <ServiceInformationCell
                      showDashOnly={row.service === "Regulatory"}
                      serviceLevel={row.logistics_service?.service_level}
                      eta={row.logistics_service?.eta}
                      etd={row.logistics_service?.etd}
                      transportMode={row.logistics_service?.transport_mode}
                    />
                  </Table.Td>
                  <Table.Td>
                    <PersonInChargeCell person={row.person_in_charge} />
                  </Table.Td>
                  <Table.Td>
                    <StatusCell
                      status={row.status}
                      dateAccepted={
                        row.status === "Accepted" ? row.created_at : undefined
                      }
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
                        <Menu.Item style={{ fontSize: "0.75rem" }} disabled>
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
            Showing {showingCount} out of {totalCount} entries
          </Text>
          <Group gap="0.25rem">
            <Button
              variant="outline"
              size="xs"
              onClick={() => page > 1 && setPageParam(page - 1)}
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
                    setPageParam(currentPage)
                  }
                >
                  {currentPage}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="xs"
              onClick={() => page < totalPages && setPageParam(page + 1)}
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
