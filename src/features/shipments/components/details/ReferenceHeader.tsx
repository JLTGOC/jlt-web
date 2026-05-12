import {
  Group,
  Paper,
  Stack,
  Text,
  Image,
  Box as MantineBox,
  Avatar,
  Divider,
} from "@mantine/core";
import shipmentLogo from "@/assets/logos/ShipmentLogo.png";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";
import classes from "./ReferenceHeader.module.css";

interface ReferenceHeaderProps {
  shipment: ShipmentResource;
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusTextColor(status: string | undefined): string {
  if (!status) return "#666";

  const statusMap: Record<string, string> = {
    "Not Yet Departed": "var(--status-outline-color-not-yet-departed)",
    "In Transit": "var(--status-outline-color-in-transit)",
    "Arrived": "var(--status-outline-color-arrived)",
    "Berthed": "var(--status-outline-color-berthed)",
    "Discharged": "var(--status-outline-color-discharged)",
    "Delivered": "var(--status-outline-color-delivered)",
  };

  // Direct match first
  if (statusMap[status]) {
    return statusMap[status];
  }

  // Try normalized version
  const normalized = toTitleCase(status);
  if (statusMap[normalized]) {
    return statusMap[normalized];
  }

  // Default fallback
  return "#666";
}

function abbreviateLocation(value: string | undefined): string {
  if (!value) return "—";

  const trimmed = value.trim();
  if (trimmed.length <= 24) return trimmed;

  const parts = trimmed.split(/[/,-]+/).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[parts.length - 1]}`;
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length > 2) {
    return `${words[0]} ${words[words.length - 1]}`;
  }

  return `${trimmed.slice(0, 20)}...`;
}

export function ReferenceHeader({ shipment }: ReferenceHeaderProps) {
  const serviceType = shipment.shipment_information?.service_type || "—";
  const transportMode = shipment.shipment_information?.transport_mode || "—";
  const labelStyle = { minWidth: 140, flexShrink: 0 as const };
  const companyName = shipment.general_info?.company_name || "—";

  return (
    <Stack gap={0}>
      {/* Header with Shipment No, Reference, and Status */}
      <Paper
        p="sm"
        bg="#D4DAE0"
        radius="md"
        style={{
          marginBottom: 0,
          maxWidth: "75%",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Group gap="xs">
          <Text fw={600} size="md" c="gray.7">
            SHIPMENT NO.
          </Text>
          <Text fw={700} size="lg" c="jltBlue.8">
            {shipment.general_info.reference_number}
          </Text>
        </Group>
        <MantineBox
          className={classes.statusBadge}
          data-status={toTitleCase(shipment.general_info.status || "")}
          style={{
            width: 230,
          }}
        >
          <Text
            fw={700}
            c={getStatusTextColor(shipment.general_info.status)}
            fz="0.813rem"
            style={{ position: "relative", zIndex: 2}}
          >
            {shipment.general_info.status || "—"}
          </Text>
        </MantineBox>
      </Paper>

      {/* Merged Paper with Vertical Divider */}
      <Paper
        radius={0}
        withBorder
        style={{
          borderTop: "none",
          position: "relative",
          overflow: "hidden",
          maxWidth: "75%",
          borderBottomLeftRadius: "var(--mantine-radius-md)",
          borderBottomRightRadius: "var(--mantine-radius-md)",
        }}
      >
        <Group align="stretch" grow gap={0}>
          {/* Left Side - Contact Information */}
          <MantineBox
            p="lg"
            bg="white"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack gap="md">
              {/* Avatar and Full Name */}
              <Group gap="md" align="flex-start">
                <Avatar
                  src={typeof shipment.general_info.client === 'object' ? shipment.general_info.client.image_path : undefined}
                  name={typeof shipment.general_info.client === 'object' ? shipment.general_info.client.full_name : shipment.general_info.client || "—"}
                  color="blue"
                  radius="xl"
                  size="lg"
                />
                <Stack gap="xs" style={{ flex: 1, marginTop: "0.9rem" }}>
                  <Text fw={700} size="lg" tt="uppercase" c="jltBlue.8" fz="1rem">
                    {typeof shipment.general_info.client === 'object' ? shipment.general_info.client.full_name : shipment.general_info.client || "—"}
                  </Text>
                </Stack>
              </Group>

              {/* Contact Details */}
              <Stack gap="xs">
                <Group align="center" wrap="nowrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                  <Text c="gray.6" size="sm" style={labelStyle}>
                    COMPANY NAME
                  </Text>
                  <Text fw={450} size="sm">
                    {typeof shipment.general_info.client === 'object' ? shipment.general_info.client.company_name : shipment.contact_person?.company_name || "-"}
                  </Text>
                </Group>
                <Group align="center" wrap="nowrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                  <Text c="gray.6" size="sm" style={labelStyle}>
                    CONTACT NO.
                  </Text>
                  <Text fw={450} size="sm">
                    {typeof shipment.general_info.client === 'object' ? shipment.general_info.client.contact_number : shipment.contact_person?.contact_number || "—"}
                  </Text>
                </Group>
                <Group align="center" wrap="nowrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                  <Text c="gray.6" size="sm" style={labelStyle}>
                    EMAIL
                  </Text>
                  <Text fw={450} size="sm" truncate>
                    {typeof shipment.general_info.client === 'object' ? shipment.general_info.client.email : shipment.contact_person?.email || "—"}
                  </Text>
                </Group>
              </Stack>
            </Stack>
          </MantineBox>

          {/* Vertical Divider */}
          <Divider orientation="vertical" size="md" style={{height: 150, alignSelf: "center", marginTop: "0.8rem" }} />

          {/* Right Side - Shipment Details */}
          <MantineBox
            p="lg"
            bg="white"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              paddingLeft: "-22rem",
              paddingRight: "1.25rem",
            }}
          >
            <Stack
              gap="sm"
              style={{
                position: "absolute",
                top: "1rem",
                left: "-22rem",
                right: "1.25rem",
                zIndex: 2,
              }}
            >
              <Group align="center" wrap="nowrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                <Text c="gray.6" size="sm" mt="34" style={labelStyle}>
                  SERVICE TYPE
                </Text>
                <Text fw={450} size="sm" mt="34">
                  {serviceType}
                </Text>
              </Group>
              <Group align="center" wrap="nowrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  TRANSPORT MODE
                </Text>
                <Text fw={450} size="sm">
                  {transportMode}
                </Text>
              </Group>
              <Group align="center" wrap="nowrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  ORIGIN
                </Text>
                <Text
                  fw={450}
                  size="sm"
                  truncate
                  style={{ maxWidth: 180 }}
                  title={shipment.shipment_information?.origin}
                >
                  {abbreviateLocation(shipment.shipment_information?.origin)}
                </Text>
              </Group>
              <Group align="center" wrap="nowrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  DESTINATION
                </Text>
                <Text
                  fw={450}
                  size="sm"
                  truncate
                  style={{ maxWidth: 180 }}
                  title={shipment.shipment_information?.destination}
                >
                  {abbreviateLocation(shipment.shipment_information?.destination)}
                </Text>
              </Group>
            </Stack>

            {/* Shipment Logo */}
            <Image
              src={shipmentLogo}
              alt="Shipment Logo"
              width={130}
              height={130}
              fit="contain"
              style={{
                position: "absolute",
                right: "-4.5rem",
                bottom: "0rem",
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
          </MantineBox>
        </Group>
      </Paper>
    </Stack>
  );
}
