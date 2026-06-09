import { Box, Paper, Text } from "@mantine/core";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface StatusUpdateProps {
  shipment: ShipmentResource;
}

const statusSequence = [
  "NOT YET DEPARTED",
  "IN TRANSIT",
  "ARRIVED",
  "BERTHED",
  "DISCHARGED",
  "DELIVERED",
] as const;

function formatTime(value?: string): string {
  if (!value) return "—";

  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) {
    const timeMatch = value.match(/(\d{1,2}:\d{2})/);
    return timeMatch ? `${timeMatch[1]}` : value;
  }

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes}${ampm}`;
}

export function StatusUpdate({ shipment }: StatusUpdateProps) {
  const currentStatus = shipment.general_info.status || "NOT YET DEPARTED";
  const currentIndex = statusSequence.indexOf(currentStatus as (typeof statusSequence)[number]);
  const latestUpdatedAt =
    shipment.shipment_information.updated_at || shipment.general_info.date || "";
  const currentTimeLabel = formatTime(latestUpdatedAt);

  return (
    <Paper
      radius="md"
      withBorder
      p="sm"
      style={{
        width: "100%",
        border: "1px solid var(--mantine-color-gray-2)",
        backgroundColor: "#ffffff",
        minHeight: "150px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {statusSequence.map((statusLabel, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isNext = index === currentIndex + 1;

          const borderColor = isActive ? "#16A34A" : "#adb5bd";
          const checkColor = isActive ? "#16A34A" : "transparent";
          const lineColor = index < currentIndex ? "#16A34A" : "#adb5bd";

          return (
            <Box
              key={statusLabel}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Circle */}
              <Box
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff", // always white inside
                  border: `2px solid ${borderColor}`, // green outline if active
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: checkColor, // green check if active
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  position: "relative",
                }}
              >
                {isActive ? "✓" : ""}
                {/* Connector line */}
                {index < statusSequence.length - 1 && (
                  <Box
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "100%",
                      height: 2,
                      width: "190px",
                      backgroundColor: lineColor,
                      transform: "translateY(-50%)",
                    }}
                  />
                )}
              </Box>

              {/* Labels */}
              <Text fw={600} size="xs" c={isActive ? "#0F172A" : "#334155"} mt={4}>
                {statusLabel}
              </Text>
              <Text c="gray.6" size="xs">
                {isCurrent ? currentTimeLabel : isNext ? "Pending" : ""}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
