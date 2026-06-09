import { useState } from "react";
import { Modal, TextInput, Button, Group, Text, Box } from "@mantine/core";

import type { UsedByTemplates } from "@/features/tools/types/planningTimeline";

type InUseModalProps = {
  opened: boolean;
  name: string;
  item: string;
  onClose: () => void;
  onConfirm: (phaseName: string) => void;
  inUseTemplateList: UsedByTemplates[];
};

export default function InUseModal({
  opened,
  name,
  item,
  onClose,
  onConfirm,
  inUseTemplateList
}: InUseModalProps) {
  const [phaseName, setPhaseName] = useState("");

  const handleConfirm = () => {
    onConfirm(phaseName);
    setPhaseName("");
    onClose();
  };

  const handleClose = () => {
    setPhaseName("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton
      padding={0}
      radius="md"
      size="md"
      centered
      title={
        <Box>
          <Text
            style={{
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            List of Templates
          </Text>
          <Text fz={10}>This {name} is used in this template/s.</Text>
        </Box>
      }
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
          fontSize: "1.2rem",
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
      <Text fz={15} fw={600} mb={10}>{item}</Text>
      {inUseTemplateList.map((template, i) => (
        <Text fz={12} fw={400} key={i}>- {template.name}</Text>
      ))}
    </Modal>
  );
}
