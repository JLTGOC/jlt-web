import { Box, Text, Group, Anchor, UnstyledButton } from "@mantine/core";
import { Link } from "react-router";
import { ArrowBack } from "@nine-thirty-five/material-symbols-react/rounded";

type JobOrderDetailHeaderProps = {
  referenceNumber: string;
  quotationReference?: string | null;
  quotationId?: string | number | null;
  subTitle?: boolean;
  onBack: () => void;
};

export function JobOrderDetailHeader({
  referenceNumber,
  quotationReference,
  quotationId,
  subTitle,
  onBack,
}: JobOrderDetailHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start">
      <Group>
        <UnstyledButton onClick={onBack} c="jltBlue">
          <ArrowBack width={24} height={24} />
        </UnstyledButton>
        <Box>
          <Text
            size="1.125rem"
            fw={700}
            c="var(--mantine-color-jltBlue-9)"
            lh={1.1}
          >
            {referenceNumber}
          </Text>
          {!!subTitle && <Text size="sm" c="dimmed" tt="uppercase" lts="0.06em" mt="0.125rem">
            Job Order
          </Text>}
          
        </Box>
      </Group>

      {quotationReference &&
        quotationId !== null &&
        quotationId !== undefined && (
          <Box
            p="0.75rem 1rem"
            style={{
              border: "1px solid var(--mantine-color-gray-3)",
              borderRadius: "0.5rem",
              textAlign: "right",
              minWidth: "12rem",
              backgroundColor: "#fff",
            }}
          >
            <Text size="xs" c="dimmed" tt="uppercase" lts="0.06em" mb="0.25rem">
              From Accepted Quotation
            </Text>
            <Anchor
              component={Link}
              to={`/quotations/accepted/${String(quotationId)}`}
              fw={600}
              size="sm"
            >
              {quotationReference}
            </Anchor>
          </Box>
        )}
    </Group>
  );
}
