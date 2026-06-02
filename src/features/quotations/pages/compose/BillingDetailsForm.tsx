import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Group, Stack, Text } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { SelectField } from "@/components/form/selectFields";
import { useComposeBillingSettings } from "@/features/quotations/hooks/useComposeReferenceData";
import {
  billingDetailsSchema,
  type BillingDetailsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";
import {
  getBillingGrandTotal,
  getBillingSectionsWithCharges,
} from "@/features/quotations/utils/billing";
import { formatBillingAmount } from "@/features/quotations/utils/billingPresentation";
import { BillingSectionRows } from "@/features/quotations/pages/compose/components/BillingSectionRows";
import { tableSelectStyles } from "@/features/quotations/pages/compose/components/billingSelectStyles";
import classes from "./BillingDetailsForm.module.css";

interface BillingDetailsFormProps {
  id: string;
  template: QuotationTemplate;
  defaultValues?: Partial<BillingDetailsValues>;
  onSubmit: (values: BillingDetailsValues) => void;
  onChange?: (values: BillingDetailsValues) => void;
  onValidityChange?: (isValid: boolean) => void;
  readOnly?: boolean;
}

type BillingDetailsFormInput = z.input<typeof billingDetailsSchema>;

export function BillingDetailsForm({
  id,
  template,
  defaultValues,
  onSubmit,
  onChange,
  onValidityChange,
  readOnly,
}: BillingDetailsFormProps) {
  const lastReportedValuesRef = useRef("");
  const { data: billingSettings } = useComposeBillingSettings();
  const { control, handleSubmit, formState } = useForm<
    BillingDetailsFormInput,
    unknown,
    BillingDetailsValues
  >({
    resolver: zodResolver(billingDetailsSchema),
    mode: "onChange",
    defaultValues: defaultValues ?? { currency: "", sections: {} },
  });
  const sectionError =
    typeof formState.errors.sections?.message === "string"
      ? formState.errors.sections.message
      : undefined;

  const currency = useWatch({ control, name: "currency" }) ?? "";
  const sections = (useWatch({ control, name: "sections" }) ??
    {}) as BillingDetailsValues["sections"];
  const formValues = useWatch({ control });
  const grandTotal = getBillingGrandTotal(
    getBillingSectionsWithCharges(template, { sections }),
  );
  const currencies = billingSettings?.currencies ?? [];
  const uoms = billingSettings?.uoms ?? [];
  const hasPerContainerCharges = Object.values(sections).some((rows) =>
    rows.some((row) => row?.uom?.trim().toLowerCase() === "per container"),
  );

  useEffect(() => {
    onValidityChange?.(formState.isValid);
  }, [formState.isValid, onValidityChange]);

  useEffect(() => {
    if (!formValues || !formState.isDirty) {
      return;
    }

    const snapshot = JSON.stringify(formValues);

    if (snapshot === lastReportedValuesRef.current) {
      return;
    }

    lastReportedValuesRef.current = snapshot;

    onChange?.(formValues as BillingDetailsValues);
  }, [formState.isDirty, formValues, onChange]);

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="md" mt="md" className={classes.root}>
        <Box style={{ width: "min(14rem, 100%)" }}>
          <Text size="xs" fw={600} mb={6} c="dimmed">
            Currency
          </Text>
          <SelectField
            control={control}
            name="currency"
            label=""
            placeholder="SELECT CURRENCY"
            data={currencies}
            searchable
            readOnly={readOnly}
            styles={{
              input: {
                minHeight: "2.25rem",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "var(--mantine-color-jltBlue-8)",
              },
            }}
          />
        </Box>

        {template.billing_sections.map((section) => (
          <BillingSectionRows
            key={section.id}
            control={control}
            section={section}
            globalCurrency={currency}
            uoms={uoms}
            readOnly={readOnly}
          />
        ))}

        <Group className={classes.grandTotal}>
          <Text className={classes.grandTotalLabel}>
            Estimated Total Landed Cost
          </Text>
          <Text className={classes.grandTotalValue}>
            {formatBillingAmount(currency, grandTotal)}
          </Text>
        </Group>

        {hasPerContainerCharges && (
          <Text size="xs" c="dimmed" mt={-6}>
            Per container charges are calculated as quantity multiplied by the
            unit rate.
          </Text>
        )}

        {sectionError && (
          <Text c="red" size="xs" fw={500}>
            {sectionError}
          </Text>
        )}
      </Stack>
    </form>
  );
}
