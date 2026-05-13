import { useMemo, useState } from "react";
import { ActionIcon } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Add } from "@nine-thirty-five/material-symbols-react/rounded";
import { PageCard } from "@/components/PageCard";
import { toolsQueryKeys } from "../config/queryKeys";
import { ConfigLabelModal } from "../components/ConfigLabelModal";
import { ConfigLayout } from "../components/ConfigLayout";
import { ConfigPageHeader } from "../components/ConfigPageHeader";
import { ConfigRowsTable } from "../components/ConfigRowsTable";
import {
  type BillingConfigResource,
  type BillingConfigType,
} from "../api/billing-configs.service";
import { billingConfigsService } from "../api/billing-configs.service";
import { useBillingConfigMutations } from "../hooks/useBillingConfigMutations";

export function BillingConfigurationPage() {
  const [activeType, setActiveType] = useState<BillingConfigType | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [label, setLabel] = useState("");

  const { createMutation, updateMutation, deleteMutation } =
    useBillingConfigMutations();

  const { data: billingResponse, isLoading: isBillingLoading } = useQuery({
    queryKey: toolsQueryKeys.billingConfigs,
    queryFn: () => billingConfigsService.getBillingConfigs(),
  });

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const grouped = useMemo(
    () => billingResponse?.data ?? {},
    [billingResponse?.data],
  );

  const groupedRows = useMemo(
    () => ({
      "RECEIPT CHARGES": grouped["RECEIPT CHARGES"] ?? [],
      CURRENCY: grouped.CURRENCY ?? [],
      UOM: grouped.UOM ?? [],
    }),
    [grouped],
  );

  const openCreateModal = (type: BillingConfigType) => {
    setEditingId(null);
    setActiveType(type);
    setLabel("");
  };

  const openEditModal = (item: BillingConfigResource) => {
    setEditingId(item.id);
    setActiveType(item.type);
    setLabel(item.label);
  };

  const handleDelete = (item: BillingConfigResource) => {
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
  };

  const handleSave = () => {
    if (!activeType || !label.trim()) {
      return;
    }

    if (editingId) {
      updateMutation.mutate(
        {
          id: editingId,
          payload: { label: label.trim() },
        },
        { onSuccess: handleCloseModal },
      );
      return;
    }

    createMutation.mutate(
      {
        label: label.trim(),
        type: activeType,
      },
      { onSuccess: handleCloseModal },
    );
  };

  // Helper to get display names for types
  const getTypeDisplay = (type: BillingConfigType | null) => {
    switch (type) {
      case "RECEIPT CHARGES":
        return "Receipt Charge";
      case "CURRENCY":
        return "Currency";
      case "UOM":
        return "Unit of Measure";
      default:
        return "Field";
    }
  };

  // Modal title and label
  const modalTitle = editingId
    ? `Edit ${getTypeDisplay(activeType)}`
    : `Add ${getTypeDisplay(activeType)}`;
  const inputLabel = `${getTypeDisplay(activeType)} Label`;

  return (
    <>
      <ConfigPageHeader title="BILLING CONFIGURATION" />
      <ConfigLayout
        left={
          <PageCard
            title="LIST OF RECEIPT CHARGES"
            bodyPx="md"
            bodyPy="sm"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("RECEIPT CHARGES")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows["RECEIPT CHARGES"]}
              emptyLabel="receipt charges"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isBillingLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
        rightTop={
          <PageCard
            title="LIST OF CURRENCY"
            bodyPx="md"
            bodyPy="sm"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("CURRENCY")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows.CURRENCY}
              emptyLabel="currency"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isBillingLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
        rightBottom={
          <PageCard
            title="LIST OF UOM"
            bodyPx="md"
            bodyPy="sm"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={() => openCreateModal("UOM")}
                disabled={isMutating}
              >
                <Add />
              </ActionIcon>
            }
          >
            <ConfigRowsTable
              rows={groupedRows.UOM}
              emptyLabel="uom"
              onEdit={openEditModal}
              onDelete={handleDelete}
              isLoading={isBillingLoading}
              isMutating={isMutating}
            />
          </PageCard>
        }
      />

      <ConfigLabelModal
        opened={Boolean(activeType)}
        title={activeType ? modalTitle : "Add Field"}
        label={inputLabel}
        value={label}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={handleCloseModal}
        onChange={setLabel}
        onSubmit={handleSave}
      />
    </>
  );
}
