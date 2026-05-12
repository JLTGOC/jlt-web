import {
  Paper,
  Group,
  Text,
  Box as MantineBox,
} from "@mantine/core";
import {
  ChevronRight,
  InboxTextPerson,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { DetailGrid } from "@/components/DetailGrid";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface ConsigneeDetailsProps {
  shipment: ShipmentResource;
  expanded: boolean;
  onToggle: () => void;
}

export function ConsigneeDetails({
  shipment,
  expanded,
  onToggle,
}: ConsigneeDetailsProps) {
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
                <InboxTextPerson width="1.5rem" height="1.5rem" />
              </MantineBox>
              <Text fw={500} tt="uppercase" c="jltBlue.8">
                Consignee Details
              </Text>
            </Group>
            <ChevronRight
              width="1.5rem"
              height="1.5rem"
              style={{
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </Group>
        </MantineBox>

        {expanded && (
          <MantineBox p="lg" pb="sm">
            <DetailGrid
              rows={[
                {
                  label: "COMPANY NAME",
                  value: shipment.consignee_details?.company_name || "—",
                },
                {
                  label: "COMPANY ADDRESS",
                  value: shipment.consignee_details?.company_address || "—",
                },
                {
                  label: "CONTACT PERSON",
                  value: shipment.consignee_details?.contact_person || "—",
                },
                {
                  label: "CONTACT NUMBER",
                  value: shipment.consignee_details?.contact_number || "—",
                },
                {
                  label: "EMAIL ADDRESS",
                  value: shipment.consignee_details?.email || "—",
                },
              ]}
            />
          </MantineBox>
        )}
      </Paper>
    </MantineBox>
  );
}
