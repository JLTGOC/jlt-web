import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Add, Delete } from "@nine-thirty-five/material-symbols-react/rounded";

interface OptionDraft {
  id?: number;
  name: string;
}

interface DetailsConfigModalProps {
  opened: boolean;
  title: string;
  label: string;
  options: OptionDraft[];
  isDropdown: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onLabelChange: (value: string) => void;
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onSubmit: () => void;
}

export function DetailsConfigModal({
  opened,
  title,
  label,
  options,
  isDropdown,
  isSubmitting,
  onClose,
  onLabelChange,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onSubmit,
}: DetailsConfigModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered size="lg">
      <Stack>
        <TextInput
          label="FIELD LABEL"
          value={label}
          onChange={(event) => onLabelChange(event.currentTarget.value)}
        />

        {isDropdown && (
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={600}>OPTIONS</Text>
              <ActionIcon onClick={onAddOption} color="jltAccent.6">
                <Add />
              </ActionIcon>
            </Group>
            {options.map((option, index) => (
              <Group key={`option-${index}`} align="center">
                <TextInput
                  value={option.name}
                  onChange={(event) =>
                    onOptionChange(index, event.currentTarget.value)
                  }
                  style={{ flex: 1 }}
                  placeholder={`Option ${index + 1}`}
                />
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => onRemoveOption(index)}
                  disabled={options.length === 1}
                >
                  <Delete />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        )}

        <Button onClick={onSubmit} loading={isSubmitting}>
          Save
        </Button>
      </Stack>
    </Modal>
  );
}
