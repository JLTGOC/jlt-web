import type {
  BillingSection,
  QuotationTemplate,
} from "@/features/quotations/types/compose.types";
import type { BillingDetailsValues } from "@/features/quotations/schemas/compose.schema";

type ChargeRowLike = {
  description?: string;
  currency?: string;
  uom?: string;
  amount?: number | "" | null | undefined;
  quantity?: number | "" | null | undefined;
  container_size?: string;
};

export interface BillingSectionWithRows {
  section: BillingSection;
  rows: ChargeRowLike[];
}

export function isPerContainerUom(uom?: string | null): boolean {
  return (uom ?? "").trim().toLowerCase() === "per container";
}

function hasChargeValue(value?: string | number | null): boolean {
  return value !== "" && value != null;
}

function toNumber(value?: number | "" | null): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function hasChargeContent(row: ChargeRowLike): boolean {
  return Boolean(
    row.description?.trim() ||
    row.currency?.trim() ||
    hasChargeValue(row.amount) ||
    hasChargeValue(row.quantity) ||
    row.container_size?.trim(),
  );
}

export function hasAnyCharge(
  sections: BillingDetailsValues["sections"],
): boolean {
  return Object.values(sections ?? {}).some((rows) =>
    rows.some(hasChargeContent),
  );
}

export function getBillingSectionsWithCharges(
  template: QuotationTemplate,
  billingDetails: BillingDetailsValues,
): BillingSectionWithRows[] {
  return template.billing_sections
    .map((section) => {
      const rows = (billingDetails.sections?.[section.id] ?? []).filter(
        hasChargeContent,
      );
      return { section, rows };
    })
    .filter(({ rows }) => rows.length > 0);
}

export function getRowsTotal(rows: ChargeRowLike[]): number {
  return rows.reduce((sum, row) => sum + toNumber(row.amount), 0);
}

export function getChargeRowTotal(row: ChargeRowLike): number {
  const amount = toNumber(row.amount);

  if (!isPerContainerUom(row.uom)) {
    return amount;
  }

  const quantity = toNumber(row.quantity);
  return amount * quantity;
}

export function getRowsTotalWithGlobalUom(rows: ChargeRowLike[]): number {
  return rows.reduce((sum, row) => sum + getChargeRowTotal(row), 0);
}

export function getBillingGrandTotal(
  sectionsWithRows: BillingSectionWithRows[],
): number {
  return sectionsWithRows.reduce(
    (sum, { rows }) => sum + getRowsTotalWithGlobalUom(rows),
    0,
  );
}
