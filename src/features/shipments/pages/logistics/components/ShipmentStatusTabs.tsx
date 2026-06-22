import { Box, Group, Text, UnstyledButton } from "@mantine/core";
import { SHIPMENT_STATUS_COLORS } from "@/features/shipments/types/shipments.types";

interface ShipmentStatusTabsProps {
  activeStatus: string; // backend key (e.g. "NOT YET DEPARTED")
  onStatusChange: (status: string) => void;
  statusCounts?: Record<string, number>; // backend counts keyed by uppercase status
}

// Mapping backend keys → frontend labels
const STATUS_LABELS: Record<string, string> = {
  ALL: "ALL SHIPMENTS",
  "NOT YET DEPARTED": "Not Yet Departed",
  "IN TRANSIT": "In Transit",
  ARRIVED: "Arrived",
  BERTHED: "Berthed",
  DISCHARGED: "Discharged",
  DELIVERED: "Delivered",
};

const tabStyles = {
  root: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.45rem 0.7rem",
    borderBottom: "2px solid transparent",
    cursor: "default",
    transition: "border-bottom-color 150ms ease",
  },
};

export function ShipmentStatusTabs({
  activeStatus,
  onStatusChange,
  statusCounts,
}: ShipmentStatusTabsProps) {
  const renderCircle = (backendKey: string) => {
    if (backendKey === "ALL") return null;
    const color = SHIPMENT_STATUS_COLORS[backendKey] || "#999";
    return (
      <Box
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
    );
  };

  return (
    <Box
      p="xs"
      style={{
        background: "#ffffff",
        borderRadius: "0.55rem",
        border: "1px solid #e2e6eb",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        top: "-1.2rem",
        position: "relative",
      }}
    >
      <Group gap="0" wrap="nowrap" style={{ minWidth: "max-content" }}>
        {Object.entries(STATUS_LABELS).map(([backendKey, label], index) => (
          <Group
            key={backendKey}
            gap="0"
            align="center"
            style={{ flex: "0 0 auto", minWidth: 0 }}
          >
            <UnstyledButton
              styles={tabStyles}
              style={{
                borderBottomColor:
                  activeStatus === backendKey ? "#ef8f27" : "transparent",
                flex: "0 0 auto",
                padding: "0.45rem 0.55rem",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
              onClick={() => onStatusChange(backendKey)} // send backend key
            >
              <Group
                gap="0.3rem"
                align="center"
                justify="space-between"
                style={{ minWidth: 0 }}
              >
                <Group gap="0.3rem" align="center" style={{ minWidth: 0 }}>
                  {renderCircle(backendKey)}
                  <Text
                    fz="0.82rem"
                    fw={700}
                    c="#2c3f55"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {label}
                  </Text>
                </Group>
                {statusCounts && (
                  <Text
                    fz="0.82rem"
                    fw={700}
                    c="#8a8f99"
                    style={{ flexShrink: 0 }}
                  >
                    {statusCounts[backendKey] || 0}
                  </Text>
                )}
              </Group>
            </UnstyledButton>
            {index < Object.keys(STATUS_LABELS).length - 1 && (
              <Text fz="1rem" c="#e2e6eb" fw={700}>
                |
              </Text>
            )}
          </Group>
        ))}
      </Group>
    </Box>
  );
}
