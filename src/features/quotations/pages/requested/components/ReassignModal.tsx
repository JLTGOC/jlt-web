import { Button, Group, Modal, Select, Text } from "@mantine/core";
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
  setReassignAS: (as: string) => void;
  // onConfirm?: (status: string, asId: number) => void;
};

export default function ReassignModal({
  reassignModalOpen,
  setReassignModalOpen,
  selectedQuotation,
  reassignPersonels,
  reassignSpecificDetails,
  setReassignStatus,
  reassignASId,
  setReassignASId,
  setReassignAcceptModalOpen,
  setReassignAS,
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
      onClose={() => {
        setReassignModalOpen(false);
        setReassignASId(null);
        setReassignAcceptModalOpen(false);
      }}
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
      <Group gap={6} align="flex-start" mb={4}>
        <Text c="#7b7b7b" fz="1rem" w={170}>
          Quotation Request Ref. No
        </Text>
        <Text c="#1e3049" fz="1rem" fw={600}>
          {selectedQuotation?.reference_number ?? "-"}
        </Text>
      </Group>
      <Group gap={6} align="flex-start" mb={4}>
        <Text c="#7b7b7b" fz="1rem" w={170}>
          From:
        </Text>
        <Text c="#1e3049" fz="1rem" fw={500}>
          {selectedQuotation?.account_specialist ??
            selectedQuotation?.prepared_by ??
            "-"}
        </Text>
      </Group>
      <Group gap={6} align="flex-start" mb={4}>
        <Text c="#7b7b7b" fz="1rem" w={170}>
          Reason :
        </Text>
        <Text c="#1e3049" fz="1rem" fw={500}>
          {reassignSpecificDetails?.reason ?? "-"}
        </Text>
      </Group>
      <Text c="#7b7b7b" fz="1rem" mb={2}>
        Additional Details
      </Text>
      <Text c="#1e3049" fz="1rem" lh={1.4} mb="1rem">
        {reassignSpecificDetails?.additional_details ?? "-"}
      </Text>

      <Select
        mb="1.25rem"
        size="md"
        radius="sm"
        placeholder="Select handler"
        data={reassignOptions}
        value={reassignASId !== null ? String(reassignASId) : null}
        onChange={(val) => {
          const selectedOption = reassignOptions.find((option) => option.value === val);
          setReassignASId(val ? Number(val) : null);
          setReassignAS(selectedOption?.label ?? "");
        }}
        searchable
        nothingFoundMessage="No handlers found"
      />

      <Group grow>
        <Button
          h={48}
          radius="md"
          leftSection={<CheckCircle width={18} />}
          styles={{
            root: {
              background: "#4a7f72",
              "&:hover": {
                background: "#3f6d62",
              },
            },
          }}
          tt="uppercase"
          onClick={() => {
            setReassignStatus("APPROVED");
            setReassignModalOpen(false);
            setReassignAcceptModalOpen(true);
            // if (reassignASId !== null) {
            //   onConfirm?.(reassignStatus, reassignASId);
            // }
          }}
          disabled={reassignASId === null}
        >
          Reassign
        </Button>
        <Button
          h={48}
          radius="md"
          tt="uppercase"
          styles={{
            root: {
              background: "#b24955",
              "&:hover": {
                background: "#9e3d48",
              },
            },
          }}
          onClick={() => setReassignModalOpen(false)}
        >
          Decline
        </Button>
      </Group>
    </Modal>
  );
}
