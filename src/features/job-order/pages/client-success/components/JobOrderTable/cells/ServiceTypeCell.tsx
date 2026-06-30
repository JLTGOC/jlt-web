import { Table, Group, Text, Stack, Anchor } from "@mantine/core";
import { Link } from "react-router";
import { buildAcceptedQuotationViewerPath } from "@/features/job-order/utils/jobOrderNavigation";

export function ServiceTypeCell({ row }: any) {
  const quotationReference = row.quotation_reference_number;
  const quotationViewerPath = buildAcceptedQuotationViewerPath({
    quotationId: row.quotation_id,
    issuedQuotationId: row.issued_quotation_id,
  });
  return (
    <Table.Td>
      <Stack gap={2}>
        <Text>{row.service_level}</Text>

        <Group gap={6}>
          <Text>BL No.</Text>
          <Text>{row.bl_no}</Text>
        </Group>
      </Stack>
      {quotationReference && quotationViewerPath ? (
        <Anchor
          component={Link}
          to={quotationViewerPath}
          c="#2563EB"
          fz="0.813rem"
          fw={700}
          onClick={(event: any) => event.stopPropagation()}
          onMouseDown={(event: any) => event.stopPropagation()}
        >
          {quotationReference}
        </Anchor>
      ) : null}
    </Table.Td>
  );
}
