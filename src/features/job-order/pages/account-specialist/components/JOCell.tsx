import { Box, Text, Anchor } from "@mantine/core";
import { Link } from "react-router";
import type { JobOrderListItem } from "../../../types/jobOrder";

interface JOCellProps {
  item: JobOrderListItem;
  detailPath: string;
}

export function JOCell({ item, detailPath }: JOCellProps) {
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
      <Text size="xs" c="dimmed">
        {item.client}
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
