// src/features/accounts/components/employees/AccountSpecialistsEmployees.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import type { AccountListItem, AccountDashboardStats } from "../../types/accounts.types";
import { accountsService } from "../../services/accounts.service";
import {
  Avatar,
  Group,
  Text,
  Menu,
  ActionIcon,
  Center,
  Box,
  Stack,
  SimpleGrid,
  Button,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  Group as GroupIcon,
  GroupAdd,
  Box as BoxIcon,
  License,
  RequestQuote,
  ChevronRight,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { AccountSpecialistsFilters } from "./AccountSpecialistsFilters";
import { useQuery } from "@tanstack/react-query";

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDay}d ago`;
}

export function AccountSpecialistsEmployees() {
  const navigate = useNavigate();
  const { category } = useParams();
  const tab = category || "employees";

  // Filter states
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateCreated, setDateCreated] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [perPage, setPerPage] = useState(10);
  
  const [page, setPage] = useState(1);        // current page
  const [totalPages, setTotalPages] = useState(1); // total pages

  const [employees, setEmployees] = useState<AccountListItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Example: pass filters to service
    accountsService.getAccountsList(1, perPage).then((data) => {
      // Later you can filter by searchQuery, dateCreated, roleFilter here
      setEmployees(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    });
  }, [perPage, searchQuery, dateCreated, roleFilter]);

  const handleReset = () => {
    setSearch("");
    setSearchQuery("");
    setDateCreated(null);
    setRoleFilter("ALL");
    setPerPage(10);
  };

    // Fetch dashboard stats from API
  const { data: stats } = useQuery({
    queryKey: ["accounts", "employees", "dashboard"],
    queryFn: () => accountsService.getAccountDashboardStats(),
  });

  const dashboardStats: AccountDashboardStats = stats ?? {
    totalEmployees: 0,
    activeShipments: 0,
    activeRegulatory: 0,
    pendingQuotations: 0,
  };

  const COLUMNS: AppTableColumn<AccountListItem>[] = [
    { key: "employeeId", label: "EMPLOYEE ID", width: "15%", render: (row) => row.id },
    {
      key: "employeeName",
      label: "EMPLOYEE NAME",
      width: "15%",
      render: (row) => (
        <Group>
          <Avatar src={row.avatarUrl ?? undefined} radius="xl" size="md" />
          <Text fw={500} lineClamp={1} size="sm">{row.name}</Text>
        </Group>
      ),
    },
    { key: "email", label: "EMAIL", width: "12%", render: (row) => row.email },
    { key: "contactNumber", label: "CONTACT NUMBER", width: "12%", render: (row) => row.contactNumber },
    { key: "requestAccepted", label: "REQUEST ACCEPTED", width: "6%", render: (row) => row.employee?.requestAccepted ?? "—" },
    { key: "quotationSent", label: "QUOTATION SENT", width: "6%", render: (row) => row.employee?.quotationSent ?? "—" },
    { key: "quotationAccepted", label: "QT ACCEPTED BY CLIENT", width: "6%", render: (row) => row.employee?.quotationAccepted ?? "—" },
    {
      key: "lastActivity",
      label: "LAST ACTIVITY",
      width: "10%",
      render: (row) =>
        row.status.state === "ACTIVE" ? (
          <Text c="green" size="xs" fw={800}>Active</Text>
        ) : (
          <Text c="gray" size="xs">Off ({formatRelativeTime(row.status.lastSeen)})</Text>
        ),
    },
    { key: "role", label: "ROLE", width: "7%", render: (row) => row.employee?.role ?? "—" },
    {
      key: "",
      label: "",
      width: "3%",
      render: () => (
        <Center>
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item color="orange">Deactivate</Menu.Item>
              <Menu.Item color="red">Archive</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Center>
      ),
    },
  ];

  return (
    <Box>
      <SimpleGrid cols={4} spacing="1.5rem" mb="1rem">
        {/* Total Employees */}
        <Box style={{ background: "#fff", borderRadius: "0.5rem", padding: "1rem", border: "1px solid #e2e6eb" }}>
          <Group align="center" gap="md" ml="0.5rem">
            <Avatar size={60} radius="xl" style={{ backgroundColor: "#dfefff" }}>
              <GroupIcon width={36} height={36} style={{ color: "#0963E3" }} />
            </Avatar>
            <Stack gap="0rem">
              <Text fw={500} size="sm">Total Employees</Text>
              <Text fz="1.5rem" fw={600} c="#17314B">{dashboardStats.totalEmployees}</Text>
              <Text size="xs" c="dimmed" mt="-0.3rem">All registered employees</Text>
            </Stack>
          </Group>
        </Box>

        {/* Active Shipments */}
        <Box style={{ background: "#fff", borderRadius: "0.5rem", padding: "1rem", border: "1px solid #e2e6eb" }}>
          <Group align="center" gap="md" ml="0.5rem">
            <Avatar size={60} radius="xl" style={{ backgroundColor: "#fff2d0" }}>
              <BoxIcon width={36} height={36} style={{ color: "#F5940A" }} />
            </Avatar>
            <Stack gap="0rem">
              <Text fw={500} size="sm">Active Shipments</Text>
              <Text fz="1.5rem" fw={600} c="#17314B">{dashboardStats.activeShipments}</Text>
              <Text size="xs" c="dimmed" mt="-0.3rem">In progress</Text>
            </Stack>
          </Group>
        </Box>

        {/* Active Regulatory */}
        <Box style={{ background: "#fff", borderRadius: "0.5rem", padding: "1rem", border: "1px solid #e2e6eb" }}>
          <Group align="center" gap="md" ml="0.5rem">
            <Avatar size={60} radius="xl" style={{ backgroundColor: "#eafdff" }}>
              <License width={36} height={36} style={{ color: "#27A2AF" }} />
            </Avatar>
            <Stack gap="0rem">
              <Text fw={500} size="sm">Active Regulatory</Text>
              <Text fz="1.5rem" fw={600} c="#17314B">{dashboardStats.activeRegulatory}</Text>
              <Text size="xs" c="dimmed" mt="-0.3rem">Total active regulatory</Text>
            </Stack>
          </Group>
        </Box>

        {/* Pending Quotations */}
        <Box style={{ background: "#fff", borderRadius: "0.5rem", padding: "1rem", border: "1px solid #e2e6eb" }}>
          <Group align="center" gap="md" ml="0.5rem">
            <Avatar size={60} radius="xl" style={{ backgroundColor: "#f5f0ff" }}>
              <RequestQuote width={36} height={36} style={{ color: "#6D37C7" }} />
            </Avatar>
            <Stack gap="0rem">
              <Text fw={500} size="sm">Pending Quotations</Text>
              <Text fz="1.5rem" fw={600} c="#17314B">{dashboardStats.pendingQuotations}</Text>
              <Text size="xs" c="dimmed" mt="-0.3rem">Awaiting response</Text>
            </Stack>
          </Group>
        </Box>
      </SimpleGrid>

      <PageCard>
        {/* Filters bar */}
              <AccountSpecialistsFilters
                searchValue={search}
                onSearchChange={setSearch}
                onSearch={setSearchQuery}
                dateCreatedValue={dateCreated}
                onDateCreatedChange={setDateCreated}
                roleValue={roleFilter}
                onRoleChange={setRoleFilter}
                onReset={handleReset}
                perPage={perPage}
                setPerPage={setPerPage}
              />

        <AppTable
          columns={COLUMNS}
          data={employees}
          rowKey={(row) => row.id.toString()}
          perPage={perPage}
          onPerPageChange={setPerPage}
          total={total}
          showingCount={employees.length}
          onRowClick={(row) => navigate(`/accounts/${tab}/${row.id}`)}
        />

        {/* Footer */}
        <Group justify="space-between" align="center" mt="0.75rem">
          <Text size="0.75rem" c="dimmed">
            Showing {employees.length} out of {total} entries
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

              // Always show first and last page
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

              // Show pages near the current page
              if (
                currentPage >= page - 2 &&
                currentPage <= page + 2
              ) {
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

              // Show ellipsis at gaps
              if (
                currentPage === 2 && page > 4 ||
                currentPage === totalPages - 1 && page < totalPages - 3
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
    </Box>
  );
}
