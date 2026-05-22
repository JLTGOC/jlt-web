import {
  ActionIcon,
  Autocomplete,
  Grid,
  NumberInput,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  AddTwo,
  Delete,
} from "@nine-thirty-five/material-symbols-react/outlined";
import {
  Controller,
  type Control,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import * as z from "zod";
import { NumberInputField } from "@/components/form/valueFields";
import { billingDetailsSchema } from "@/features/quotations/schemas/compose.schema";
import type { BillingSection } from "@/features/quotations/types/compose.types";
import { getRowsTotalWithGlobalUom } from "@/features/quotations/utils/billing";
import { formatBillingAmount } from "@/features/quotations/utils/billingPresentation";
import { ReceiptChargeField } from "./ReceiptChargeField";
import classes from "../BillingDetailsForm.module.css";

type BillingDetailsFormInput = z.input<typeof billingDetailsSchema>;

interface BillingSectionRowsProps {
  control: Control<BillingDetailsFormInput>;
  section: BillingSection;
  globalCurrency: string;
  globalUom: string;
  isPerContainer: boolean;
}

export function BillingSectionRows({
  control,
  section,
  globalCurrency,
  globalUom,
  isPerContainer,
}: BillingSectionRowsProps) {
  const sectionName = `sections.${section.id}` as const;
  const fieldArray = useFieldArray({ control, name: sectionName });
  const hasRows = fieldArray.fields.length > 0;
  const rows = useWatch({ control, name: sectionName }) ?? [];
  const total = getRowsTotalWithGlobalUom(rows, globalUom);

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <Text className={classes.sectionTitle}>{section.title}</Text>
        <ActionIcon
          variant="subtle"
          color="jltBlue.8"
          className={classes.addButton}
          onClick={() =>
            fieldArray.append({
              description: "",
              amount: null,
              quantity: null,
              container_size: "",
            })
          }
          aria-label={`Add ${section.title} row`}
        >
          <AddTwo width="1.125rem" height="1.125rem" />
        </ActionIcon>
      </div>

      {hasRows && (
        <div className={classes.rows}>
          {fieldArray.fields.map((field, index) => (
            <Grid
              key={field.id}
              gutter={0}
              columns={24}
              className={classes.row}
            >
              <Grid.Col span={{ base: 24, sm: 10 }} className={classes.cell}>
                <Controller
                  control={control}
                  name={`sections.${section.id}.${index}.description`}
                  render={({ field: formField, fieldState }) => {
                    return (
                      <ReceiptChargeField
                        value={formField.value ?? ""}
                        availableCharges={section.available_charges}
                        onChange={(nextValue) => formField.onChange(nextValue)}
                        onBlur={formField.onBlur}
                        error={fieldState.error?.message}
                      />
                    );
                  }}
                />
              </Grid.Col>
              {isPerContainer && (
                <Grid.Col span={{ base: 12, sm: 3 }} className={classes.cell}>
                  <Controller
                    control={control}
                    name={`sections.${section.id}.${index}.quantity`}
                    render={({ field: formField, fieldState }) => (
                      <Tooltip
                        label={fieldState.error?.message}
                        disabled={!fieldState.error}
                        color="red"
                        withArrow
                        position="bottom"
                      >
                        <NumberInput
                          value={formField.value ?? ""}
                          onChange={formField.onChange}
                          onBlur={formField.onBlur}
                          hideControls
                          min={1}
                          placeholder="QTY"
                          styles={{
                            input: {
                              border: fieldState.error
                                ? "1px solid var(--mantine-color-red-6)"
                                : 0,
                              borderRadius: 0,
                              background: "transparent",
                              minHeight: "2.875rem",
                              height: "2.875rem",
                              color: "var(--mantine-color-jltBlue-8)",
                              fontWeight: 500,
                              fontSize: "0.8125rem",
                              textAlign: "center",
                              textTransform: "uppercase",
                            },
                          }}
                        />
                      </Tooltip>
                    )}
                  />
                </Grid.Col>
              )}

              {isPerContainer && (
                <Grid.Col span={{ base: 12, sm: 4 }} className={classes.cell}>
                  <Controller
                    control={control}
                    name={`sections.${section.id}.${index}.container_size`}
                    render={({ field: formField, fieldState }) => (
                      <Tooltip
                        label={fieldState.error?.message}
                        disabled={!fieldState.error}
                        color="red"
                        withArrow
                        position="bottom"
                      >
                        <Autocomplete
                          value={formField.value ?? ""}
                          onChange={formField.onChange}
                          onBlur={formField.onBlur}
                          data={["1x20", "1x40"]}
                          placeholder="CONTAINER SIZE"
                          error={!!fieldState.error} // red border only, no text
                          styles={{
                            input: {
                              border: fieldState.error
                                ? "1px solid var(--mantine-color-red-6)"
                                : 0,
                              borderRadius: 0,
                              background: "transparent",
                              minHeight: "2.875rem",
                              height: "2.875rem",
                              color: "var(--mantine-color-jltBlue-8)",
                              fontWeight: 500,
                              fontSize: "0.8125rem",
                              textTransform: "uppercase",
                            },
                          }}
                        />
                      </Tooltip>
                    )}
                  />
                </Grid.Col>
              )}

              <Grid.Col
                span={{ base: 20, sm: isPerContainer ? 6 : 13 }}
                className={classes.cell}
              >
                <div className={classes.amountCell}>
                  <NumberInputField
                    control={control}
                    name={`sections.${section.id}.${index}.amount`}
                    label=""
                    hideControls
                    min={0}
                    thousandSeparator=","
                    styles={{
                      input: {
                        border: 0,
                        borderRadius: 0,
                        background: "transparent",
                        minHeight: "2.875rem",
                        height: "2.875rem",
                        color: "var(--mantine-color-jltBlue-8)",
                        fontWeight: 500,
                        fontSize: "0.8125rem",
                        textAlign: "center",
                      },
                    }}
                  />
                  {(rows[index]?.amount === null ||
                    rows[index]?.amount === undefined) && (
                    <Text className={classes.amountPlaceholder}>
                      ENTER AMOUNT
                    </Text>
                  )}
                </div>
              </Grid.Col>

              <Grid.Col
                span={{ base: 4, sm: 1 }}
                className={`${classes.cell} ${classes.deleteCell}`}
              >
                <ActionIcon
                  variant="subtle"
                  color="red"
                  className={classes.deleteButton}
                  onClick={() => fieldArray.remove(index)}
                  aria-label={`Remove ${section.title} row ${index + 1}`}
                >
                  <Delete width="1.5rem" height="1.5rem" />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          ))}
        </div>
      )}

      {hasRows && (
        <div className={classes.totalRow}>
          <Text className={classes.totalLabel}>{`Total ${section.title}`}</Text>
          <Text className={classes.totalValue}>
            {formatBillingAmount(globalCurrency, total)}
          </Text>
        </div>
      )}

      {hasRows && isPerContainer && (
        <Text size="xs" c="dimmed" px="sm" pb="sm" pt={6}>
          Per container charges use quantity multiplied by the unit rate.
        </Text>
      )}
    </div>
  );
}
