import { Select, Group, Text } from "@mantine/core";

interface ShowEntriesControlProps {
  perPage: number;
  onPerPageChange: (value: number) => void;
}

export function ShowEntriesControl({
  perPage,
  onPerPageChange,
}: ShowEntriesControlProps) {
  return (
    <Group gap={4} mb="xs">
      <Text size="sm">Show</Text>
      <Select
        data={[
          { value: "10", label: "10" },
          { value: "25", label: "25" },
          { value: "50", label: "50" },
        ]}
        value={String(perPage)}
        onChange={(val) => val && onPerPageChange(Number(val))}
        w="4.375rem"
        size="xs"
      />
      <Text size="sm">entries</Text>
    </Group>
  );
}
