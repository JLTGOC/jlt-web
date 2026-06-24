import { Table, Group, Text, Stack } from "@mantine/core";

export function ServiceTypeCell({ row }: any) {
  return (
    <Table.Td>
      <Stack gap={2}>
        <Text>{row.service_level}</Text>

        <Group gap={6}>
          <Text>BL No.</Text>
          <Text>{row.bl_no}</Text>
        </Group>
      </Stack>
    </Table.Td>
  );
}