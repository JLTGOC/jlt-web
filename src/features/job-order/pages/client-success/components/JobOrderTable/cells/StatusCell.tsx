import { Button, Text } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import {
  EventNote,
  Paid,
  PanToolAlt,
} from "@nine-thirty-five/material-symbols-react/outlined";

type Props = {
  row: any,
  userID: number,
  setActiveModal: Dispatch<SetStateAction<string | null>>;
modalOpenClick: (row: any, type: any) => void
}

export function StatusCell({
  row,
  userID,
  modalOpenClick,
  setActiveModal,
}: Props) {
  if (row.has_timeline) {
    return (
      <>
        <Button
          bg="#4E6174"
          leftSection={<EventNote width={20} />}
          w={250}
        >
          Planning & Timeline
        </Button>

        <Button
          bg="#4E6174"
          leftSection={<Paid width={20} />}
           w={250}
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
           w={250}
          leftSection={<PanToolAlt width={20} />}
          onClick={(event) => {
            event.stopPropagation();
            modalOpenClick?.(row, "accept");
            setActiveModal("accept")
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
          w={250}
          leftSection={<EventNote width={20} />}
          onClick={() => {
            modalOpenClick(row, "make")
          }}
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
      <Button disabled  w={250}>Accepted</Button>

      <Text>{row.assigned_to}</Text>

      <Text>{row.assigned_at}</Text>
    </>
  );
}