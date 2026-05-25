import { Badge, Group, Stack, Text } from "@mantine/core";
import { CheckCircle } from "@nine-thirty-five/material-symbols-react/rounded";

interface StatusCellProps {
  status?: "accepted" | "pending" | string;
  dateAccepted?: string;
  id?: string | number;
}

export function StatusCell({ status, dateAccepted }: StatusCellProps) {
  if (!status)
    return (
      <Text size="sm" c="dimmed">
        —
      </Text>
    );

  const isAccepted = String(status).toLowerCase() === "accepted";

  if (isAccepted) {
    return (
      <Stack gap={4}>
        <Group gap={8} align="center">
          <CheckCircle width={24} height={24} color="green" />
          <Text span fw={600} size="sm" c={"green"}>
            Accepted
          </Text>
        </Group>
        {dateAccepted && (
          <Text size="xs" c="dimmed">
            Date Accepted: {dateAccepted}
          </Text>
        )}
      </Stack>
    );
  }

  // Pending or other statuses
  return (
    <Badge
      radius="sm"
      color="yellow"
      variant="light"
      styles={(theme) => ({
        root: {
          color: theme.colors.orange[7],
          padding: "6px 12px",
          fontWeight: 600,
        },
      })}
    >
      Pending
    </Badge>
  );
}
