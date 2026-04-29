import {
  ActionIcon,
  Badge,
  Box,
  Checkbox,
  Divider,
  Group,
  MultiSelect,
  Paper,
  Stack,
  Text,
  TextInput,
  Skeleton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  Add,
  Delete,
  Save,
} from "@nine-thirty-five/material-symbols-react/rounded";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { AppButton } from "@/components/ui/AppButton";
import type {
  QuotationTemplateChargeResource,
  QuotationTemplateResource,
  ServiceType,
  StoreTemplateRequest,
  UpdateTemplateRequest,
} from "@/types/templates";
import { billingConfigsService } from "../api/billing-configs.service";
import { ConfigPageHeader } from "../components/ConfigPageHeader";
import { detailsConfigsService } from "../api/details-configs.service";
import { quotationFieldsService } from "../api/quotation-fields.service";
import { templatesService } from "../api/templates.service";
import { toolsQueryKeys } from "../config/queryKeys";

type TemplateChargeDraft = {
  key: number;
  id?: number;
  name: string;
  receipt_option_ids: string[];
};

interface TemplateFormDraft {
  name: string;
  selectedDetailIds: number[];
  selectedFieldIds: number[];
  charges: TemplateChargeDraft[];
  nextChargeKey: number;
}

const INITIAL_CHARGE_KEY = 1;

const EMPTY_DRAFT: TemplateFormDraft = {
  name: "",
  selectedDetailIds: [],
  selectedFieldIds: [],
  charges: [{ key: INITIAL_CHARGE_KEY, name: "", receipt_option_ids: [] }],
  nextChargeKey: INITIAL_CHARGE_KEY + 1,
};

interface TemplateFormPageProps {
  mode: "create" | "edit";
  serviceType: ServiceType;
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  REGULATORY: "Regulatory Services",
  LOGISTICS: "Logistics Services",
};

const getChargeReceiptOptionIds = (
  charge: QuotationTemplateChargeResource,
): number[] => {
  const allowedCharges = charge.allowed_receipt_charges;
  const legacyCharges = charge.receipt_charge_options;

  return (allowedCharges ?? legacyCharges ?? []).map((option) => option.id);
};

