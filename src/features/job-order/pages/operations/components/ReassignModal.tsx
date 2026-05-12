import { Button, Group, Modal, Select, Text } from "@mantine/core";
import { CheckCircle } from "@nine-thirty-five/material-symbols-react/outlined";

type Reassignprops = {
  reassignModalOpen: boolean;
  setReassignModalOpen: (open: boolean) => void;
  selectedQuotation: any;
  reassignPersonels: any[];
  reassignSpecificDetails: any;
  setReassignStatus: (status: string) => void;
  reassignOPSId: number | null;
  setReassignOPSId: (id: number | null) => void;
  setReassignAcceptModalOpen: (open: boolean) => void;
  reassignOPS: string | null;
  setReassignRejectModalOpen: (open: boolean) => void;
  setReassignOPS: (as: string) => void;
  onClose: () => void;
  // onConfirm?: (status: string, asId: number) => void;
};

export default function ReassignModal({
  reassignModalOpen,
  setReassignModalOpen,
  setReassignAcceptModalOpen,
  setReassignRejectModalOpen,
  selectedQuotation,
  reassignPersonels,
  reassignSpecificDetails,
  setReassignStatus,
  reassignOPSId,
  setReassignOPSId,
  reassignOPS,
  setReassignOPS,
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
      <Group gap={6} align="flex-start" mb={4}>
        <Text c="#7b7b7b" fz=".9rem" w={"50%"}>
          Quotation Request Ref. No
        </Text>
        <Text c="#1e3049" fz=".9rem" fw={600}>
          {selectedQuotation?.reference_number ?? "-"}
        </Text>
      </Group>
      <Group gap={6} align="flex-start" mb={4}>
        <Text c="#7b7b7b" fz=".9rem" w={"50%"}>
          From:
        </Text>
        <Text c="#1e3049" fz=".9rem" fw={500}>
          {selectedQuotation?.assigned_to ??
            selectedQuotation?.prepared_by ??
            "-"}
        </Text>
      </Group>
      <Group gap={6} align="flex-start" mb={4}>
        <Text c="#7b7b7b" fz=".9rem" w={"50%"}>
          Reason :
        </Text>
        <Text c="#1e3049" fz=".9rem" fw={500}>
          {reassignSpecificDetails?.reason ?? "-"}
        </Text>
      </Group>
      <Text c="#7b7b7b" fz="1rem" mb={2}>
        Additional Details
      </Text>
      <Text c="#1e3049" fz=".9rem" lh={1.4} mb="1rem">
        {reassignSpecificDetails?.additional_details ?? "-"}
      </Text>

      <Select
        mb=".9rem"
        size="md"
        radius="sm"
        placeholder="Select handler"
        data={reassignOptions}
        value={reassignOPSId !== null ? String(reassignOPSId) : null}
        onChange={(val) => {
          const selectedOption = reassignOptions.find(
            (option) => option.value === val,
          );
          setReassignOPSId(val ? Number(val) : null);
          setReassignOPS(selectedOption?.label ?? "");
        }}
        error={selectedQuotation?.assigned_to === reassignOPS}
        searchable
        nothingFoundMessage="No handlers found"
      />
      

      <Group grow>
        <Button
          h={40}
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
          }}
          disabled={reassignOPSId === null && reassignOPSId !== null && String(reassignOPSId) === selectedQuotation?.ops_id?.toString()}
        >
          Reassign
        </Button>
        <Button
          h={40}
          radius="md"
          tt="uppercase"
          styles={{
            root: {
              background: "#b24955",
              "&:hover": {
                background: "#9e3d48",
              },
            },
            label: {
                color: "#ffffff",
                fontSize: ".9rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
              },
          }}
          onClick={() => {
            setReassignStatus("REJECTED");
            setReassignModalOpen(false);
            setReassignRejectModalOpen(true);
          }}
        >
          Decline
        </Button>
      </Group>
    </Modal>
  );
}
