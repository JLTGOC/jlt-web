import { Box, Group, Paper, Stack, Text } from "@mantine/core";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface StatusUpdateProps {
  shipment: ShipmentResource;
  customMargins?: Record<number, string>; // Index-based margin overrides
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

export function StatusUpdate({ shipment, customMargins }: StatusUpdateProps) {
  const currentStatus = shipment.general_info.status || "NOT YET DEPARTED";
  const currentIndex = statusSequence.indexOf(currentStatus as (typeof statusSequence)[number]);
  const latestUpdatedAt =
    shipment.shipment_information.updated_at || shipment.general_info.date || "";
  const currentTimeLabel = formatTime(latestUpdatedAt);

  // Calculate positions for circles and lines
  const baseLeft = 80; // 5rem in pixels
  const lineHorizontalOffset = -570; // extra shift for the line to the right
  const lineVerticalOffset = 30; // move the line upward
  const positions = statusSequence.map((_, index) => {
    let pos = baseLeft;
    for (let i = 0; i < index; i++) {
      pos += parseInt((customMargins?.[i + 1] || "0").replace("px", "")) || 0;
    }
    return pos;
  });

  return (
    <Paper
      radius="md"
      withBorder
      p="lg"
      style={{
        width: "75%",
        maxWidth: "75%",
        border: "1px solid var(--mantine-color-gray-2)",
        backgroundColor: "#ffffff",
      }}
    >
      <Group justify="space-between" align="flex-start" mt="xs">
        <Stack gap="xs">
        </Stack>
      </Group>

      <Box>
        {/* Centered Wrapper for all status content */}
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* Circles and Text Container */}
          <Box
            style={{
              position: "relative",
              height: 80,
              width: 700,
            }}
          >
          {statusSequence.map((statusLabel, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isNext = index === currentIndex + 1;
            const accentColor = (isCompleted || isCurrent )? "#16A34A" : "#a3a3a3";
            const circleBackground = "#ffffff";
            const checkColor = (isCompleted || isCurrent )? "#16A34A" : "transparent";
            const textColor = isCompleted || isCurrent ? "#0F172A" : "#334155";
            const left = positions[index];

            return (
              <Box
                key={statusLabel}
                style={{
                  position: "absolute",
                  left: `${left}px`,
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: circleBackground,
                    border: `2px solid ${accentColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: checkColor,
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  {(isCompleted || isCurrent) ? "✓" : ""} {/* Show checkmark for completed and current status */}
                </Box>
                
                <Box mt="sm" style={{ textAlign: "center", minWidth: 100 }}>
                  <Text fw={600} size="xs" c={textColor}>
                    {statusLabel}
                  </Text>
                  <Text c="gray.6" size="xs">
                    {isCurrent ? currentTimeLabel : isNext ? "Pending" : ""} {/* Show time for current status, "Pending" for next status, and nothing for others */}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Lines Container */}
        <Box
          style={{
            position: "relative",
            height: 2,
            width: 700,
            marginTop: -16, // Adjust to position lines below circles
          }}
        >
          {statusSequence.slice(0, -1).map((_, index) => {
            const start = positions[index] + 16 + lineHorizontalOffset;
            const end = positions[index + 1] + 16 + lineHorizontalOffset;
            const width = end - start;
            const isCompleted = index < currentIndex;
            const lineColor = isCompleted ? "#16A34A" : "#a3a3a3";

            return (
              <Box
                key={index}
                style={{
                  position: "absolute",
                  left: `${start}px`,
                  top: `${lineVerticalOffset}px`,
                  width: `${width}px`,
                  height: 2,
                  backgroundColor: lineColor,
                  zIndex: 1,
                }}
              />
            );
          })}
        </Box>
        </Box>
        </Box>
    </Paper>
  );
}
