import {
  ActionIcon,
  Group,
  MultiSelect,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Delete } from "@nine-thirty-five/material-symbols-react/rounded";
import type { TemplateChargeDraft } from "../types/templateForm";

type ReceiptOption = {
  value: string;
  label: string;
};

interface TemplateChargesListProps {
  charges: TemplateChargeDraft[];
  receiptOptions: ReceiptOption[];
  onChange: (
    key: number,
    updates: Partial<Pick<TemplateChargeDraft, "name" | "receipt_option_ids">>,
  ) => void;
  onDelete: (key: number) => void;
}

export function TemplateChargesList({
  charges,
  receiptOptions,
  onChange,
  onDelete,
}: TemplateChargesListProps) {
  return (
    <Stack gap="sm">
      {charges.map((charge, index) => (
        <Paper
          key={charge.key}
          p="sm"
          radius="md"
          withBorder
          bg="var(--mantine-color-gray-0)"
        >
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Text size="sm" fw={600} c="jltBlue.8">
                Charge Section {index + 1}
              </Text>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => onDelete(charge.key)}
                disabled={charges.length === 1}
              >
                <Delete />
              </ActionIcon>
            </Group>

            <Stack style={{ flex: 1 }} gap={8}>
              <Text size="xs" c="dimmed" fw={500}>
                Table Name
              </Text>
              <TextInput
                placeholder="TABLE NAME"
                value={charge.name}
                onChange={(event) =>
                  onChange(charge.key, {
                    name: event.currentTarget.value,
                  })
                }
              />

              <Text size="xs" c="dimmed" fw={500} mt={4}>
                Receipt Charges
              </Text>
              <MultiSelect
                placeholder="SELECT RECEIPT CHARGES"
                data={receiptOptions}
                value={charge.receipt_option_ids}
                onChange={(value) =>
                  onChange(charge.key, {
                    receipt_option_ids: value,
                  })
                }
                searchable
              />
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
