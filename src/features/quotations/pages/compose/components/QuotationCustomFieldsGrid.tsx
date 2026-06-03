import { SimpleGrid } from "@mantine/core";
import { TextInputField } from "@/components/form/textFields";
import { SelectField } from "@/components/form/selectFields";
import { DateInputField } from "@/components/form/valueFields";
import type { Control } from "react-hook-form";
import type { QuotationDetailsValues } from "@/features/quotations/schemas/compose.schema";
import type {
  CustomField,
  QuotationTemplate,
} from "@/features/quotations/types/compose.types";
import { isRateValidityField } from "@/features/quotations/utils/quotationDetailFields";

interface QuotationCustomFieldsGridProps {
  template: QuotationTemplate;
  control: Control<QuotationDetailsValues>;
  fixedFields?: CustomField[];
  readOnly?: boolean;
}

export function QuotationCustomFieldsGrid({
  template,
  control,
  fixedFields = [],
  readOnly,
}: QuotationCustomFieldsGridProps) {
  const fields = [
    ...template.custom_fields.filter((field) => !isRateValidityField(field)),
    ...fixedFields,
  ];

  if (fields.length === 0) {
    return null;
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <SelectField
              key={field.id}
              control={control}
              name={`custom_fields.${field.id}`}
              label={field.label.toUpperCase()}
              placeholder={`Select ${field.label.toLowerCase()}`}
              data={field.options ?? []}
              withAsterisk
              readOnly={readOnly}
            />
          );
        }

        if (field.type === "date") {
          return (
            <DateInputField
              key={field.id}
              control={control}
              name={
                field.id === "rate_validity"
                  ? "rate_validity"
                  : `custom_fields.${field.id}`
              }
              label={field.label.toUpperCase()}
              placeholder="mm/dd/yyyy"
              valueFormat="MM/DD/YYYY"
              clearable
              withAsterisk
              readOnly={readOnly}
            />
          );
        }

        return (
          <TextInputField
            key={field.id}
            control={control}
            name={
              field.id === "rate_validity"
                ? "rate_validity"
                : `custom_fields.${field.id}`
            }
            label={field.label.toUpperCase()}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            withAsterisk
            readOnly={readOnly}
          />
        );
      })}
    </SimpleGrid>
  );
}
