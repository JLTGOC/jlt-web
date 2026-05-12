import {
  Group,
  Paper,
  Stack,
  Text,
  Image,
  Box as MantineBox,
  Avatar,
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
  const labelStyle = { minWidth: 147, flexShrink: 0 as const };

  const client = shipment.general_info.client;
  const clientIsObject = typeof client === "object";
  const clientFullName = clientIsObject ? client.full_name : client;
  const clientCompanyName = clientIsObject
    ? client.company_name
    : shipment.contact_person?.company_name;
  const clientContactNumber = clientIsObject
    ? client.contact_number
    : shipment.contact_person?.contact_number;
  const clientEmail = clientIsObject
    ? client.email
    : shipment.contact_person?.email;

  return (
    <Stack gap={0} style={{ width: "100%" }}>
      {/* Header with Shipment No, Reference, and Status */}
      <Paper
        p="sm"
        bg="#D4DAE0"
        radius="md"
        style={{
          marginBottom: 0,
          width: "100%",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Group gap="xs" style={{ flex: "1 1 auto", minWidth: 0 }}>
          <Text fw={600} size="md" c="gray.7">
            SHIPMENT NO.
          </Text>
          <Text fw={700} size="lg" c="jltBlue.8" style={{ minWidth: 0 }}>
            {shipment.general_info.reference_number}
          </Text>
        </Group>
        <MantineBox
          className={classes.statusBadge}
          data-status={toTitleCase(shipment.general_info.status || "")}
        >
          <Text
            fw={700}
            c={getStatusTextColor(shipment.general_info.status)}
            fz="0.813rem"
            style={{ position: "relative", zIndex: 2 }}
          >
            {shipment.general_info.status || "—"}
          </Text>
        </MantineBox>
      </Paper>

      {/* Merged Paper with Responsive Body */}
      <Paper
        radius={0}
        withBorder
        style={{
          borderTop: "none",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          borderBottomLeftRadius: "var(--mantine-radius-md)",
          borderBottomRightRadius: "var(--mantine-radius-md)",
        }}
      >
        <MantineBox className={classes.referenceHeaderBody} style={{ alignItems: "stretch" }}>
          <MantineBox
            p="md"
            bg="white"
            style={{
              flex: "1 1 410px",
              minWidth: 400,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Stack gap="md">
              {/* Avatar and Full Name */}
              <Group gap="md" align="flex-start" wrap="wrap">
                <Avatar
                  src={clientIsObject ? client.image_path : undefined}
                  name={clientIsObject ? clientFullName : clientFullName || "—"}
                  color="blue"
                  radius="xl"
                  size="lg"
                />
                <Stack gap="xs" style={{ flex: 1, marginTop: "0.9rem", minWidth: 0 }}>
                  <Text fw={700} size="lg" tt="uppercase" c="jltBlue.8" fz="1rem" lineClamp={1}>
                    {clientFullName || "—"}
                  </Text>
                </Stack>
              </Group>

              {/* Contact Details */}
              <Stack gap="xs">
                <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                  <Text c="gray.6" size="sm" style={labelStyle}>
                    COMPANY NAME
                  </Text>
                  <Text fw={450} size="sm" lineClamp={1} style={{ minWidth: 0 }}>
                    {clientCompanyName || "-"}
                  </Text>
                </Group>
                <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                  <Text c="gray.6" size="sm" style={labelStyle}>
                    CONTACT NO.
                  </Text>
                  <Text fw={450} size="sm" style={{ minWidth: 0 }}>
                    {clientContactNumber || "—"}
                  </Text>
                </Group>
                <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                  <Text c="gray.6" size="sm" style={labelStyle}>
                    EMAIL
                  </Text>
                  <Text fw={450} size="sm" truncate style={{ minWidth: 0 }}>
                    {clientEmail || "—"}
                  </Text>
                </Group>
              </Stack>
            </Stack>
            <div style={{ position: 'absolute', right: 0, top: '18%', height: '73%', width: '2px', backgroundColor: '#BEBEBE', zIndex: 1 }} />
          </MantineBox>

          <MantineBox
            p="md"
            bg="white"
            style={{
              flex: "1 1 410px",
              minWidth: 400,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              paddingLeft: "0rem",
              paddingTop: "3rem",
              height: "100%",
            }}
          >
            <Stack gap="sm" style={{ width: "100%" }}>
              <Group align="flex-start" wrap="wrap" style={{ minHeight: "1rem", gap: "0.75rem", width: "100%", justifyContent: "flex-start", marginTop: "1.8rem" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  SERVICE TYPE
                </Text>
                <Text fw={450} size="sm" style={{ minWidth: 0 }}>
                  {serviceType}
                </Text>
              </Group>
              <Group align="flex-start" wrap="wrap" style={{ minHeight: "1rem", gap: "0.75rem", width: "100%", justifyContent: "flex-start" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  TRANSPORT MODE
                </Text>
                <Text fw={450} size="sm" style={{ minWidth: 0 }}>
                  {transportMode}
                </Text>
              </Group>
              <Group align="flex-start" wrap="wrap" style={{ minHeight: "1rem", gap: "0.75rem", width: "100%", justifyContent: "flex-start" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  ORIGIN
                </Text>
                <Text
                  fw={450}
                  size="sm"
                  truncate
                  style={{ maxWidth: 240, minWidth: 0 }}
                  title={shipment.shipment_information?.origin}
                >
                  {abbreviateLocation(shipment.shipment_information?.origin)}
                </Text>
              </Group>
              <Group align="flex-start" wrap="wrap" style={{ minHeight: "1rem", gap: "0.75rem", width: "100%", justifyContent: "flex-start" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  DESTINATION
                </Text>
                <Text
                  fw={450}
                  size="sm"
                  truncate
                  style={{ maxWidth: 240, minWidth: 0 }}
                  title={shipment.shipment_information?.destination}
                >
                  {abbreviateLocation(shipment.shipment_information?.destination)}
                </Text>
              </Group>
            </Stack>
          </MantineBox>

          <MantineBox
            p="md"
            bg="white"
            style={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              width: 220,
              minWidth: 220,
            }}
          >
            <Image
              src={shipmentLogo}
              alt="Shipment Logo"
              width={220}
              height={220}
              fit="contain"
              style={{ pointerEvents: "none", position: "relative", zIndex: 2, marginBottom: "-4.5rem" }}
            />
          </MantineBox>
        </MantineBox>
      </Paper>
    </Stack>
  );
}
