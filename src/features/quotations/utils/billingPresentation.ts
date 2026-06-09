import type { ChargeRow } from "@/features/quotations/schemas/compose.schema";
import {
  getChargeRowTotal,
  isPerContainerUom,
} from "@/features/quotations/utils/billing";

export interface BillingPresentationRow {
  description: string;
  currency: string;
  uom: string;
  quantity: string;
  containerSize: string;
  amountText: string;
  totalText: string;
  calculationText: string | null;
}

export function formatQuotationAmount(
  amount: number | null | undefined,
): string {
  return amount != null
    ? amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "-";
}

export function formatBillingAmount(
  currency: string,
  amount: number | null | undefined,
): string {
  const formattedAmount = formatQuotationAmount(amount);

  return currency.trim()
    ? `${currency.trim()} ${formattedAmount}`
    : formattedAmount;
}

export function getBillingPresentationRows(
  rows: ChargeRow[],
  currency: string,
  uom: string,
  formatAmount: (amount: number | null | undefined) => string,
): BillingPresentationRow[] {
  return rows.map((row) => {
    const resolvedUom = row.uom?.trim() || uom?.trim() || ""; 
    const perContainer = isPerContainerUom(resolvedUom);
    const amountText = formatAmount(row.amount);
    const rowTotal = getChargeRowTotal(row);
    const totalText = formatBillingAmount(currency, rowTotal);
    const calculationText =
      perContainer && row.quantity != null && row.amount != null
        ? `${row.quantity.toLocaleString("en-PH")} x ${amountText} = ${totalText}`
        : null;

    return {
      description: row.description?.trim() || "-",
      currency: currency.trim() || row.currency?.trim() || "-",
      uom: resolvedUom || "-",
      quantity:
        perContainer && row.quantity != null
          ? row.quantity.toLocaleString("en-PH")
          : "-",
      containerSize:
        perContainer && row.container_size?.trim()
          ? row.container_size.trim()
          : "-",
      amountText,
      totalText,
      calculationText,
    };
  });
}
