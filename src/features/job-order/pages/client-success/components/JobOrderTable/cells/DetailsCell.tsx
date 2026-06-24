import { Table, Group, Stack, Text } from "@mantine/core";

export function DetailsCell({ row }: any) {
  return (
    <Table.Td style={{ maxWidth: "250px" }}>
      <Stack gap={2}>
        <Text fw={700}>{row.job_type}</Text>

        {row.job_type === "REGULATORY" ? (
          <Group gap={6}>
            <Text>Application Type</Text>
            <Text>{row.application_type}</Text>
          </Group>
        ) : (
          <>
            <Group gap={6}>
              <Text>{row.service_type}</Text>
              <Text>{row.transport_mode}</Text>
            </Group>

            <Group gap={6}>
              <Text>{row.origin}</Text>
              <Text>{row.destination}</Text>
            </Group>
          </>
        )}
      </Stack>
    </Table.Td>
  );
}