import { Box, Text } from "@mantine/core";
import type { JobOrderListItem } from "../../../types/jobOrder";

interface DetailsCellProps {
  item: JobOrderListItem;
}

function RouteArrow() {
  return (
    <Box
      component="span"
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
        marginInline: "0.28rem",
      }}
    >
      <svg
        width="38"
        height="11"
        viewBox="0 0 38 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="6.125" cy="6" r="3.5" fill="#9CA3AF" />
        <path
          d="M10 6H30"
          stroke="#9CA3AF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M25 1L31 6L25 11"
          stroke="#9CA3AF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
}

export function DetailsCell({ item }: DetailsCellProps) {
  if (item.service === "Logistics" && item.logistics_service) {
    const l = item.logistics_service;
    return (
      <Box c="jltBlue">
        <Text size="xs">BL: {l.BL}</Text>
        <Text size="xs">
          {l.commodity}
          <RouteArrow />
          {l.transport_mode}
        </Text>
        <Text size="xs">
          {l.origin}
          <RouteArrow />
          {l.destination}
        </Text>
      </Box>
    );
  }
  if (item.service === "Regulatory" && item.regulatory_service) {
    const r = item.regulatory_service;
    return (
      <Box c="jltBlue">
        <Text size="xs">{r.regulatory_assistance ?? "-"}</Text>
        <Text size="xs">
          <Text component="span" c="dimmed">
            Client Type:
          </Text>{" "}
          {r.client_type}
        </Text>
        <Text size="xs">
          <Text component="span" c="dimmed">
            Processing Type:
          </Text>{" "}
          {r.application_type}
        </Text>
      </Box>
    );
  }
  return (
    <Text size="xs" c="dimmed">
      —
    </Text>
  );
}
