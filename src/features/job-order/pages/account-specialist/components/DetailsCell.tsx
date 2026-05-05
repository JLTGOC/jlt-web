import { Box, Text } from "@mantine/core";
import type { JobOrderListItem } from "../../../types/jobOrder";

interface DetailsCellProps {
  item: JobOrderListItem;
}

export function DetailsCell({ item }: DetailsCellProps) {
  if (item.service === "Logistics" && item.logistics_service) {
    const l = item.logistics_service;
    return (
      <Box>
        <Text fw={500} size="sm">
          Logistics
        </Text>
        <Text size="xs">{l.commodity}</Text>
        <Text size="xs">
          {l.service_type} → {l.transport_mode}
        </Text>
        <Text size="xs">
          {l.origin} → {l.destination}
        </Text>
      </Box>
    );
  }
  if (item.service === "Regulatory" && item.regulatory_service) {
    const r = item.regulatory_service;
    return (
      <Box>
        <Text fw={500} size="sm">
          Regulatory
        </Text>
        <Text size="xs">Application Type → {r.application_type}</Text>
      </Box>
    );
  }
  return (
    <Text size="xs" c="dimmed">
      —
    </Text>
  );
}
