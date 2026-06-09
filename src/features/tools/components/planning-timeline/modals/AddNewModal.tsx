import { useState } from "react";
import { Modal, TextInput, Button, Group, Text, Box } from "@mantine/core";
import {
  Add,
  Assignment,
  Lan,
  AddAd,
} from "@nine-thirty-five/material-symbols-react/rounded";

type AddNewPhaseModalProps = {
  opened: boolean;
  name: string;
  onClose: () => void;
  onConfirm: (phaseName: string) => void;
};

export default function AddNewModal({
  opened,
  onClose,
  onConfirm,
  name,
}: AddNewPhaseModalProps) {
  const [phaseName, setPhaseName] = useState("");

  console.log("khate", name);

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
        <Group>
          {name === "PHASE" ? (
            <Assignment />
          ) : name === "PROCESS" ? (
            <Lan />
          ) : (
            <AddAd />
          )}

          <Box>
            <Text
              style={{
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Add New {name}
            </Text>
            <Text fz={10}>
              Create a new {name} to organize your operations.
            </Text>
          </Box>
        </Group>
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
      <TextInput
        label={`${name} Name`}
        placeholder={`Enter ${name} name`}
        required
        value={phaseName}
        onChange={(e) => setPhaseName(e.currentTarget.value)}
      />

      <Group justify="center" m="lg" gap="sm">
        <Button variant="default" onClick={handleClose}>
          CANCEL
        </Button>
        <Button color="#4E6174" onClick={handleConfirm}>
          CONFIRM
        </Button>
      </Group>
    </Modal>
  );
}
