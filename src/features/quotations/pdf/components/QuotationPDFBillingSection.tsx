import { Text, View } from "@react-pdf/renderer";
import type { ChargeRow } from "@/features/quotations/schemas/compose.schema";
import type { quotationPdfStyles } from "@/features/quotations/pdf/quotationPdf.styles";
import { isPerContainerUom } from "@/features/quotations/utils/billing";
import {
  formatBillingAmount,
  getBillingPresentationRows,
} from "@/features/quotations/utils/billingPresentation";

interface QuotationPDFBillingSectionProps {
  sectionId: string;
  sectionTitle: string;
  currency: string;
  uom: string;
  rows: ChargeRow[];
  total: number;
  styles: typeof quotationPdfStyles;
  formatAmount: (amount?: number | null) => string;
}

export function QuotationPDFBillingSection({
  sectionId,
  sectionTitle,
  currency,
  uom,
  rows,
  total,
  styles,
  formatAmount,
}: QuotationPDFBillingSectionProps) {
  const displayRows = getBillingPresentationRows(
    rows,
    currency,
    uom,
    formatAmount,
  );
  const hasPerContainerRows =
    isPerContainerUom(uom) ||
    displayRows.some((row) => isPerContainerUom(row.uom));

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text
            style={[styles.tableCellBase, styles.colDescription, styles.bold]}
          >
            Description of Charges
          </Text>
          <Text style={[styles.tableCellBase, styles.colCurrency, styles.bold]}>
            Currency
          </Text>
          <Text style={[styles.tableCellBase, styles.colUom, styles.bold]}>
            UOM
          </Text>
          <Text style={[styles.tableCellBase, styles.colQuantity, styles.bold]}>
            Quantity
          </Text>
          <Text
            style={[styles.tableCellBase, styles.colContainer, styles.bold]}
          >
            Container Size
          </Text>
          <Text
            style={[
              styles.tableCellBase,
              styles.colAmount,
              styles.bold,
              styles.tableCellRight,
            ]}
          >
            Amount
          </Text>
          <Text
            style={[
              styles.tableCellLast,
              styles.colTotal,
              styles.bold,
              styles.tableCellRight,
            ]}
          >
            Total Amount
          </Text>
        </View>
        {displayRows.map((row, index) => (
          <View key={`${sectionId}-${index}`}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBase, styles.colDescription]}>
                {row.description}
              </Text>
              <Text style={[styles.tableCellBase, styles.colCurrency]}>
                {row.currency}
              </Text>
              <Text style={[styles.tableCellBase, styles.colUom]}>
                {row.uom}
              </Text>
              <Text
                style={[
                  styles.tableCellBase,
                  styles.colQuantity,
                  styles.tableCellRight,
                ]}
              >
                {row.quantity}
              </Text>
              <Text style={[styles.tableCellBase, styles.colContainer]}>
                {row.containerSize}
              </Text>
              <Text
                style={[
                  styles.tableCellBase,
                  styles.colAmount,
                  styles.tableCellRight,
                ]}
              >
                {row.amountText}
              </Text>
              <Text
                style={[
                  styles.tableCellLast,
                  styles.colTotal,
                  styles.tableCellRight,
                ]}
              >
                {row.totalText}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={[styles.tableCellBase, styles.bold, { flex: 7.2 }]}>
            {`Total ${sectionTitle}`}
          </Text>
          <Text
            style={[
              styles.tableCellLast,
              styles.colTotal,
              styles.bold,
              styles.tableCellRight,
            ]}
          >
            {formatBillingAmount(currency, total)}
          </Text>
        </View>
        {hasPerContainerRows ? (
          <Text style={styles.sectionNote}>
            Per container charges use quantity multiplied by the unit rate.
          </Text>
        ) : null}
      </View>
    </View>
  );
}
