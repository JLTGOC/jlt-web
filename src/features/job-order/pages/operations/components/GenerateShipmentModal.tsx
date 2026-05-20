import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { Warning, AssignmentTurnedIn } from "@nine-thirty-five/material-symbols-react/outlined";
import { type Dispatch, type SetStateAction } from "react";

type GenerateShipmentModalProps = {
  generateShipmentModalOpen: boolean;
  setGenerateShipmentConfirmModalOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
  referenceNumber?: string;
  assignedTo?: string | null;
  assignedToImage?: string | null;
};

export default function GenerateShipmentModal({
  generateShipmentModalOpen,
  onConfirm,
  onClose,
  isLoading = false,
  referenceNumber,
}: GenerateShipmentModalProps) {
  return (
    <Modal
      opened={generateShipmentModalOpen}
      onClose={onClose}
      title="CONFIRM GENERATE SHIPMENT"
      centered
      size={360}
      overlayProps={{ color: "#121f4a", opacity: 0.55 }}
      withCloseButton
      styles={{
        content: {
          borderRadius: "0.375rem",
          overflow: "hidden",
        },
        header: {
          background: "#ececec",
          borderBottom: "1px solid #d7d7d7",
          minHeight: "3.125rem",
          padding: "0.75rem 1.5rem",
        },
        title: {
          color: "#16345b",
          fontSize: "1.05rem",
          fontWeight: 700,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        },
        close: {
          color: "#0f1427",
        },
        body: {
          padding: 0,
          background: "#ffffff",
        },
      }}
    >
      <Stack gap="0.9rem" py="1.2rem" px="1.5rem" align="center">
        <Group gap="md" justify="center" align="center" wrap="nowrap">
          <Warning width={82} height={82} color="#ff1f1f" />
        </Group>

        <Stack gap={2} align="center">
          <Text fw={600} c="#1e3049" ta="center" fz="0.95rem">
            Generate Shipment?
          </Text>

          <Text c="#5f6673" ta="center" fz="0.74rem" lh={1.35} maw={250}>
            You&apos;re about to generate this Job Order to Shipment. Please
            review all details carefully.
          </Text>

          {referenceNumber ? (
            <Text c="#8a8f99" ta="center" fz="0.72rem" mt={2}>
              Request Ref. No: {referenceNumber}
            </Text>
          ) : null}
        </Stack>
      </Stack>

      <Group gap={0} grow align="stretch">
        <Button
          h={40}
          radius={0}
          styles={{
            root: {
              background: "#1d2a56",
              borderTop: "1px solid #d7d7d7",
              borderRight: "1px solid #d7d7d7",
              "&:hover": {
                background: "#182346",
              },
            },
            label: {
              color: "#ffffff",
              fontSize: ".85rem",
              fontWeight: 500,
              letterSpacing: "0.03em",
            },
          }}
          tt="uppercase"
          onClick={onConfirm}
          loading={isLoading}
          disabled={isLoading}
        >
          YES
        </Button>

        <Button
          h={40}
          radius={0}
          variant="filled"
          styles={{
            root: {
              background: "#e9e9e9",
              borderTop: "1px solid #d7d7d7",
              "&:hover": {
                background: "#dedede",
              },
            },
            label: {
              color: "#1e3049",
              fontSize: ".85rem",
              fontWeight: 500,
              letterSpacing: "0.03em",
            },
          }}
          tt="uppercase"
          disabled={isLoading}
          onClick={onClose}
        >
          CANCEL
        </Button>
      </Group>
    </Modal>
  );
}
