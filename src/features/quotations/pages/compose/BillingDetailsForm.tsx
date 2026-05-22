import { zodResolver } from "@hookform/resolvers/zod";
import { Group, Stack, Text } from "@mantine/core";
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
  isPerContainerUom,
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
}

type BillingDetailsFormInput = z.input<typeof billingDetailsSchema>;

export function BillingDetailsForm({
  id,
  template,
  defaultValues,
  onSubmit,
  onChange,
  onValidityChange,
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
    defaultValues: defaultValues ?? { currency: "", uom: "", sections: {} },
  });
  const sectionError =
    typeof formState.errors.sections?.message === "string"
      ? formState.errors.sections.message
      : undefined;

  const currency = useWatch({ control, name: "currency" }) ?? "";
  const uom = useWatch({ control, name: "uom" }) ?? "";
  const sections = (useWatch({ control, name: "sections" }) ??
    {}) as BillingDetailsValues["sections"];
  const formValues = useWatch({ control });
  const grandTotal = getBillingGrandTotal(
    getBillingSectionsWithCharges(template, { sections }),
    uom,
  );
  const currencies = billingSettings?.currencies ?? [];
  const uoms = billingSettings?.uoms ?? [];

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
        <Group grow>
          <SelectField
            control={control}
            name="currency"
            label="Currency"
            placeholder="Select currency"
            data={currencies}
            searchable
            styles={tableSelectStyles}
          />

          <SelectField
            control={control}
            name="uom"
            label="UOM"
            placeholder="Select UOM"
            data={uoms}
            searchable
            styles={tableSelectStyles}
          />
        </Group>

        {template.billing_sections.map((section) => (
          <BillingSectionRows
            key={section.id}
            control={control}
            section={section}
            globalCurrency={currency}
            globalUom={uom}
            isPerContainer={isPerContainerUom(uom)}
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

        {isPerContainerUom(uom) && (
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
