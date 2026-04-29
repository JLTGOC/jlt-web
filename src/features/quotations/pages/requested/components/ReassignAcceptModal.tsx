import { Button, Group, Modal, Text } from "@mantine/core";
import { CheckCircle } from "@nine-thirty-five/material-symbols-react/outlined";

type ReassignAcceptModalProps = {
  onClose: () => void;
  currentPerson?: string;
  newPerson?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  reassignAcceptModalOpen?: boolean;
};

export default function ReassignAcceptModal({
  onClose,
  currentPerson,
  newPerson,
  isLoading,
  reassignAcceptModalOpen,
  onConfirm,
}: ReassignAcceptModalProps) {
  return (
    <Modal
      opened={reassignAcceptModalOpen ?? false}
      onClose={onClose}
      title="REASSIGNMENT REQUEST"
      centered
      size={600}
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
        You are about to <strong>REASSIGN</strong> this request.
      </Text>

      <Group gap={6} align="flex-start" mb="1rem">
        <Text c="#7b7b7b" fz="0.95rem" fw={500}>
          • Current Person Incharge:
        </Text>
        <Text c="#1e3049" fz="0.95rem" fw={600}>
          {currentPerson}
        </Text>
      </Group>

      <Group gap={6} align="flex-start" mb="1.5rem">
        <Text c="#7b7b7b" fz="0.95rem" fw={500}>
          • New Person in Charge:
        </Text>
        <Text c="#1e3049" fz="0.95rem" fw={600}>
          {newPerson}
        </Text>
      </Group>

      <Text c="#7b7b7b" fz="0.9rem" mb="1.5rem" lh={1.5}>
        This will transfer and remove access from the current person in charge.
      </Text>

      <Group grow>
        <Button
          h={48}
          radius="md"
          leftSection={<CheckCircle width={18} />}
          styles={{
            root: {
              background: "#1e3049",
              "&:hover": {
                background: "#162840",
              },
            },
          }}
          tt="uppercase"
          onClick={onConfirm}
          loading={isLoading}
        >
          Confirm Reassignment
        </Button>
      </Group>
    </Modal>
  );
}
