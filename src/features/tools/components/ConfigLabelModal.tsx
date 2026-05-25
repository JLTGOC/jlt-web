import { Button, Modal, Stack, TextInput } from "@mantine/core";

interface ConfigLabelModalProps {
  opened: boolean;
  title: string;
  label: string;
  value: string;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ConfigLabelModal({
  opened,
  title,
  label,
  value,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}: ConfigLabelModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered size="lg">
      <Stack>
        <TextInput
          label={label}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
        />

        <Button onClick={onSubmit} loading={isSubmitting}>
          Save
        </Button>
      </Stack>
    </Modal>
  );
}
