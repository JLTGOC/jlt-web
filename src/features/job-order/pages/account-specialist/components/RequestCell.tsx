import { Box, Text, Anchor } from "@mantine/core";
import { Link } from "react-router";
import type { JobOrderListItem } from "../../../types/jobOrder";

interface RequestCellProps {
  item: JobOrderListItem;
}

export function RequestCell({ item }: RequestCellProps) {
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
        to={`/job-orders/${item.id}`}
        fw={700}
        size="sm"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {item.reference_number}
      </Anchor>
      <Text size="xs" c="dimmed">
        {item.client_full_name}
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
