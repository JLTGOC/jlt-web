import { Button, Group, Modal, Select, Stack, Text, Textarea } from "@mantine/core";
import { CheckCircle } from "@nine-thirty-five/material-symbols-react/outlined";
import { useState } from "react";

type ReassignRequestProps = {
  opened: boolean;
  onClose: () => void;
  referenceNumber?: string;
  reasons?: { value: string; label: string }[];
  isLoading?: boolean;
  onSubmit: (reason: string, additionalDetails: string) => void;
};

export default function ReassignRequest({
  opened,
  onClose,
  referenceNumber = "-",
  reasons = [],
  isLoading = false,
  onSubmit,
}: ReassignRequestProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleSubmit = () => {
    if (!selectedReason) return;
    onSubmit(selectedReason, additionalDetails);
    setSelectedReason(null);
    setAdditionalDetails("");
  };

  const handleClose = () => {
    setSelectedReason(null);
    setAdditionalDetails("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="REASSIGNMENT REQUEST"
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
      <Stack gap="1rem">
        <Group gap={6} align="flex-start">
          <Text c="#7b7b7b" fz="0.95rem" fw={500}>
            Request Ref. No:
          </Text>
          <Text c="#1e3049" fz="0.95rem" fw={600}>
            {referenceNumber}
          </Text>
        </Group>

        <Select
          label="Select Reason"
          placeholder="Choose a reason"
          data={reasons}
          value={selectedReason}
          onChange={setSelectedReason}
          searchable
          clearable
          radius="sm"
          styles={{
            input: {
              borderColor: "#d7d7d7",
            },
          }}
        />

        <Textarea
          label="Additional details (optional)"
          placeholder="Enter additional details..."
          minRows={4}
          radius="sm"
          styles={{
            input: {
              borderColor: "#d7d7d7",
            },
          }}
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.currentTarget.value)}
        />

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
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!selectedReason}
          >
            Submit Request
          </Button>
          <Button
            h={48}
            radius="md"
            tt="uppercase"
            variant="light"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
