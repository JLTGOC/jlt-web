import { Button, Group, Modal, Select, Stack, Text } from "@mantine/core";
import { CheckCircle } from "@nine-thirty-five/material-symbols-react/outlined";

type Reassignprops = {
  reassignModalOpen: boolean;
  setReassignModalOpen: (open: boolean) => void;
  selectedQuotation: any;
  reassignPersonels: any[];
  reassignSpecificDetails: any;
  setReassignStatus: (status: string) => void;
  reassignASId: number | null;
  setReassignASId: (id: number | null) => void;
  setReassignAcceptModalOpen: (open: boolean) => void;
  setReassignRejectModalOpen: (open: boolean) => void;
  setReassignAS: (as: string) => void;
  onClose: () => void;
  // onConfirm?: (status: string, asId: number) => void;
};

export default function ReassignModal({
  reassignModalOpen,
  setReassignModalOpen,
  setReassignAcceptModalOpen,
  setReassignRejectModalOpen: _setReassignRejectModalOpen,
  selectedQuotation,
  reassignPersonels,
  reassignSpecificDetails: _reassignSpecificDetails,
  setReassignStatus,
  reassignASId,
  setReassignASId,
  setReassignAS,
  onClose,
  // onConfirm,
}: Reassignprops) {
  const reassignOptions = reassignPersonels
    .map((person) => {
      const value = String(
        person?.id ?? person?.username ?? person?.value ?? "",
      ).trim();
      const label = String(
        person?.full_name ?? person?.username ?? person?.label ?? value,
      ).trim();

      if (!value) {
        return null;
      }

      return { value, label };
    })
    .filter(
      (option): option is { value: string; label: string } => option !== null,
    );

  return (
    <Modal
      opened={reassignModalOpen}
      onClose={onClose}
      title="ASSIGN TO ANOTHER PERSON IN CHARGE"
      centered
      size={560}
      overlayProps={{ color: "#121f4a", opacity: 0.5 }}
      styles={{
        content: {
          borderRadius: "0.5rem",
          overflow: "hidden",
          background: "#f7f7f7",
        },
        header: {
          background: "#e2e2e2",
          borderBottom: "1px solid #d4d4d4",
          minHeight: "3rem",
          padding: "0.65rem 1.25rem",
        },
        title: {
          color: "#16345b",
          fontSize: "1.25rem",
          fontWeight: 700,
          letterSpacing: "0.01em",
          textTransform: "uppercase",
        },
        close: {
          color: "#0f1427",
          width: "1.8rem",
          height: "1.8rem",
        },
        body: {
          padding: "1.15rem 1.25rem 1.25rem",
        },
      }}
    >
      <Group gap={8} align="flex-start" mb={10}>
        <Text c="#8a8a8a" fz="0.78rem" w="50%">
          Quotation Request Ref. No
        </Text>
        <Text c="#1e3049" fz="0.8rem" fw={700}>
          {selectedQuotation?.reference_number ?? "-"}
        </Text>
      </Group>

      <Stack gap={4} mb={12}>
        <Text c="#1f1f1f" fz="0.88rem">
          You are about to transfer this request to another person in charge
        </Text>
        <Text c="#1f1f1f" fz="0.84rem">
          • The current assignee will lose access to this request.
        </Text>
        <Text c="#1f1f1f" fz="0.84rem">
          • The new assignee will take full ownership.
        </Text>
      </Stack>

      <Select
        mb="1.15rem"
        size="md"
        radius="md"
        placeholder="SELECT PERSON IN CHARGE"
        data={reassignOptions}
        value={reassignASId !== null ? String(reassignASId) : null}
        onChange={(val) => {
          const selectedOption = reassignOptions.find(
            (option) => option.value === val,
          );
          setReassignASId(val ? Number(val) : null);
          setReassignAS(selectedOption?.label ?? "");
        }}
        searchable
        nothingFoundMessage="No handlers found"
        rightSection={<Text c="#7c7c7c">›</Text>}
        styles={{
          input: {
            minHeight: "2.95rem",
            borderColor: "#c9c9c9",
            color: "#636363",
            fontSize: "0.83rem",
            fontWeight: 500,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            background: "#fdfdfd",
          },
          dropdown: {
            borderColor: "#c9c9c9",
          },
          option: {
            fontSize: "0.84rem",
          },
        }}
      />

      <Group grow>
        <Button
          h={42}
          radius="md"
          leftSection={<CheckCircle width={18} />}
          styles={{
            root: {
              background: "#4f8277",
              "&:hover": {
                background: "#446f65",
              },
            },
            label: {
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 500,
              letterSpacing: "0.01em",
            },
          }}
          tt="uppercase"
          onClick={() => {
            setReassignStatus("APPROVED");
            setReassignModalOpen(false);
            setReassignAcceptModalOpen(true);
          }}
          disabled={reassignASId === null}
        >
          Reassign
        </Button>
        <Button
          h={42}
          radius="md"
          tt="uppercase"
          styles={{
            root: {
              background: "#e3e3e3",
              "&:hover": {
                background: "#d7d7d7",
              },
            },
            label: {
              color: "#27324c",
              fontSize: "0.9rem",
              fontWeight: 500,
              letterSpacing: "0.01em",
            },
          }}
          onClick={() => {
            setReassignModalOpen(false);
          }}
        >
          Cancel
        </Button>
      </Group>
    </Modal>
  );
}
