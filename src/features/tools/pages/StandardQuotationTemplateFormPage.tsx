import { Box, Paper, Stack, Text, TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Save } from "@nine-thirty-five/material-symbols-react/rounded";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LabeledTextareaSection } from "@/components/LabeledTextareaSection";
import { PageCard } from "@/components/PageCard";
import { AppButton } from "@/components/ui/AppButton";
import { useStandardTemplateFormMutations } from "../hooks/useStandardTemplateFormMutations";
import {
  standardTemplatesService,
  type StoreStandardTemplateRequest,
} from "../api/standard-templates.service";

interface StandardQuotationTemplateFormPageProps {
  mode: "create" | "edit";
}

type FormFieldKey =
  | "policies"
  | "terms_and_conditions"
  | "banking_details"
  | "footer";

const FORM_FIELDS: Array<{ key: FormFieldKey; label: string }> = [
  { key: "policies", label: "Policies" },
  { key: "terms_and_conditions", label: "Terms and Condition" },
  { key: "banking_details", label: "Banking Details" },
  { key: "footer", label: "Footer" },
];

const EMPTY_FORM: StoreStandardTemplateRequest = {
  template_name: "",
  policies: "",
  terms_and_conditions: "",
  banking_details: "",
  footer: "",
};

const MAX_TEXT_LENGTH = 255;

export function StandardQuotationTemplateFormPage({
  mode,
}: StandardQuotationTemplateFormPageProps) {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const isEditMode = mode === "edit";

  const [draftValues, setDraftValues] =
    useState<StoreStandardTemplateRequest | null>(null);

  const { data: templateResponse, isLoading: isTemplateLoading } = useQuery({
    queryKey: toolsQueryKeys.standardTemplate(templateId),
    queryFn: () =>
      standardTemplatesService.getStandardTemplate(Number(templateId)),
    enabled: isEditMode && Boolean(templateId),
  });

  const loadedValues: StoreStandardTemplateRequest | null =
    templateResponse?.data
      ? {
          template_name: templateResponse.data.template_name,
          policies: templateResponse.data.policies,
          terms_and_conditions: templateResponse.data.terms_and_conditions,
          banking_details: templateResponse.data.banking_details,
          footer: templateResponse.data.footer,
        }
      : null;

  const values = draftValues ?? loadedValues ?? EMPTY_FORM;

  const { createMutation, updateMutation } =
    useStandardTemplateFormMutations(templateId);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const title =
    mode === "create"
      ? "Create Standard Quotation Template"
      : "Edit Standard Quotation Template";

  const canSave = useMemo(
    () =>
      values.template_name.trim() &&
      values.policies.trim() &&
      values.terms_and_conditions.trim() &&
      values.banking_details.trim() &&
      values.footer.trim() &&
      values.template_name.length <= MAX_TEXT_LENGTH &&
      values.footer.length <= MAX_TEXT_LENGTH,
    [values],
  );

  const updateField = <T extends keyof StoreStandardTemplateRequest>(
    field: T,
    value: StoreStandardTemplateRequest[T],
  ) => {
    setDraftValues((prev) => ({ ...(prev ?? values), [field]: value }));
  };

  const handleSave = () => {
    const payload: StoreStandardTemplateRequest = {
      template_name: values.template_name.trim(),
      policies: values.policies.trim(),
      terms_and_conditions: values.terms_and_conditions.trim(),
      banking_details: values.banking_details.trim(),
      footer: values.footer.trim(),
    };

    if (isEditMode) {
      updateMutation.mutate(payload, {
        onSuccess: () =>
          navigate("/tools/templates/config/standard-quotation-template"),
      });
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () =>
        navigate("/tools/templates/config/standard-quotation-template"),
    });
  };

  return (
    <PageCard title={title} fullHeight showDivider>
      <Stack gap="sm" mt="md">
        <Paper withBorder radius="sm" mb="sm">
          <Box px="md" py="xs" bg="gray.1">
            <Text size="sm" fw={600} tt="uppercase">
              Template Name
            </Text>
          </Box>
          <Box px="md" py="sm">
            <TextInput
              value={values.template_name}
              onChange={(event) =>
                updateField("template_name", event.currentTarget.value)
              }
              placeholder="Enter template name"
              disabled={isTemplateLoading || isSaving}
              maxLength={MAX_TEXT_LENGTH}
              styles={{ input: { border: 0, background: "transparent" } }}
            />
            <Text size="xs" c="dimmed" ta="right" mt={4}>
              {values.template_name.length}/{MAX_TEXT_LENGTH}
            </Text>
          </Box>
        </Paper>

        {FORM_FIELDS.map(({ key, label }) => (
          <Box key={key}>
            <LabeledTextareaSection
              label={label}
              value={values[key]}
              onChange={(nextValue) => updateField(key, nextValue)}
              mode="edit"
              maxLength={key === "footer" ? MAX_TEXT_LENGTH : undefined}
            />
            {key === "footer" && (
              <Text size="xs" c="dimmed" ta="right" mt={-42} mr={16} mb="sm">
                {values.footer.length}/{MAX_TEXT_LENGTH}
              </Text>
            )}
          </Box>
        ))}

        <AppButton
          onClick={handleSave}
          loading={isSaving}
          disabled={!canSave || isTemplateLoading}
          icon={Save}
          w="9rem"
          h="2.625rem"
          style={{ alignSelf: "center", marginTop: "0.25rem" }}
        >
          SAVE
        </AppButton>
      </Stack>
    </PageCard>
  );
}
