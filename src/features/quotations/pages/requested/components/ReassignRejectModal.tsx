import { Button, Group, Modal, Text } from "@mantine/core";
import { Close } from "@nine-thirty-five/material-symbols-react/outlined";

type ReassignRejectModalProps = {
  opened: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onConfirm: () => void;
};

export default function ReassignRejectModal({
  opened,
  onClose,
  isLoading = false,
  onConfirm,
}: ReassignRejectModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="CONFIRM REASSIGNMENT"
      centered
      size={500}
      overlayProps={{ color: "#121f4a", opacity: 0.55 }}
      styles={{
        content: {
          borderRadius: "0.375rem",
          overflow: "hidden",
        },
        header: {
          background: "#e8e8e8",
          borderBottom: "1px solid #d7d7d7",
          minHeight: "3.125rem",
          padding: "0.75rem 1.5rem",
        },
        title: {
          color: "#16345b",
          fontSize: "1.75rem",
          fontWeight: 700,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        },
        close: {
          color: "#0f1427",
        },
        body: {
          padding: "1.5rem",
        },
      }}
    >
      <Text c="#1e3049" fz="1rem" fw={500} mb="1rem">
        You are about to <strong>REJECT</strong> this request.
      </Text>

      <Text c="#7b7b7b" fz="0.9rem" mb="1.5rem" lh={1.5}>
        This action will mark the request as discarded and it will no longer be
        processed.
      </Text>

      <Group grow>
        <Button
          h={48}
          radius="md"
          leftSection={<Close width={18} />}
          styles={{
            root: {
              background: "#b24955",
              "&:hover": {
                background: "#9e3d48",
              },
            },
          }}
          tt="uppercase"
          onClick={onConfirm}
          loading={isLoading}
        >
          Reject Request
        </Button>
        <Button
          h={48}
          radius="md"
          tt="uppercase"
          variant="light"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Group>
    </Modal>
  );
}
