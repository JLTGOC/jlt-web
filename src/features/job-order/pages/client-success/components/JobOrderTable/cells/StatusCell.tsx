import { Button, Text } from "@mantine/core";
import {
  EventNote,
  Paid,
  PanToolAlt,
} from "@nine-thirty-five/material-symbols-react/outlined";

export function StatusCell({
  row,
  userID,
  onAcceptClick,
}: any) {
  if (row.has_timeline) {
    return (
      <>
        <Button
          bg="#4E6174"
          leftSection={<EventNote width={20} />}
        >
          Planning & Timeline
        </Button>

        <Button
          bg="#4E6174"
          leftSection={<Paid width={20} />}
        >
          Create Billing
        </Button>
      </>
    );
  }

  if (
    !row.ops_id &&
    row.assignment_status === "AVAILABLE"
  ) {
    return (
      <>
        <Button
          bg="#9BF6A0"
          c="#007406"
          leftSection={<PanToolAlt width={20} />}
          onClick={(event) => {
            event.stopPropagation();
            onAcceptClick?.(row);
          }}
        >
          Accept
        </Button>

        <Text c="#007406">
          {row.assignment_status}
        </Text>
      </>
    );
  }

  if (
    row.ops_id === userID &&
    row.assignment_status === "ASSIGNED"
  ) {
    return (
      <>
        <Button
          bg="#BADEFF"
          c="#0064E0"
          leftSection={<EventNote width={20} />}
        >
          Make Planning & Timeline
        </Button>

        <Text>{row.assigned_to}</Text>
        <Text>{row.assigned_at}</Text>
      </>
    );
  }

  return (
    <>
      <Button disabled>Accepted</Button>

      <Text>{row.assigned_to}</Text>

      <Text>{row.assigned_at}</Text>
    </>
  );
}