import type { QuotationListItem } from "@/features/quotations/types/quotations.types";

export function getRowAccentColor(row: QuotationListItem) {
  return row.client_type === "NEW" ? "#54B99B" : "#368DC4";
}
