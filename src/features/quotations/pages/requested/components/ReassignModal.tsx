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
  reassignSpecificDetails,
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
      title="REASSIGNMENT REQUEST"
      centered
      size={620}
      overlayProps={{ color: "#1b2348", opacity: 0.55 }}
      styles={{
        content: {
          borderRadius: "0.5rem",
          overflow: "hidden",
          background: "#ffffff",
        },
        header: {
          background: "#f0f0f0",
          borderBottom: "1px solid #dedede",
          minHeight: "3.2rem",
          padding: "0.7rem 1.4rem",
        },
        title: {
          color: "#16345b",
          fontSize: "1.1rem",
          fontWeight: 700,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        },
        close: {
          color: "#1e243b",
          width: "2rem",
          height: "2rem",
        },
        body: {
          padding: "1.1rem 1.4rem 1.4rem",
        },
      }}
    >
      <Stack gap={6} mb={16}>
        <Group gap={10} align="flex-start">
          <Text c="#7a7a7a" fz="0.78rem" w={190}>
            Quotation Request Ref. No
          </Text>
          <Text c="#1e3049" fz="0.82rem" fw={700}>
            {selectedQuotation?.reference_number ?? "-"}
          </Text>
        </Group>
        <Group gap={10} align="flex-start">
          <Text c="#7a7a7a" fz="0.78rem" w={190}>
            From:
          </Text>
          <Text c="#1e3049" fz="0.82rem" fw={600}>
            {reassignSpecificDetails?.account_specialist ?? "-"}
          </Text>
        </Group>
        <Group gap={10} align="flex-start">
          <Text c="#7a7a7a" fz="0.78rem" w={190}>
            Reason:
          </Text>
          <Text c="#1e3049" fz="0.82rem" fw={700}>
            {reassignSpecificDetails?.reason ?? "-"}
          </Text>
        </Group>
        <Group gap={10} align="flex-start">
          <Text c="#7a7a7a" fz="0.78rem" w={190}>
            Additional Details
          </Text>
          <Text c="#1e3049" fz="0.82rem" lh={1.4}>
            {reassignSpecificDetails?.additional_details ?? "-"}
          </Text>
        </Group>
      </Stack>

      <Select
        mb="1.2rem"
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
            minHeight: "2.9rem",
            borderColor: "#c9c9c9",
            color: "#6a6a6a",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            background: "#ffffff",
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
              fontSize: "0.88rem",
              fontWeight: 600,
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
              background: "#b24a53",
              "&:hover": {
                background: "#a0424a",
              },
            },
            label: {
              color: "#ffffff",
              fontSize: "0.88rem",
              fontWeight: 600,
              letterSpacing: "0.01em",
            },
          }}
          onClick={() => {
            setReassignStatus("REJECTED");
            setReassignModalOpen(false);
            _setReassignRejectModalOpen(true);
          }}
        >
          Decline
        </Button>
      </Group>
    </Modal>
  );
}
