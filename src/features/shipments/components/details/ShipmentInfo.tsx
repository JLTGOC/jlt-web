import {
  Paper,
  Group,
  Text,
  Box as MantineBox,
} from "@mantine/core";
import {
  ChevronRight,
  Box as BoxIcon, // Material Symbols Outlined: box
} from "@nine-thirty-five/material-symbols-react/outlined";
import { DetailGrid } from "@/components/DetailGrid";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface ShipmentInformationProps {
  shipment: ShipmentResource;
  expanded: boolean;
  onToggle: () => void;
}

export function ShipmentInformation({
  shipment,
  expanded,
  onToggle,
}: ShipmentInformationProps) {
  return (
    <MantineBox
      w="100%"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      style={{ textAlign: "left", cursor: "pointer" }}
    >
      <Paper
        radius="md"
        p={0}
        style={{
          border: "1px solid var(--mantine-color-gray-2)",
          transition: "all 0.2s ease",
        }}
      >
        <MantineBox
          w="100%"
          bg="#D4DAE0"
          p="lg"
          style={{
            borderBottom: "1px solid var(--mantine-color-gray-2)",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
            ...(expanded
              ? {}
              : {
                  borderBottomLeftRadius: "0.5rem",
                  borderBottomRightRadius: "0.5rem",
                }),
          }}
        >
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <MantineBox
                style={{
                  color: "var(--mantine-color-jltBlue-8)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Material Symbols Outlined: box */}
                <BoxIcon
                  width="1.5rem"
                  height="1.5rem"
                  style={{ color: "#1D274E" }}
                />
              </MantineBox>
              <Text fw={500} tt="uppercase" c="jltBlue.8">
                Shipment Details
              </Text>
            </Group>
            <ChevronRight
              style={{
                width: "1.5rem",
                height: "1.5rem",
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </Group>
        </MantineBox>

        {expanded && (
          <MantineBox p="lg" pb="xs">
            <DetailGrid
              rows={[
                { label: "SERVICE TYPE", value: shipment.shipment_information?.service_type || "—" },
                { label: "FREIGHT TRANSPORT MODE", value: shipment.shipment_information?.transport_mode || "—" },
                {
                  label: "SERVICE",
                  value:
                    shipment.shipment_information?.sub_services?.length
                      ? shipment.shipment_information.sub_services.join(", ")
                      : "—",
                },
                { label: "COMMODITY", value: shipment.commodity_details?.commodity || "—" },
                { label: "VOLUME (DIMENSION)", value: shipment.commodity_details?.container_size || "—" },
                { label: "ORIGIN", value: shipment.shipment_information?.origin || "—" },
                { label: "DESTINATION", value: shipment.shipment_information?.destination || "—" },
                { label: "DETAILS/REMARKS", value: shipment.shipment_information?.remarks || "—" },
              ]}
            />
          </MantineBox>
        )}
      </Paper>
    </MantineBox>
  );
}
