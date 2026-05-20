import { Box, Group, ScrollArea, Table, Text, Timeline } from "@mantine/core";
import type {
  JobOrderDetail,
  JobOrderHistoryItem,
} from "../types/jobOrderDetail";

type JobOrderHistorySectionProps = {
  detail: JobOrderDetail;
};

type HistoryRow = {
  id: string;
  date: string;
  time: string;
  action: string;
  by: string;
  timestamp: number;
};

const em = "\u2014";

function formatDateTime(raw?: string | null) {
  if (!raw || !raw.trim()) {
    return null;
  }

  let parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
    parsed = new Date(normalized);
  }

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return {
    date: parsed.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    time: parsed.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    timestamp: parsed.getTime(),
  };
}

function pickFirstString(
  item: JobOrderHistoryItem,
  keys: Array<keyof JobOrderHistoryItem>,
) {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function getHistorySource(detail: JobOrderDetail) {
  const candidates = [
    detail.history,
    detail.histories,
    detail.activity_logs,
    detail.activities,
    detail.timeline,
    detail.events,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function toHistoryRows(detail: JobOrderDetail): HistoryRow[] {
  const rows = getHistorySource(detail)
    .map((item, index) => {
      const dateTime = formatDateTime(
        pickFirstString(item, [
          "date_time",
          "datetime",
          "timestamp",
          "created_at",
          "updated_at",
          "date",
        ]),
      );
      const action =
        pickFirstString(item, ["action", "event", "status", "description"]) ??
        em;
      const by =
        pickFirstString(item, [
          "by",
          "user",
          "user_name",
          "actor",
          "actor_name",
          "performed_by",
        ]) ?? em;

      if (!dateTime && action === em && by === em) {
        return null;
      }

      return {
        id: String(item.id ?? index),
        date: dateTime?.date ?? em,
        time: dateTime?.time ?? em,
        timestamp: dateTime?.timestamp ?? 0,
        action,
        by,
      };
    })
    .filter((row): row is HistoryRow => row !== null);

  // Show events in chronological order (oldest first).
  return rows.sort((a, b) => a.timestamp - b.timestamp);
}

export function JobOrderHistorySection({
  detail,
}: JobOrderHistorySectionProps) {
  const rows = toHistoryRows(detail);

  if (!rows.length) {
    return (
      <Text size="sm" c="dimmed">
        No history details available yet.
      </Text>
    );
  }

  return (
    <ScrollArea type="auto">
      <Group align="flex-start" gap={0} wrap="nowrap">
        <Box pt={64} pr="sm">
          <Timeline
            active={rows.length}
            color="green"
            lineWidth={2}
            bulletSize={11}
            radius="xl"
            styles={{
              item: {
                minHeight: 25,
              },
              itemBody: {
                display: "none",
              },
              itemBullet: {
                backgroundColor: "white",
              },
            }}
          >
            {rows.map((row) => (
              <Timeline.Item key={row.id} />
            ))}
          </Timeline>
        </Box>

        <Box style={{ flex: 1, minWidth: 620 }}>
          <Table
            withTableBorder={false}
            withColumnBorders={false}
            horizontalSpacing="md"
            verticalSpacing="sm"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th colSpan={2}>DATE & TIME</Table.Th>
                <Table.Th colSpan={1}>ACTION</Table.Th>
                <Table.Th colSpan={1}>BY</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row) => (
                <Table.Tr key={`row-${row.id}`}>
                  <Table.Td>{row.date}</Table.Td>
                  <Table.Td>{row.time}</Table.Td>
                  <Table.Td>{row.action}</Table.Td>
                  <Table.Td>{row.by}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Group>
    </ScrollArea>
  );
}
