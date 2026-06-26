import { Table, Anchor, Stack, Text } from "@mantine/core";
import { Link } from "react-router";

export function PreAlertCell({ row }: any) {
  return (
    <Table.Td style={{ maxWidth: "150px" }}>
      <Stack gap={2}>
        <Anchor
          component={Link}
          to={`/job-order/${row.id}`}
          c="#2563EB"
          fw={700}
        >
          {row.reference_number}
        </Anchor>

        <Text>{row.client}</Text>

        <Text>{row.company_name}</Text>
      </Stack>
    </Table.Td>
  );
}