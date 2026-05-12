import { Box, Group, Text } from "@mantine/core";
import {
  IconAnchor,
  IconPlaneArrival,
  IconPlaneDeparture,
  IconShip,
} from "@tabler/icons-react";

interface ServiceInformationCellProps {
  serviceLevel?: string;
  eta?: string;
  etd?: string;
  transportMode?: string;
  showDashOnly?: boolean;
}

function formatDate(value?: string) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isAirTransportMode(mode?: string) {
  if (!mode) return false;
  return /air|plane/i.test(mode);
}

export function ServiceInformationCell({
  serviceLevel,
  eta,
  etd,
  transportMode,
  showDashOnly,
}: ServiceInformationCellProps) {
  if (showDashOnly) {
    return (
      <Text fw={600} size="sm" c="dimmed">
        -
      </Text>
    );
  }

  const isAir = isAirTransportMode(transportMode);
  const EtaIcon = isAir ? IconPlaneArrival : IconAnchor;
  const EtdIcon = isAir ? IconPlaneDeparture : IconShip;

  return (
    <Box>
      <Text size="sm">{serviceLevel || "-"}</Text>

      <Group gap="0.4rem" mt="0.2rem" wrap="nowrap" c="jltBlue">
        <EtaIcon size={15} stroke={1.8} color="var(--mantine-color-gray-7)" />
        <Text size="sm">ETA: {formatDate(eta)}</Text>
      </Group>

      <Group gap="0.4rem" mt="0.15rem" wrap="nowrap" c="jltBlue">
        <EtdIcon size={15} stroke={1.8} color="var(--mantine-color-gray-7)" />
        <Text size="sm">ETD: {formatDate(etd)}</Text>
      </Group>
    </Box>
  );
}
