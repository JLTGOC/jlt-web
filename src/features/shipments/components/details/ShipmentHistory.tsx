import {
  Paper,
  Group,
  Text,
  Box as MantineBox,
} from "@mantine/core";
import {
  ChevronRight,
  History,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { useQuery } from "@tanstack/react-query";
import { fetchQuotation } from "@/features/quotations/api/quotations.api";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";

interface ShipmentHistoryProps {
  shipment: ShipmentResource;
  expanded: boolean;
  onToggle: () => void;
}

export function ShipmentHistory({
  shipment,
  expanded,
  onToggle,
}: ShipmentHistoryProps) {
  const quotationId = shipment.general_info.job_order_id?.toString();

  const { data: quotation } = useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: () => fetchQuotation(quotationId!),
    enabled: !!quotationId && expanded,
  });

  // Helper formats raw ISO or space-separated date strings to MM-DD-YYYY and 12-hour time with AM/PM.
  // If the date cannot be parsed, this returns null so the event is not shown.
  const formatDateTime = (raw?: string) => {
    if (!raw || raw.trim() === "" || raw.trim() === "-") {
      return null;
    }

    const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
    const parsed = new Date(normalized);

    const formatTime = (hours: number, minutes: number) => {
      const period = hours >= 12 ? "PM" : "AM";
      const normalizedHour = hours % 12 || 12;
      return `${String(normalizedHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
    };

    if (!Number.isNaN(parsed.getTime())) {
      const month = String(parsed.getMonth() + 1).padStart(2, "0");
      const day = String(parsed.getDate()).padStart(2, "0");
      const year = parsed.getFullYear();
      return {
        date: `${month}-${day}-${year}`,
        time: formatTime(parsed.getHours(), parsed.getMinutes()),
        timestamp: parsed.getTime(),
      };
    }

    const [datePart = "", timePart = "00:00"] = raw.split(" ");
    const [year, month, day] = datePart.split("-");
    const formattedDate = month && day && year
      ? `${month.padStart(2, "0")}-${day.padStart(2, "0")}-${year}`
      : "";
    if (!formattedDate) {
      return null;
    }

    const [hourStr = "00", minuteStr = "00"] = timePart.split(":");
    const hourNum = Number(hourStr);
    const minuteNum = Number(minuteStr);
    return {
      date: formattedDate,
      time: formatTime(Number.isNaN(hourNum) ? 0 : hourNum, Number.isNaN(minuteNum) ? 0 : minuteNum),
      timestamp: 0,
    };
  };

  const createHistoryItem = (raw: string | undefined, action: string, by: string) => {
    const result = formatDateTime(raw);
    if (!result) return null;
    return { ...result, action, by };
  };

  const historyItems = [
    ...(quotation ? [
      createHistoryItem(quotation.qtn_created_at ?? quotation.created_at, "Quotation Created", quotation.account_specialist || "—"),
      ...(quotation.qtn_accepted_at ? [createHistoryItem(quotation.qtn_accepted_at, "Quotation Accepted", quotation.client?.full_name || "—")] : []),
      createHistoryItem(quotation.updated_at, "Quotation Updated", quotation.account_specialist || "—"),
    ] : []),
    createHistoryItem(shipment.general_info.date, "Shipment Assigned", shipment.shipment_information.account_handler || "—"),
    createHistoryItem(shipment.shipment_information.created_at, "Shipment Created", shipment.shipment_information.account_handler || "—"),
  ]
    .filter((item): item is { date: string; time: string; timestamp: number; action: string; by: string } => item !== null)
    .sort((a, b) => b.timestamp - a.timestamp);

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
                <History width="1.5rem" height="1.5rem" />
              </MantineBox>
              <Text fw={500} tt="uppercase" c="jltBlue.8">
                History
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
            {historyItems.length === 0 ? (
              <Text c="gray.6" size="sm">
                No history at the moment.
              </Text>
            ) : (
              <>
                {/* Column headers */}
                <div
                  style={{
                    display: "flex",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    paddingBottom: "0.5rem",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <div style={{ flex: 2, paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
                    Date & Time
                  </div>
                  <div style={{ flex: 3, paddingRight: "0.5rem" }}>Action</div>
                  <div style={{ flex: 2 }}>By</div>
                </div>

                {/* Timeline container */}
                <div
                  style={{
                    borderLeft: "2px solid green",
                    paddingLeft: "0.5rem",
                    position: "relative",
                  }}
                >
                  {historyItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                        position: "relative",
                      }}
                    >
                      {/* Circle marker */}
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: "white",
                          border: "2px solid green",
                          position: "absolute",
                          left: "-15.5px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />

                      {/* Columns */}
                      <div
                        style={{
                          flex: 2,
                          paddingRight: "0.5rem",
                          display: "flex",
                          gap: "0.75rem",
                        }}
                      >
                        <span style={{ fontSize: "0.875rem", color: "#475569" }}>
                          {item.date}
                        </span>
                        <span
                          style={{
                            minWidth: "80px",
                            fontSize: "0.875rem",
                            color: "#475569",
                          }}
                        >
                          {item.time}
                        </span>
                      </div>
                      <div
                        style={{
                          flex: 3,
                          paddingRight: "0.5rem",
                          fontSize: "0.875rem",
                          color: "#475569",
                        }}
                      >
                        {item.action}
                      </div>
                      <div style={{ flex: 2, fontSize: "0.875rem", color: "#475569" }}>
                        {item.by}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </MantineBox>
        )}
      </Paper>
    </MantineBox>
  );
}
