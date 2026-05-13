import { useMemo, useState } from "react";
import { ActionIcon, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Add } from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import { toolsQueryKeys } from "../config/queryKeys";
import { DetailsConfigModal } from "../components/DetailsConfigModal";
import { ConfigLayout } from "../components/ConfigLayout";
import { ConfigPageHeader } from "../components/ConfigPageHeader";
import { ConfigRowsTable } from "../components/ConfigRowsTable";
import {
  type DetailConfigOption,
  type DetailConfigResource,
  type DetailConfigType,
} from "../api/details-configs.service";
import { detailsConfigsService } from "../api/details-configs.service";
import { useDetailsConfigMutations } from "../hooks/useDetailsConfigMutations";
import { toolNotifications } from "../utils/toolNotifications";

interface OptionDraft {
  id?: number;
  name: string;
}

export function DetailsConfigurationPage() {
  const [activeType, setActiveType] = useState<DetailConfigType | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [label, setLabel] = useState("");
  const [options, setOptions] = useState<OptionDraft[]>([{ name: "" }]);

  const {
    createMutation,
    updateMutation,
    deleteMutation,
    detailsByIdMutation,
  } = useDetailsConfigMutations();

  const { data: detailsResponse, isLoading: isDetailsLoading } = useQuery({
    queryKey: toolsQueryKeys.detailsConfigs,
    queryFn: () => detailsConfigsService.getDetailsConfigs(),
  });

  const grouped = useMemo(
    () => detailsResponse?.data ?? {},
    [detailsResponse?.data],
  );

  const groupedRows = useMemo(
    () => ({
      DROPDOWN: grouped.DROPDOWN ?? [],
      TEXT: grouped.TEXT ?? [],
      "DATE PICKER": grouped["DATE PICKER"] ?? [],
    }),
    [grouped],
  );

  const openCreateModal = (type: DetailConfigType) => {
    setEditingId(null);
    setActiveType(type);
    setLabel("");
    setOptions([{ name: "" }]);
  };

  const openEditModal = async (item: DetailConfigResource) => {
    setEditingId(item.id);
    setActiveType(item.type);

    const fallbackOptions = getDropdownOptions(item).map((opt) => ({
      id: opt.id,
      name: opt.name,
    }));

    setLabel(item.label);
    setOptions(fallbackOptions.length > 0 ? fallbackOptions : [{ name: "" }]);

    try {
      const response = await detailsByIdMutation.mutateAsync(item.id);
      setLabel(response.data.label);
      const resolvedOptions = getDropdownOptions(response.data).map((opt) => ({
        id: opt.id,
        name: opt.name,
      }));
      setOptions(resolvedOptions.length > 0 ? resolvedOptions : [{ name: "" }]);
    } catch {
      toolNotifications.error("Failed to load configuration details");
    }
  };

  const handleDelete = (item: DetailConfigResource) => {
    const confirmed = window.confirm(`Delete "${item.label}"?`);
    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(item.id);
  };

  const handleCloseModal = () => {
    setEditingId(null);
    setActiveType(null);
    setLabel("");
    setOptions([{ name: "" }]);
  };

  const isDropdown = activeType === "DROPDOWN";
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleSave = () => {
    if (!activeType || !label.trim()) {
      return;
    }

    if (editingId) {
      updateMutation.mutate(
        {
          id: editingId,
          payload: {
            label: label.trim(),
            ...(isDropdown
              ? {
                  options: options
                    .map((option) => ({
                      ...(option.id ? { id: option.id } : {}),
                      name: option.name.trim(),
                    }))
                    .filter((option) => option.name),
                }
              : {}),
          },
        },
        { onSuccess: handleCloseModal },
      );
      return;
    }

    createMutation.mutate(
      {
        label: label.trim(),
        type: activeType,
        ...(isDropdown
          ? {
              options: options
                .map((option) => ({ name: option.name.trim() }))
                .filter((option) => option.name),
            }
          : {}),
      },
      { onSuccess: handleCloseModal },
    );
  };

  const updateOption = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((option, idx) =>
        idx === index ? { ...option, name: value } : option,
      ),
    );
  };

  const addOption = () => {
    setOptions((prev) => [...prev, { name: "" }]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>
      <ConfigPageHeader title="DETAILS CONFIGURATION" />
      <ConfigLayout
        left={
          <PageCard
            title="DROPDOWN"
            bodyPx="md"
            bodyPy="sm"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("DROPDOWN")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows.DROPDOWN}
              emptyLabel="dropdown"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isDetailsLoading}
              isMutating={isMutating}
              renderMeta={(item) =>
                item.type === "DROPDOWN" ? (
                  <Text component="span" w={120} c="dimmed" fs="italic" ml="sm">
                    ({item.count ?? getDropdownOptions(item).length} Options)
                  </Text>
                ) : null
              }
            />
          </PageCard>
        }
        rightTop={
          <PageCard
            title="TEXT FIELD"
            bodyPx="md"
            bodyPy="sm"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("TEXT")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows.TEXT}
              emptyLabel="text field"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isDetailsLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
        rightBottom={
          <PageCard
            title="DATE PICKER"
            bodyPx="md"
            bodyPy="sm"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("DATE PICKER")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows["DATE PICKER"]}
              emptyLabel="date picker"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isDetailsLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
      />

      <DetailsConfigModal
        opened={Boolean(activeType)}
        title={activeType ?? "Add Field"}
        label={label}
        options={options}
        isDropdown={isDropdown}
        isSubmitting={
          createMutation.isPending ||
          updateMutation.isPending ||
          detailsByIdMutation.isPending
        }
        onClose={handleCloseModal}
        onLabelChange={setLabel}
        onOptionChange={updateOption}
        onAddOption={addOption}
        onRemoveOption={removeOption}
        onSubmit={handleSave}
      />
    </>
  );
}

function getDropdownOptions(item: DetailConfigResource): DetailConfigOption[] {
  return item.dropdown_options ?? item.dropdownOptions ?? [];
}
