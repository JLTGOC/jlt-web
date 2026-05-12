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

  const segmentPercent = 100 / (statusSequence.length - 1);

  return (
    <Paper
      radius="md"
      withBorder
      p="sm"
      style={{
        width: "100%",
        maxWidth: "100%",
        border: "1px solid var(--mantine-color-gray-2)",
        backgroundColor: "#ffffff",
        pb: "0rem",
      }}
    >
      <Box style={{ width: "100%" }}>
        <Box
          style={{
            minWidth: 0,
            position: "relative",
            padding: "1rem 0 1.5rem",
          }}
        >
          <Box
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: 34,
              height: 2,
              backgroundColor: "#d1d5db",
              zIndex: 1,
            }}
          />

          {statusSequence.slice(0, -1).map((_, index) => {
            const isCompleted = index < currentIndex;
            return (
              <Box
                key={index}
                style={{
                  position: "absolute",
                  left: `${segmentPercent * index}%`,
                  width: `${segmentPercent}%`,
                  height: 2,
                  top: 34,
                  backgroundColor: isCompleted ? "#16A34A" : "transparent",
                  zIndex: 2,
                  transform: "translateX(16px)",
                }}
              />
            );
          })}

          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "relative",
              zIndex: 3,
              width: "100%",
            }}
          >
            {statusSequence.map((statusLabel, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isNext = index === currentIndex + 1;
              const accentColor = isCompleted || isCurrent ? "#16A34A" : "#a3a3a3";
              const checkColor = isCompleted || isCurrent ? "#16A34A" : "transparent";
              const textColor = isCompleted || isCurrent ? "#0F172A" : "#334155";

              return (
                <Box
                  key={statusLabel}
                  style={{
                    flex: "1 1 120px",
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      border: `2px solid ${accentColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: checkColor,
                      fontWeight: 700,
                      fontSize: "0.875rem",
                    }}
                  >
                    {(isCompleted || isCurrent) ? "✓" : ""}
                  </Box>

                  <Box style={{ minWidth: 0 }}>
                    <Text fw={600} size="xs" c={textColor}>
                      {statusLabel}
                    </Text>
                    <Text c="gray.6" size="xs">
                      {isCurrent ? currentTimeLabel : isNext ? "Pending" : ""}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
