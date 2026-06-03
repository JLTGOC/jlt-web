import { zodResolver } from "@hookform/resolvers/zod";
import { Group, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { TextInputField, TextareaField } from "@/components/form/textFields";
import { MessageTemplateSelect } from "@/features/quotations/pages/compose/components/MessageTemplateSelect";
import { QuotationCustomFieldsGrid } from "@/features/quotations/pages/compose/components/QuotationCustomFieldsGrid";
import { useComposeMessageTemplates } from "@/features/quotations/hooks/useComposeReferenceData";
import {
  quotationDetailsSchema,
  type QuotationDetailsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";
import {
  RATE_VALIDITY_FIELD,
  isRateValidityField,
} from "@/features/quotations/utils/quotationDetailFields";

interface QuotationDetailsFormProps {
  id: string;
  template: QuotationTemplate;
  defaultValues?: Partial<QuotationDetailsValues>;
  onSubmit: (values: QuotationDetailsValues) => void;
  onChange?: (values: QuotationDetailsValues) => void;
  onValidityChange?: (isValid: boolean) => void;
  readOnly?: boolean;
}

export function QuotationDetailsForm({
  id,
  template,
  defaultValues,
  onSubmit,
  onChange,
  onValidityChange,
  readOnly,
}: QuotationDetailsFormProps) {
  const lastReportedValuesRef = useRef("");
  const { data: messageTemplates = [] } = useComposeMessageTemplates();
  const [selectedMessageTemplateId, setSelectedMessageTemplateId] = useState<
    string | null
  >(null);

  const { control, handleSubmit, setValue, setError, clearErrors, formState } =
    useForm<QuotationDetailsValues>({
      resolver: zodResolver(quotationDetailsSchema),
      mode: "onChange",
      defaultValues: defaultValues ?? {},
    });
  const values = useWatch({ control });

  const requiredCustomFields = useMemo(
    () => [
      ...template.custom_fields.filter((field) => !isRateValidityField(field)),
      RATE_VALIDITY_FIELD,
    ],
    [template],
  );

  const hasRequiredFields = useMemo(() => {
    if (!values) {
      return false;
    }

    const hasSubject = Boolean(values.subject?.trim());
    const hasMessage = Boolean(values.message?.trim());

    if (!hasSubject || !hasMessage) {
      return false;
    }

    return requiredCustomFields.every((field) => {
      const value =
        field.id === RATE_VALIDITY_FIELD.id
          ? values.rate_validity
          : values.custom_fields?.[field.id];

      return Boolean(value?.trim());
    });
  }, [requiredCustomFields, values]);

  const isStep0Valid = formState.isValid && hasRequiredFields;

  useEffect(() => {
    onValidityChange?.(isStep0Valid);
  }, [isStep0Valid, onValidityChange]);

  useEffect(() => {
    if (!values) {
      return;
    }

    const resolvedPaths: FieldPath<QuotationDetailsValues>[] = [];

    if (values.subject?.trim()) {
      resolvedPaths.push("subject");
    }

    if (values.message?.trim()) {
      resolvedPaths.push("message");
    }

    requiredCustomFields.forEach((field) => {
      const value =
        field.id === RATE_VALIDITY_FIELD.id
          ? values.rate_validity
          : values.custom_fields?.[field.id];

      if (!value?.trim()) {
        return;
      }

      resolvedPaths.push(
        (field.id === RATE_VALIDITY_FIELD.id
          ? "rate_validity"
          : `custom_fields.${field.id}`) as FieldPath<QuotationDetailsValues>,
      );
    });

    const pathsWithErrors = resolvedPaths.filter((path) => {
      return path
        .split(".")
        .reduce<unknown>(
          (acc, segment) =>
            acc && typeof acc === "object"
              ? (acc as Record<string, unknown>)[segment]
              : undefined,
          formState.errors,
        );
    });

    if (pathsWithErrors.length > 0) {
      clearErrors(pathsWithErrors);
    }
  }, [clearErrors, formState.errors, requiredCustomFields, values]);

  function handleValidSubmit(formValues: QuotationDetailsValues) {
    const missingFields: Array<{
      path: FieldPath<QuotationDetailsValues>;
      message: string;
    }> = [];

    if (!formValues.subject?.trim()) {
      missingFields.push({
        path: "subject",
        message: "Subject is required",
      });
    }

    if (!formValues.message?.trim()) {
      missingFields.push({
        path: "message",
        message: "Message is required",
      });
    }

    requiredCustomFields.forEach((field) => {
      const value =
        field.id === RATE_VALIDITY_FIELD.id
          ? formValues.rate_validity
          : formValues.custom_fields?.[field.id];

      if (value?.trim()) {
        return;
      }

      missingFields.push({
        path: (field.id === RATE_VALIDITY_FIELD.id
          ? "rate_validity"
          : `custom_fields.${field.id}`) as FieldPath<QuotationDetailsValues>,
        message: `${field.label} is required`,
      });
    });

    if (missingFields.length > 0) {
      missingFields.forEach(({ path, message }) => {
        setError(path, {
          type: "required",
          message,
        });
      });

      return;
    }

    onSubmit(formValues);
  }

  useEffect(() => {
    if (!values || !formState.isDirty) {
      return;
    }

    const snapshot = JSON.stringify(values);

    if (snapshot === lastReportedValuesRef.current) {
      return;
    }

    lastReportedValuesRef.current = snapshot;

    onChange?.(values as QuotationDetailsValues);
  }, [formState.isDirty, onChange, values]);

  return (
    <form id={id} onSubmit={handleSubmit(handleValidSubmit)} noValidate>
      <Stack gap="md" mt="md">
        <QuotationCustomFieldsGrid
          template={template}
          control={control}
          fixedFields={[RATE_VALIDITY_FIELD]}
          readOnly={readOnly}
        />

        <TextInputField
          control={control}
          name="subject"
          label="SUBJECT"
          placeholder="Enter subject"
          withAsterisk
          readOnly={readOnly}
        />

        <div>
          <Group justify="space-between" mb="xs" align="flex-start">
            <Text size="sm" fw={500}>
              MESSAGE <span style={{ color: "var(--mantine-color-red-6)" }}>*</span>
            </Text>
            <MessageTemplateSelect
              value={selectedMessageTemplateId}
              readOnly={readOnly}
              onChange={(templateId) => {
                if (readOnly) {
                  return;
                }
                setSelectedMessageTemplateId(templateId);

                if (!templateId) return;

                const selectedTemplate = messageTemplates.find(
                  (messageTemplate) => messageTemplate.id === templateId,
                );

                if (!selectedTemplate) return;

                setValue("message", selectedTemplate.content, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
          </Group>

          <TextareaField
            control={control}
            name="message"
            placeholder="Enter message"
            minRows={6}
            autosize
            readOnly={readOnly}
          />
        </div>
      </Stack>
    </form>
  );
}
