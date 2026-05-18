// src/features/accounts/components/clients/ClientsTable.tsx
import { Avatar, Group, Text, Menu, ActionIcon, Center } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
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
      width: "15%",
      render: (row) => (
        <Group>
          <Avatar src={row.avatarUrl ?? undefined} radius="xl" size="md" />
          <Text fw={500} size="sm">
            {row.name}
          </Text>
        </Group>
      ),
    },
    { key: "name", label: "CLIENT NAME", width: "15%", render: (row) => row.clientName },
    { key: "companyName", label: "COMPANY NAME", width: "15%", render: (row) => row.companyName ?? "—" },
    { key: "email", label: "EMAIL", width: "12%", render: (row) => row.email },
    { key: "contactNumber", label: "CONTACT NUMBER", width: "12%", render: (row) => row.contactNumber },
    { key: "type", label: "TYPE", width: "8%", render: (row) => row.type },
    { key: "pendingQuotations", label: "PENDING QUOTATIONS", width: "6%", render: (row) => row.pendingQuotations },
    { key: "activeShipment", label: "ACTIVE SHIPMENT", width: "6%", render: (row) => row.activeShipment ?? "—" },
    { key: "activeRegulatory", label: "ACTIVE REGULATORY", width: "6%", render: (row) => row.activeRegulatory ?? "—" },
    {
      key: "action",
      label: "ACTION",
      width: "6%",
      render: (row) => (
        <Center>
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => navigate(getProfilePath(row.id))}>See Profile</Menu.Item>
              <Menu.Item color="orange" onClick={() => deactivateMutation.mutate(row.id)}>Deactivate Account</Menu.Item>
              <Menu.Item color="red" onClick={() => archiveMutation.mutate(row.id)}>Archive Account</Menu.Item>
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
      onRowClick={onRowClick}
    />
  );
}
