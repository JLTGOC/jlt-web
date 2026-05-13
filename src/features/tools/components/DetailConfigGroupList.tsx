import { Box, Checkbox, Stack, Text } from "@mantine/core";
import type { DetailConfigResource } from "../api/details-configs.service";

type DetailConfigGroup = {
  id: string;
  label: string;
  items: DetailConfigResource[];
};

interface DetailConfigGroupListProps {
  groups: DetailConfigGroup[];
  selectedDetailIds: number[];
  onToggle: (id: number, checked: boolean) => void;
}

export function DetailConfigGroupList({
  groups,
  selectedDetailIds,
  onToggle,
}: DetailConfigGroupListProps) {
  const visibleGroups = groups.filter((group) => group.items.length > 0);

  if (visibleGroups.length === 0) {
    return (
      <Text size="xs" c="dimmed">
        No detail configurations available.
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      {visibleGroups.map((group) => (
        <Box key={group.id}>
          <Text size="xs" fw={600} c="dimmed" mb={4}>
            {group.label}
          </Text>
          <Stack gap={6}>
            {group.items.map((config) => (
              <Checkbox
                key={config.id}
                label={config.label}
                checked={selectedDetailIds.includes(config.id)}
                onChange={(event) =>
                  onToggle(config.id, event.currentTarget.checked)
                }
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
