// src/features/accounts/components/clients/ClientsTable.tsx
import { Avatar, Box, Group, Text, Menu, ActionIcon, Center, useMantineTheme } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { InboxTextPerson, Sms, ToggleOff, ToggleOn, Edit as MaterialEdit } from "@nine-thirty-five/material-symbols-react/outlined";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { stripedRowProps } from "@/components/stripedRow";
import type { AccountListItem } from "../../types/accounts.types";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsService } from "../../services/accounts.service";

interface ClientsTableProps {
  data: AccountListItem[];
  isLoading: boolean;
  perPage: number;
  setPerPage: (value: number) => void;
  total: number;
  onRowClick: (row: AccountListItem) => void;
  getProfilePath: (rowId: number) => string;
}

export function ClientsTable({
  data,
  isLoading,
  perPage,
  setPerPage,
  total,
  onRowClick,
  getProfilePath,
}: ClientsTableProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useMantineTheme();

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => accountsService.deactivateAccount(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accounts", "clients"] }),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: number) => accountsService.archiveAccount(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["accounts", "clients"] }),
  });

  const COLUMNS: AppTableColumn<AccountListItem>[] = [
    {
      key: "clientId",
      label: "CLIENT ID",
      width: "8%",
      render: (row) => {
        return `${row.id}`;
      },
    },
    {
      key: "name",
      label: "CLIENT NAME",
      width: "18%",
      render: (row) => (
        <Group>
          <Avatar src={row.avatarUrl ?? undefined} radius="xl" size="md" />
          <Text fw={500} size="sm">
            {row.client?.clientName ?? row.name}
          </Text>
        </Group>
      ),
    },
    { key: "companyName", label: "COMPANY NAME", width: "16%", render: (row) => row.client?.companyName ?? "—" },
    { key: "email", label: "EMAIL", width: "12%", render: (row) => row.email },
    { key: "contactNumber", label: "CONTACT NUMBER", width: "11%", render: (row) => row.contactNumber },
    {
      key: "type",
      label: "TYPE",
      width: "7%",
      render: (row) => {
        const rawType = row.client?.type ?? null;
        const type = rawType ? String(rawType).toUpperCase() : "—";
        const isNew = type === "NEW";
        const isOld = type === "OLD";

        return (
          <Box
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 64,
              padding: "0.25rem 0.5rem",
              borderRadius: theme.radius.lg,
              backgroundColor: isNew ? "#DEEEE9" : isOld ? theme.colors.gray[2] : theme.colors.gray[2],
              color: isNew ? "#54B99B" : theme.colors.gray[7],
              fontWeight: 600,
              fontSize: theme.fontSizes.xs as unknown as string,
            }}
          >
            {type}
          </Box>
        );
      },
    },
    { key: "pendingQuotations", label: "PENDING QUOTATIONS", width: "7%", render: (row) => row.client?.pendingQuotations ?? "—" },
    { key: "activeShipment", label: "ACTIVE SHIPMENT", width: "7%", render: (row) => row.client?.activeShipment ?? "—" },
    { key: "activeRegulatory", label: "ACTIVE REGULATORY", width: "7%", render: (row) => row.client?.activeRegulatory ?? "—" },
    {
      key: "action",
      label: "ACTION",
      width: "6%",
      render: (row) => (
        <Center>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => navigate(getProfilePath(row.id))}>
                <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                  <InboxTextPerson width={20} style={{ color: "#1D274E" }} />
                  <Text>View Details</Text>
                </Group>
              </Menu.Item>

              <Menu.Item onClick={() => console.log("Message Client", row)}>
                <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                  <Sms width={20} style={{ color: "#1D274E" }} />
                  <Text>Message Client</Text>
                </Group>
              </Menu.Item>

              {(() => {
                const isDeactivated = row.status?.state !== "ACTIVE";
                return (
                  <Menu.Item onClick={() => deactivateMutation.mutate(row.id)}>
                    <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                      {isDeactivated ? (
                        <ToggleOn width={20} style={{ color: "#007406" }} />
                      ) : (
                        <ToggleOff width={20} style={{ color: "#1D274E" }} />
                      )}
                      <Text style={{ color: isDeactivated ? "red" : undefined }}>
                        Deactivate Client
                      </Text>
                    </Group>
                  </Menu.Item>
                );
              })()}

              <Menu.Item onClick={() => console.log("Edit Client", row)}>
                <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                  <MaterialEdit width={20} style={{ color: "#1D274E" }} />
                  <Text>Edit Client</Text>
                </Group>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Center>
      ),
    },
  ];

  return (
    <AppTable
      columns={COLUMNS}
      data={isLoading ? [] : data}
      rowKey={(row) => row.id.toString()}
      perPage={perPage}
      onPerPageChange={setPerPage}
      total={total}
      showingCount={data.length}
      getRowProps={(row, idx) =>
        stripedRowProps(idx, {
          onClick: () => onRowClick(row),
          style: { cursor: "pointer" },
        })
      }
    />
  );
}
