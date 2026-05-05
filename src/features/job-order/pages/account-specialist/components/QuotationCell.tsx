import { Anchor, Group, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

interface QuotationCellProps {
  reference?: string;
  id?: string | number;
}

export function QuotationCell({ reference, id }: QuotationCellProps) {
  if (!reference)
    return (
      <Text size="sm" c="dimmed">
        —
      </Text>
    );
  return (
    <Anchor
      href={`/quotations/${id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Group gap={4} align="center">
        <Text span fw={500} size="sm">
          {reference}
        </Text>
        <IconExternalLink size={14} stroke={1.5} />
      </Group>
    </Anchor>
  );
}
