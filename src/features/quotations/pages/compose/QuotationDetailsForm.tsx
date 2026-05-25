import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { TextInputField, TextareaField } from "@/components/form/textFields";
import { MessageTemplateSelect } from "@/features/quotations/pages/compose/components/MessageTemplateSelect";
import { QuotationCustomFieldsGrid } from "@/features/quotations/pages/compose/components/QuotationCustomFieldsGrid";
import { useComposeMessageTemplates } from "@/features/quotations/hooks/useComposeReferenceData";
import {
  quotationDetailsSchema,
  type QuotationDetailsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";
import { RATE_VALIDITY_FIELD } from "@/features/quotations/utils/quotationDetailFields";

interface QuotationDetailsFormProps {
  id: string;
  template: QuotationTemplate;
  defaultValues?: Partial<QuotationDetailsValues>;
  onSubmit: (values: QuotationDetailsValues) => void;
  onChange?: (values: QuotationDetailsValues) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export function QuotationDetailsForm({
  id,
  template,
  defaultValues,
  onSubmit,
  onChange,
  onValidityChange,
}: QuotationDetailsFormProps) {
  const { data: messageTemplates = [] } = useComposeMessageTemplates();
  const [selectedMessageTemplateId, setSelectedMessageTemplateId] = useState<
    string | null
  >(null);

  const { control, handleSubmit, setValue, formState } =
    useForm<QuotationDetailsValues>({
      resolver: zodResolver(quotationDetailsSchema),
      mode: "onChange",
      defaultValues: defaultValues ?? {},
    });
  const values = useWatch({ control });

  useEffect(() => {
    onValidityChange?.(formState.isValid);
  }, [formState.isValid, onValidityChange]);

  useEffect(() => {
    if (!values || !formState.isDirty) {
      return;
    }

    onChange?.(values as QuotationDetailsValues);
  }, [formState.isDirty, onChange, values]);

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="md" mt="md">
        <QuotationCustomFieldsGrid
          template={template}
          control={control}
          fixedFields={[RATE_VALIDITY_FIELD]}
        />

        <TextInputField control={control} name="subject" label="SUBJECT" />

        <div>
          <MessageTemplateSelect
            value={selectedMessageTemplateId}
            onChange={(templateId) => {
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

          <TextareaField
            control={control}
            name="message"
            minRows={6}
            autosize
          />
        </div>
      </Stack>
    </form>
  );
}
