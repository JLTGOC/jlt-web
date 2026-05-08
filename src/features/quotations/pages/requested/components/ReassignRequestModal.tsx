import { Button, Group, Modal, Select, Stack, Text, Textarea } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import { CheckCircle, ChevronRight } from "@nine-thirty-five/material-symbols-react/outlined";

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
      size={540}
      overlayProps={{ color: "#121f4a", opacity: 0.55 }}
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
          color: "#1e3049",
          fontSize: "1.05rem",
          fontWeight: 700,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        },
        close: {
          color: "#000000",
        },
        body: {
          padding: "1.5rem",
          background: "#ffffff",
        },
      }}
    >
      <Stack gap="1rem">
        <Group gap={10} align="flex-start" wrap="nowrap">
          <Text c="#7b7b7b" fz="0.875rem" fw={500} miw={110}>
            Request Ref. No:
          </Text>
          <Text c="#1e3049" fz="0.875rem" fw={500}>
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
          rightSection={<ChevronRight/>}
          size="sm"
          styles={{
            label: {
              color: "#7b7b7b",
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "0.25rem",
            },
            input: {
              borderColor: "#d7d7d7",
              minHeight: "2.75rem",
              fontSize: "0.875rem",
            },
          }}
        />

        <Textarea
          label="Additional details (optional)"
          placeholder="Enter additional details..."
          minRows={4}
          radius="sm"
          size="sm"
          styles={{
            label: {
              color: "#7b7b7b",
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "0.25rem",
            },
            input: {
              borderColor: "#d7d7d7",
              minHeight: "6rem",
              fontSize: "0.875rem",
            },
          }}
          value={reassignAdditionalDetails ?? ""}
          onChange={(e) => setReassignAdditionalDetails?.(e.currentTarget.value)}
        />

        <Group justify="center" mt="xs">
          <Button
            h={50}
            miw={260}
            radius="md"
            leftSection={<CheckCircle width={18} />}
            styles={{
              root: {
                background: "#1e2b5a",
                "&:hover": {
                  background: "#172347",
                },
              },
              label: {
                color: "#ffffff",
                fontSize: ".875rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
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
