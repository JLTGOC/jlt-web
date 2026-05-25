import { useMemo, useState } from "react";
import {
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Add } from "@nine-thirty-five/material-symbols-react/rounded";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { AppTable, type AppTableColumn } from "@/components/AppTable";
import { PageCard } from "@/components/PageCard";
import { ToolModal } from "@/features/tools/components/ToolModal";
import {
  subServicesService,
  type SubServiceResource,
  type SubServiceStatus,
} from "@/features/tools/api/sub-services.service";
import { toolsQueryKeys } from "@/features/tools/config/queryKeys";
import { SERVICE_TYPES } from "@/features/tools/config/servicesConfig";
import { useSubServiceMutations } from "../hooks/useSubServiceMutations";
import { toolNotifications } from "../utils/toolNotifications";

const columns: AppTableColumn<SubServiceResource>[] = [
  {
    key: "name",
    label: "SERVICE NAME",
    render: (row) => row.name,
  },
];

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function SubServicesPage() {
  const navigate = useNavigate();
  const { serviceType } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [editingItem, setEditingItem] = useState<SubServiceResource | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);

  const selectedService = useMemo(
    () => SERVICE_TYPES.find((item) => item.key === serviceType),
    [serviceType],
  );

  const queryKey = toolsQueryKeys.subServices(selectedService?.name);

  const {
    data: subServicesResponse,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn: () => subServicesService.getSubServices(selectedService!.name),
    enabled: Boolean(selectedService),
  });

  const { createMutation, updateMutation, deleteMutation } =
    useSubServiceMutations(queryKey);

  const rows = useMemo(
    () => subServicesResponse?.data ?? [],
    [subServicesResponse?.data],
  );
  const filteredRows = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return rows;
    }

    return rows.filter((row) => row.name.toLowerCase().includes(searchTerm));
  }, [rows, search]);

  const paginatedRows = useMemo(
    () => filteredRows.slice(0, perPage),
    [filteredRows, perPage],
  );

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setDraftName("");
  };

  const openAddModal = () => {
    setEditingItem(null);
    setDraftName("");
    setModalOpen(true);
  };

  const openEditModal = (row: SubServiceResource) => {
    setEditingItem(row);
    setDraftName(row.name);
    setModalOpen(true);
  };

  const handleDelete = (row: SubServiceResource) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${row.name}"?`,
    );
    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(row.id);
  };

  const handleToggle = (row: SubServiceResource, checked: boolean) => {
    const nextStatus: SubServiceStatus = checked ? "ENABLED" : "DISABLED";

    updateMutation.mutate({
      id: row.id,
      payload: { status: nextStatus },
    });
  };

  const handleSave = () => {
    if (!selectedService) {
      return;
    }

    const normalizedName = normalizeName(draftName);
    if (!normalizedName) {
      toolNotifications.warning("Sub-service name is required");
      return;
    }

    if (editingItem) {
      updateMutation.mutate(
        {
          id: editingItem.id,
          payload: { name: normalizedName },
        },
        { onSuccess: closeModal },
      );
      return;
    }

    createMutation.mutate(
      {
        name: normalizedName,
        service_type_id: selectedService.id,
        service_type: selectedService.name,
      },
      { onSuccess: closeModal },
    );
  };

  if (!selectedService) {
    return (
      <PageCard
        title="List of Sub-Services"
        showDivider
        onBack={() => navigate("/tools/services")}
      >
        Invalid service type.
      </PageCard>
    );
  }

  return (
    <>
      <PageCard
        title="List of Sub-Services"
        subtext={selectedService.name}
        showDivider
        action={
          <Button
            leftSection={<Add />}
            onClick={openAddModal}
            color="jltAccent.6"
            h="2.4375rem"
            tt={"uppercase"}
            disabled={isMutating}
          >
            Sub-Service
          </Button>
        }
      >
        {isLoading ? (
          <Center py="4rem">
            <Stack align="center" gap="xs">
              <Loader size="sm" />
              <Text size="sm" c="dimmed">
                Loading sub-services...
              </Text>
            </Stack>
          </Center>
        ) : (
          <>
            <AppTable
              columns={columns}
              data={paginatedRows}
              rowKey={(row) => row.id}
              withNumbering={{ label: "NO" }}
              withEntryControls
              perPage={perPage}
              onPerPageChange={setPerPage}
              total={filteredRows.length}
              showingCount={paginatedRows.length}
              searchPlaceholder="SEARCH SUB-SERVICE NAME"
              searchValue={search}
              onSearchChange={setSearch}
              withToggle={{
                label: "",
                getValue: (row) => row.status === "ENABLED",
                onChange: handleToggle,
                disabled: () => isMutating,
              }}
              withEdit={{
                onClick: openEditModal,
                disabled: () => isMutating,
                tooltip: "Edit sub-service",
              }}
              withDelete={{
                onClick: handleDelete,
                disabled: () => isMutating,
                tooltip: "Delete sub-service",
              }}
            />
            {isFetching ? (
              <Text size="xs" c="dimmed" mt="xs">
                Refreshing sub-services...
              </Text>
            ) : null}
          </>
        )}
      </PageCard>

      <ToolModal
        opened={modalOpen}
        onClose={closeModal}
        title={editingItem ? "Edit Sub-Service" : "Add Sub-Service"}
      >
        <TextInput
          label="Sub-Service Name"
          value={draftName}
          onChange={(event) => setDraftName(event.currentTarget.value)}
          placeholder="Enter sub-service name"
          disabled={isMutating}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeModal} disabled={isMutating}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={isMutating} color="jltAccent.6">
            {editingItem ? "Save Changes" : "Create Sub-Service"}
          </Button>
        </Group>
      </ToolModal>
    </>
  );
}
