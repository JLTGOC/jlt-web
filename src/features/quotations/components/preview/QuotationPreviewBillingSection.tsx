import { Box, Table, Text } from "@mantine/core";
import type { ChargeRow } from "@/features/quotations/schemas/compose.schema";
import { isPerContainerUom } from "@/features/quotations/utils/billing";
import {
  formatBillingAmount,
  getBillingPresentationRows,
} from "@/features/quotations/utils/billingPresentation";

interface QuotationPreviewBillingSectionProps {
  sectionId: string;
  sectionTitle: string;
  currency: string;
  uom: string;
  rows: ChargeRow[];
  sectionTotal: number;
  formatAmount: (amount: number | null | undefined) => string;
}

export function QuotationPreviewBillingSection({
  sectionId,
  sectionTitle,
  currency,
  uom,
  rows,
  sectionTotal,
  formatAmount,
}: QuotationPreviewBillingSectionProps) {
  const displayRows = getBillingPresentationRows(
    rows,
    currency,
    uom,
    formatAmount,
  );
  const isPerContainer = isPerContainerUom(uom);

  return (
    <Box mb="lg">
      <Text size="xs" fw={700} tt="uppercase" mb="xs">
        {sectionTitle}
      </Text>
      <Table
        withTableBorder
        withColumnBorders
        fz="xs"
        styles={{
          thead: { backgroundColor: "#f0f0f0" },
          table: { borderColor: "#b9b9b9" },
          th: { borderColor: "#b9b9b9" },
          td: { borderColor: "#b9b9b9" },
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Description of Charges</Table.Th>
            <Table.Th>Currency</Table.Th>
            <Table.Th>UOM</Table.Th>
            {isPerContainer && <Table.Th ta="right">Quantity</Table.Th>}
            {isPerContainer && <Table.Th>Container Size</Table.Th>}
            <Table.Th ta="right">Amount</Table.Th>
            <Table.Th ta="right">Total Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {displayRows.map((row, index) => (
            <Table.Tr key={`${sectionId}-${index}`}>
              <Table.Td>{row.description}</Table.Td>
              <Table.Td>{row.currency}</Table.Td>
              <Table.Td>{row.uom}</Table.Td>
              {isPerContainer && <Table.Td ta="right">{row.quantity}</Table.Td>}
              {isPerContainer && <Table.Td>{row.containerSize}</Table.Td>}
              <Table.Td ta="right">{row.amountText}</Table.Td>
              <Table.Td ta="right">
                <Box>
                  <Text size="xs" fw={600} ta="right">
                    {row.totalText}
                  </Text>
                  {row.calculationText && (
                    <Text size="xs" c="dimmed" ta="right">
                      {row.calculationText}
                    </Text>
                  )}
                </Box>
              </Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr>
            <Table.Td
              colSpan={isPerContainer ? 6 : 4}
              fw={700}
            >{`Total ${sectionTitle}`}</Table.Td>
            <Table.Td ta="right" fw={700}>
              {formatBillingAmount(currency, sectionTotal)}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      {isPerContainer && (
        <Text size="xs" c="dimmed" mt="xs">
          Per container charges use quantity multiplied by the unit rate.
        </Text>
      )}
    </Box>
  );
}
