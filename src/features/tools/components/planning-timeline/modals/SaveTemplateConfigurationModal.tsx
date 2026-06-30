import {
  Modal,
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  Text,
  Box,
} from "@mantine/core";
import { IconX, IconInfoCircle } from "@tabler/icons-react";

import { useServiceTypeEnums, } from "@/features/tools/hooks/usePlanningTimeline";
import { useTemplateStore } from "@/features/tools/store/LogisticsCreatePlanningTemplate";

interface SaveTemplateModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceType: string;
  modalState: {
    save: boolean;
    confirmSave: boolean;
    name: string;
    service_type_id: number;
  };
  setModalState: React.Dispatch<
    React.SetStateAction<{
      save: boolean;
      confirmSave: boolean;
      name: string;
      service_type_id: number;
    }>
  >;
}

export default function SaveTemplateConfigurationModal({
  opened,
  onClose,
  onConfirm,
  serviceType,
  modalState,
  setModalState,
}: SaveTemplateModalProps) {
  const { data } = useServiceTypeEnums(serviceType);

   const { templateConfiguration, setTemplateConfiguration } =
      useTemplateStore();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="SAVE TEMPLATE"
      centered
      size="lg"
      withCloseButton
      closeButtonProps={{
        icon: <IconX size={18} />,
      }}
    >
      <Text size="sm" c="dimmed" mb="md">
        Rename your template and add description to help others understand its
        purpose.
      </Text>

      <Stack gap="md">
        {/* Template Name */}
        <TextInput
          label="Template Name*"
          placeholder="Enter template name"
          value={templateConfiguration.name}
          onChange={(e) =>
            setTemplateConfiguration((prev) => ({ ...prev, name: e.currentTarget.value }))
          }
        />

        {/* Service Type */}
        <Select
          label="Service Type*"
          placeholder="Select Service"
          rightSectionPointerEvents="none"
          data={(data ?? []).map((item: any) => ({
            value: String(item.id),
            label: String(item.name ?? ""),
          }))}
          value={
            modalState.service_type_id
              ? String(modalState.service_type_id)
              : null
          }
          onChange={(value) =>{
            setModalState((prev) => ({
              ...prev,
              service_type_id: Number(value),
            }));
            setTemplateConfiguration((prev) => ({
              ...prev, service_type_id: Number(value)
            }))}
          }
        />

        {/* Info Box */}
        <Box
          style={{
            display: "flex",
            gap: 10,
            padding: 12,
            borderRadius: 8,
            background: "#EAF2FF",
            alignItems: "flex-start",
          }}
        >
          <IconInfoCircle size={18} color="#2B6EF2" />
          <Text size="xs" c="#2B6EF2">
            Saving this template will update it for all future use. <br />
            All associated phases, processes and tasks will be saved.
          </Text>
        </Box>

        {/* Buttons */}
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            CANCEL
          </Button>

          <Button color="dark" onClick={onConfirm}>SAVE CHANGES</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