export function TemplateFormPage({ mode, serviceType }: TemplateFormPageProps) {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const queryClient = useQueryClient();
  const isEditMode = mode === "edit";

  const [draft, setDraft] = useState<TemplateFormDraft | null>(null);

  const { data: detailsResponse, isFetching: isDetailsFetching } = useQuery({
    queryKey: toolsQueryKeys.detailsConfigs,
    queryFn: () => detailsConfigsService.getDetailsConfigs(),
  });

  const { data: billingResponse, isFetching: isBillingFetching } = useQuery({
    queryKey: toolsQueryKeys.billingConfigs,
    queryFn: () => billingConfigsService.getBillingConfigs(),
  });

  const { data: templateResponse, isFetching: isTemplateFetching } = useQuery({
    queryKey: toolsQueryKeys.template(templateId),
    queryFn: () => templatesService.getTemplate(Number(templateId)),
    enabled: isEditMode && Boolean(templateId),
  });

  const resolvedServiceType = isEditMode
    ? (templateResponse?.data?.service_type ?? serviceType)
    : serviceType;

  const { data: fieldsResponse, isFetching: isFieldsFetching } = useQuery({
    queryKey: toolsQueryKeys.quotationFields(resolvedServiceType),
    queryFn: () =>
      quotationFieldsService.getQuotationFields(resolvedServiceType),
  });

  const loadedDraft = useMemo<TemplateFormDraft | null>(() => {
    if (!isEditMode || !templateResponse?.data) {
      return null;
    }

    const template = templateResponse.data;
    const mappedCharges = (template.template_charges ?? []).map(
      (charge, index) => ({
        key: index + 1,
        id: charge.id,
        name: charge.name,
        receipt_option_ids: getChargeReceiptOptionIds(charge).map(String),
      }),
    );

    return {
      name: template.name,
      selectedDetailIds:
        template.detail_configs?.map((detail) => detail.id) ?? [],
      selectedFieldIds:
        template.quotation_fields?.map((field) => field.id) ?? [],
      charges:
        mappedCharges.length > 0
          ? mappedCharges
          : [{ key: INITIAL_CHARGE_KEY, name: "", receipt_option_ids: [] }],
      nextChargeKey: (mappedCharges.length || INITIAL_CHARGE_KEY) + 1,
    };
  }, [isEditMode, templateResponse?.data]);

  const form = draft ?? loadedDraft ?? EMPTY_DRAFT;

  const updateForm = (
    updater: (current: TemplateFormDraft) => TemplateFormDraft,
  ) => {
    setDraft((currentDraft) =>
      updater(currentDraft ?? loadedDraft ?? EMPTY_DRAFT),
    );
  };

  const createMutation = useMutation({
    mutationFn: (payload: StoreTemplateRequest) =>
      templatesService.createTemplate(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.templates });

      const previousTemplates = queryClient.getQueryData(
        toolsQueryKeys.templates,
      );
      const optimisticTemplate: QuotationTemplateResource = {
        id: Date.now(),
        name: payload.name,
        service_type: payload.service_type,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData(
        toolsQueryKeys.templates,
        (current: { data?: QuotationTemplateResource[] } | undefined) => ({
          ...current,
          data: [...(current?.data ?? []), optimisticTemplate],
        }),
      );

      return { previousTemplates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.templates });
      notifications.show({
        title: "Success",
        message: "Template created successfully",
        color: "teal",
      });
      navigate("/tools/templates");
    },
    onError: (_error, _payload, context) => {
      queryClient.setQueryData(
        toolsQueryKeys.templates,
        context?.previousTemplates,
      );
      notifications.show({
        title: "Error",
        message: "Failed to create template",
        color: "red",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateTemplateRequest) =>
      templatesService.updateTemplate(Number(templateId), payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: toolsQueryKeys.templates });
      await queryClient.cancelQueries({
        queryKey: toolsQueryKeys.template(templateId),
      });

      const previousTemplates = queryClient.getQueryData(
        toolsQueryKeys.templates,
      );
      const previousTemplate = queryClient.getQueryData(
        toolsQueryKeys.template(templateId),
      );

      queryClient.setQueryData(
        toolsQueryKeys.templates,
        (current: { data?: QuotationTemplateResource[] } | undefined) => ({
          ...current,
          data: (current?.data ?? []).map((template) =>
            template.id === Number(templateId)
              ? { ...template, name: payload.name }
              : template,
          ),
        }),
      );

      return { previousTemplates, previousTemplate };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsQueryKeys.templates });
      queryClient.invalidateQueries({
        queryKey: toolsQueryKeys.template(templateId),
      });
      notifications.show({
        title: "Success",
        message: "Template updated successfully",
        color: "teal",
      });
      navigate("/tools/templates");
    },
    onError: (_error, _payload, context) => {
      queryClient.setQueryData(
        toolsQueryKeys.templates,
        context?.previousTemplates,
      );
      queryClient.setQueryData(
        toolsQueryKeys.template(templateId),
        context?.previousTemplate,
      );
      notifications.show({
        title: "Error",
        message: "Failed to update template",
        color: "red",
      });
    },
  });

  const detailConfigs = useMemo(
    () => [
      ...(detailsResponse?.data?.DROPDOWN ?? []),
      ...(detailsResponse?.data?.["DATE PICKER"] ?? []),
      ...(detailsResponse?.data?.TEXT ?? []),
    ],
    [detailsResponse?.data],
  );

  const receiptOptions = useMemo(
    () =>
      (billingResponse?.data?.["RECEIPT CHARGES"] ?? []).map((option) => ({
        value: String(option.id),
        label: option.label,
      })),
    [billingResponse?.data],
  );

  const quotationFields = useMemo(
    () => fieldsResponse?.data ?? [],
    [fieldsResponse?.data],
  );

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const isInitialLoading =
    isDetailsFetching ||
    isBillingFetching ||
    isFieldsFetching ||
    (isEditMode && isTemplateFetching);
  const modeLabel = isEditMode ? "Editing" : "Creating";

  const canSave =
    form.name.trim().length > 0 &&
    form.selectedDetailIds.length > 0 &&
    form.selectedFieldIds.length > 0 &&
    form.charges.length > 0 &&
    form.charges.every(
      (charge) =>
        charge.name.trim().length > 0 && charge.receipt_option_ids.length > 0,
    );

  const handleDetailToggle = (id: number, checked: boolean) => {
    updateForm((current) => ({
      ...current,
      selectedDetailIds: checked
        ? [...current.selectedDetailIds, id]
        : current.selectedDetailIds.filter((itemId) => itemId !== id),
    }));
  };

  const handleFieldToggle = (id: number, checked: boolean) => {
    updateForm((current) => ({
      ...current,
      selectedFieldIds: checked
        ? [...current.selectedFieldIds, id]
        : current.selectedFieldIds.filter((itemId) => itemId !== id),
    }));
  };

  const handleAddCharge = () => {
    updateForm((current) => ({
      ...current,
      charges: [
        ...current.charges,
        { key: current.nextChargeKey, name: "", receipt_option_ids: [] },
      ],
      nextChargeKey: current.nextChargeKey + 1,
    }));
  };

  const handleChargeChange = (
    key: number,
    updates: Partial<Pick<TemplateChargeDraft, "name" | "receipt_option_ids">>,
  ) => {
    updateForm((current) => ({
      ...current,
      charges: current.charges.map((charge) =>
        charge.key === key ? { ...charge, ...updates } : charge,
      ),
    }));
  };

  const handleDeleteCharge = (key: number) => {
    updateForm((current) => ({
      ...current,
      charges: current.charges.filter((charge) => charge.key !== key),
    }));
  };

  const handleSave = () => {
    const payload: StoreTemplateRequest | UpdateTemplateRequest = {
      name: form.name.trim(),
      service_type: resolvedServiceType,
      detail_config_ids: form.selectedDetailIds,
      quotation_field_ids: form.selectedFieldIds,
      template_charges: form.charges.map((charge) => ({
        id: charge.id,
        name: charge.name.trim(),
        receipt_option_ids: charge.receipt_option_ids.map(Number),
      })),
    };

    if (isEditMode) {
      updateMutation.mutate(payload);
      return;
    }

    createMutation.mutate(payload);
  };

  return (
    <Stack
      gap="sm"
      style={{
        height:
          "calc(100dvh - var(--app-shell-header-height) - var(--mantine-spacing-md) * 2)",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <ConfigPageHeader title="TEMPLATE FORM" />

      <Group
        gap="xs"
        style={{
          marginTop: "calc(var(--mantine-spacing-md) * -1)",
        }}
      >
        <Badge variant="light" color="jltBlue.8" radius="sm">
          {modeLabel}
        </Badge>
        <Badge variant="outline" color="gray.7" radius="sm">
          {SERVICE_LABELS[resolvedServiceType]}
        </Badge>
      </Group>

      <Group justify="space-between" align="center">
        <TextInput
          value={form.name}
          onChange={(event) => {
            const nextName = event.currentTarget.value;
            updateForm((current) => ({ ...current, name: nextName }));
          }}
          placeholder="TEMPLATE NAME"
          maw={520}
          style={{ flex: 1 }}
          disabled={isInitialLoading || isSaving}
        />
        <AppButton
          onClick={handleSave}
          disabled={!canSave || isInitialLoading}
          loading={isSaving}
          icon={Save}
          w="10rem"
          h="2.6rem"
        >
          SAVE
        </AppButton>
      </Group>

      <Group
        align="stretch"
        grow
        wrap="nowrap"
        style={{ flex: 1, minHeight: 0 }}
      >
        <Box
          style={{
            minWidth: 0,
            flex: 1,
            minHeight: 0,
            display: "grid",
            overflow: "hidden",
          }}
        >
          <PageCard
            title="Quotation Details"
            hideBackButton
            showDivider
            bodyPx="md"
            bodyPy="md"
          >
            {isInitialLoading ? (
              <Stack gap="sm">
                <Skeleton height={18} width="40%" />
                <Skeleton height={14} />
                <Skeleton height={14} />
                <Skeleton height={18} width="55%" mt="md" />
                <Skeleton height={14} />
                <Skeleton height={14} />
              </Stack>
            ) : (
              <Stack gap="md">
                <Box>
                  <Text size="sm" fw={600} mb="xs">
                    Detail Configurations
                  </Text>
                  <Stack gap={6}>
                    {detailConfigs.map((config) => (
                      <Checkbox
                        key={config.id}
                        label={config.label}
                        checked={form.selectedDetailIds.includes(config.id)}
                        onChange={(event) =>
                          handleDetailToggle(
                            config.id,
                            event.currentTarget.checked,
                          )
                        }
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Text size="sm" fw={600} mb="xs">
                    From Client Inputs/Information
                  </Text>
                  <Stack gap={6}>
                    {quotationFields.map((field) => (
                      <Checkbox
                        key={field.id}
                        label={field.display_name}
                        checked={form.selectedFieldIds.includes(field.id)}
                        onChange={(event) =>
                          handleFieldToggle(
                            field.id,
                            event.currentTarget.checked,
                          )
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )}
          </PageCard>
        </Box>

        <Box
          style={{
            minWidth: 0,
            flex: 1,
            minHeight: 0,
            display: "grid",
            overflow: "hidden",
          }}
        >
          <PageCard
            title="Billing Details"
            hideBackButton
            showDivider
            action={
              <ActionIcon
                color="jltAccent.6"
                onClick={handleAddCharge}
                disabled={isInitialLoading || isSaving}
              >
                <Add />
              </ActionIcon>
            }
            bodyPx="md"
            bodyPy="md"
          >
            {isInitialLoading ? (
              <Stack gap="sm">
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </Stack>
            ) : (
              <Stack gap="sm">
                {form.charges.map((charge, index) => (
                  <Paper
                    key={charge.key}
                    p="sm"
                    radius="md"
                    withBorder
                    bg="var(--mantine-color-gray-0)"
                  >
                    <Stack gap="xs">
                      <Group justify="space-between" align="center">
                        <Text size="sm" fw={600} c="jltBlue.8">
                          Charge Section {index + 1}
                        </Text>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteCharge(charge.key)}
                          disabled={form.charges.length === 1}
                        >
                          <Delete />
                        </ActionIcon>
                      </Group>

                      <Stack style={{ flex: 1 }} gap={8}>
                        <Text size="xs" c="dimmed" fw={500}>
                          Table Name
                        </Text>
                        <TextInput
                          placeholder="TABLE NAME"
                          value={charge.name}
                          onChange={(event) =>
                            handleChargeChange(charge.key, {
                              name: event.currentTarget.value,
                            })
                          }
                        />

                        <Text size="xs" c="dimmed" fw={500} mt={4}>
                          Receipt Charges
                        </Text>
                        <MultiSelect
                          placeholder="SELECT RECEIPT CHARGES"
                          data={receiptOptions}
                          value={charge.receipt_option_ids}
                          onChange={(value) =>
                            handleChargeChange(charge.key, {
                              receipt_option_ids: value,
                            })
                          }
                          searchable
                        />
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </PageCard>
        </Box>
      </Group>
    </Stack>
  );
}
