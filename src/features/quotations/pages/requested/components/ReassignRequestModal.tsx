import { Button, Group, Modal, Select, Stack, Text, Textarea } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import { CheckCircle } from "@nine-thirty-five/material-symbols-react/outlined";

type ReassignRequestProps = {
  requestReassignModalOpen: boolean;
  onClose: () => void;
  selectedQuotation?: { reference_number?: string } | null;
  referenceNumber?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  reassignReasonEnums?: string[];
  reassignReason?: string | null;
  setReassignReason?: Dispatch<SetStateAction<string>>;
  reassignAdditionalDetails?: string;
  setReassignAdditionalDetails?: Dispatch<SetStateAction<string>>;
};

export default function ReassignRequest({
  requestReassignModalOpen,
  onClose,
  selectedQuotation,
  referenceNumber = "-",
  isLoading = false,
  onConfirm,
  reassignReasonEnums,
  reassignReason,
  setReassignReason,
  reassignAdditionalDetails,
  setReassignAdditionalDetails,
}: ReassignRequestProps) {

  return (
    <Modal
      opened={requestReassignModalOpen ?? false}
      onClose={onClose}
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
            {selectedQuotation?.reference_number ?? referenceNumber}
          </Text>
        </Group>

        <Select
          label="Select Reason"
          placeholder="Choose a reason"
          data={reassignReasonEnums}
          value={reassignReason}
          onChange={(value) => setReassignReason?.(value ?? "")}
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
          value={reassignAdditionalDetails ?? ""}
          onChange={(e) => setReassignAdditionalDetails?.(e.currentTarget.value)}
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
            onClick={onConfirm}
            loading={isLoading}
            disabled={!reassignReason}
          >
            Submit Request
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
