import { Avatar, Button, Center, Group, Menu, Text, ActionIcon } from "@mantine/core";
import { ChevronRight, InboxTextPerson, RequestQuote, Sms, ChangeCircle, Key, ToggleOff } from "@nine-thirty-five/material-symbols-react/outlined";
import { IconDotsVertical } from "@tabler/icons-react";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import type { AccountListItem } from "../../../types/accounts.types";

interface AccountSpecialistsTableProps {
  rows: AccountListItem[];
  isLoading: boolean;
  total: number;
  perPage: number;
  page: number;
  setPage: (page: number) => void;
  onPerPageChange: (value: number) => void;
  onRowClick?: (row: AccountListItem) => void;
}

function formatLastActivityDate(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

export function getRoleLabel(role?: string) {
  if (role === "Account Specialist") return "Regular";
  if (role === "Lead Account Specialist") return "Lead";
  return role ?? "—";
}

const COLUMNS: AppTableColumn<AccountListItem>[] = [
  { key: "employeeId", label: "EMPLOYEE ID", width: "6%", render: (row) => row.id },
  {
    key: "employeeName",
    label: "EMPLOYEE NAME",
    width: "24%",
    render: (row) => (
      <Group align="center">
        <Avatar src={row.avatarUrl ?? undefined} radius="xl" size="md" />
        <Text
          fw={500}
          lineClamp={1}
          size="sm"
          style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}
        >
          {row.name}
        </Text>
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
        <Text c="gray" size="xs">{formatLastActivityDate(row.status.lastSeen)}</Text>
      ),
  },
  { key: "role", label: "ROLE", width: "7%", render: (row) => getRoleLabel(row.employee?.role) },
  {
    key: "",
    label: "",
    width: "3%",
    render: (row) => (
      <Center>
        <Menu shadow="md" width={240}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => console.log("View Details", row)}>
              <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                <InboxTextPerson width={18} height={18} style={{ color: "#1D274E" }} />
                <Text>View Details</Text>
              </Group>
            </Menu.Item>
            <Menu.Item onClick={() => console.log("Quotation Sent", row)}>
              <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                <RequestQuote width={18} height={18} style={{ color: "#1D274E" }} />
                <Text>Quotation Sent</Text>
              </Group>
            </Menu.Item>
            <Menu.Item onClick={() => console.log("Quotation Accepted", row)}>
              <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                <RequestQuote width={18} height={18} style={{ color: "#1D274E" }} />
                <Text>Quotation Accepted</Text>
              </Group>
            </Menu.Item>
            <Menu.Divider style={{ borderColor: "#E2E6EB" }} />
            <Menu.Item onClick={() => console.log("Message Employee", row)}>
              <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                <Sms width={18} height={18} style={{ color: "#1D274E" }} />
                <Text>Message Employee</Text>
              </Group>
            </Menu.Item>
            <Menu.Item onClick={() => console.log("Change Role", row)}>
              <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                <ChangeCircle width={18} height={18} style={{ color: "#1D274E" }} />
                <Text>Change Role</Text>
              </Group>
            </Menu.Item>
            <Menu.Item onClick={() => console.log("Deactivate Account", row)}>
              <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                <ToggleOff width={18} height={18} style={{ color: "#1D274E" }} />
                <Text>Deactive Account</Text>
              </Group>
            </Menu.Item>
            <Menu.Item onClick={() => console.log("Reset Password", row)}>
              <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                <Key width={18} height={18} style={{ color: "#1D274E" }} />
                <Text>Reset Password</Text>
              </Group>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Center>
    ),
  },
];

export function AccountSpecialistsTable({
  rows,
  isLoading,
  total,
  perPage,
  page,
  setPage,
  onPerPageChange,
  onRowClick,
}: AccountSpecialistsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <>
      <AppTable
        columns={COLUMNS}
        data={isLoading ? [] : rows}
        rowKey={(row) => row.id.toString()}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        total={total}
        showingCount={rows.length}
        onRowClick={onRowClick}
      />

      <Group justify="space-between" align="center" mt="0.75rem">
        <Text size="0.75rem" c="dimmed">
          Showing {rows.length} out of {total} entries
        </Text>

        <Group gap="0.25rem">
          <Button
            variant="outline"
            size="xs"
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            leftSection={<ChevronRight width={14} style={{ transform: "rotate(180deg)" }} />}
          >
            Previous
          </Button>

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

            if ((currentPage === 2 && page > 4) || (currentPage === totalPages - 1 && page < totalPages - 3)) {
              return (
                <Text key={`ellipsis-${index}`} size="0.75rem" c="dimmed">
                  …
                </Text>
              );
            }

            return null;
          })}

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
    </>
  );
}
