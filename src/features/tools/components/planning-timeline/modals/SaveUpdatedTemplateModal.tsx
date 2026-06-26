import { Modal, Box, Text, Button } from "@mantine/core";
import { QuickReference } from "@nine-thirty-five/material-symbols-react/outlined";

interface SaveUpdatedTemplateModalProps {
  opened: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SaveUpdatedTemplateModal({
  opened,
  isLoading = false,
  onClose,
  onConfirm,
}: SaveUpdatedTemplateModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      overlayProps={{ color: "#17314B", backgroundOpacity: 0.7, blur: 0.3 }}
      title={
        <Text size="md" fw={700} style={{ color: "#17314B" }}>
          CONFIRM UPDATED TEMPLATE
        </Text>
      }
      size="lg"
      styles={{
        content: { maxWidth: 480, width: "100%" },
        header: {
          backgroundColor: "#EBEBEB",
          borderRadius: "8px 8px 0 0",
          padding: "1rem 1.25rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        title: {
          width: "100%",
          textAlign: "center",
        },
      }}
    >
      <Box style={{ padding: "1rem 0.5rem 0.5rem", textAlign: "center" }}>
        <QuickReference style={{ width: 100, height: 100 }} color="#AA4851" />

        <Text
          fw={500}
          size="sm"
          style={{ marginBottom: 12, lineHeight: 1.4, letterSpacing: "0.02em" }}
        >
          ARE YOU SURE YOU WANT TO SAVE CHANGES TO THE TEMPLATE?
        </Text>

        <Text c="dimmed" size="sm" style={{ marginBottom: 28, lineHeight: 1.6 }}>
          This will update the template with the selected phase and process configuration. Please confirm before proceeding.
        </Text>

        <Box style={{ display: "flex", gap: 12 }}>
          <Button
            fullWidth
            variant="outline"
            style={{ borderColor: "#4E6174", color: "#4E6174", borderWidth: 1 }}
            onClick={onClose}
          >
            CANCEL
          </Button>
          <Button
            fullWidth
            style={{ backgroundColor: "#4E6174", color: "#fff" }}
            onClick={onConfirm}
            loading={isLoading}
          >
            SAVE CHANGES
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
