import { Anchor, Box, Text } from "@mantine/core";
import { Link } from "react-router";
import type { JobOrderListItem } from "../../../types/jobOrder";
import { buildAcceptedQuotationViewerPath } from "../../../utils/jobOrderNavigation";

interface JOCellProps {
  item: JobOrderListItem;
  detailPath: string;
}

export function JOCell({ item, detailPath }: JOCellProps) {
  const quotationReference = item.quotation_reference_number;
  const quotationViewerPath = buildAcceptedQuotationViewerPath({
    quotationId: item.quotation_id,
    issuedQuotationId: item.issued_quotation_id,
  });

  return (
    <Box
      style={{
        display: "flex",
        paddingLeft: "0.75rem",
        flexDirection: "column",
      }}
    >
      <Anchor
        component={Link}
        to={detailPath}
        fw={700}
        size="sm"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {item.reference_number}
      </Anchor>
      {quotationReference && quotationViewerPath ? (
        <Anchor
          component={Link}
          to={quotationViewerPath}
          fw={700}
          size="sm"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {quotationReference}
        </Anchor>
      ) : null}
      <Text size="xs" c="dimmed">
        {item.client}
      </Text>
      <Text size="xs" c="dimmed">
        {item.company_name}
      </Text>
      <Text size="xs" c="dimmed">
        JO Created:{" "}
        {new Date(item.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
    </Box>
  );
}
