import { Badge, Center, Stack, Text } from "@mantine/core";

export function SubBillingInvoiceTable({
 /*page,
  perPage,
  onPageChange,
  onPerPageChange,*/
}: {
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}) {
  return (
    <Center py={60}>
      <Stack align="center" gap="md">
        <Badge size="lg" variant="light" color="yellow">
          Work in Progress
        </Badge>
        <Text size="lg" c="dimmed">
          Billing & Invoices module is coming soon
        </Text>
      </Stack>
    </Center>
  );
}
