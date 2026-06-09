import { ActionIcon, Box, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconEdit } from "@tabler/icons-react";
import { LabeledTextareaSection } from "@/components/LabeledTextareaSection";
import type { TermsValues } from "@/features/quotations/schemas/compose.schema";
import type { StandardTemplate } from "@/features/quotations/types/compose.types";

interface TermsViewerProps {
  template: StandardTemplate;
  initialValues?: TermsValues | null;
  onChange: (values: TermsValues) => void;
}

type TermsTextFieldKey = Exclude<
  keyof TermsValues,
  "template_id" | "template_name"
>;

const TERMS_TEXT_FIELDS: Array<{ key: TermsTextFieldKey; label: string }> = [
  { key: "policies", label: "Policies" },
  { key: "terms_and_condition", label: "Terms and Condition" },
  { key: "banking_details", label: "Banking Details" },
  { key: "footer", label: "Footer" },
];

function buildInitialTermsValues(
  template: StandardTemplate,
  initialValues?: TermsValues | null,
): TermsValues {
  const values: TermsValues = {
    template_id: template.id,
    template_name: template.name,
  };

  TERMS_TEXT_FIELDS.forEach(({ key }) => {
    values[key] = initialValues?.[key] ?? template[key];
  });

  return values;
}

export function TermsViewer({
  template,
  initialValues,
  onChange,
}: TermsViewerProps) {
  const [editableFields, setEditableFields] = useState<
    Record<TermsTextFieldKey, boolean>
  >({
    policies: false,
    terms_and_condition: false,
    banking_details: false,
    footer: false,
  });
  const [values, setValues] = useState<TermsValues>(() =>
    buildInitialTermsValues(template, initialValues),
  );

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  function updateValue(field: TermsTextFieldKey, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function enableEditing(field: TermsTextFieldKey) {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  }

  return (
    <Stack gap="sm" mt="md">
      <Paper withBorder radius="sm" mb="sm">
        <Box px="md" py="xs" bg="gray.1">
          <Text size="sm" fw={600} tt="uppercase">
            Template Name
          </Text>
        </Box>
        <Box px="md" py="sm">
          <Text size="sm">{template.name}</Text>
        </Box>
      </Paper>

      {TERMS_TEXT_FIELDS.map(({ key, label }) => (
        <LabeledTextareaSection
          key={key}
          label={label}
          value={values[key] ?? ""}
          onChange={(nextValue) => updateValue(key, nextValue)}
          mode={editableFields[key] ? "edit" : "readonly"}
          action={
            <Tooltip label="Enable editing" withArrow>
              <ActionIcon
                variant="subtle"
                color="jltAccent.6"
                aria-label={`Enable editing for ${label}`}
                onClick={() => enableEditing(key)}
                disabled={editableFields[key]}
              >
                <IconEdit size="1rem" />
              </ActionIcon>
            </Tooltip>
          }
        />
      ))}
    </Stack>
  );
}
