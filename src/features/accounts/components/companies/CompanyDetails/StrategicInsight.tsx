import { Box, Text, Divider, Button, Group } from "@mantine/core";
import { Edit } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface StrategicInsightProps {
  onEdit?: () => void;
}

const strategicFields = [
  { label: "Growth", value: "N/A" },
  { label: "Expansion Plans", value: "N/A" },
  { label: "Competitors They Use", value: "N/A" },
  { label: "Opportunities for Up-Selling", value: "N/A" },
  { label: "CPRS Status", value: "N/A" },
];

export function StrategicInsight({ onEdit }: StrategicInsightProps) {
  return (
    <Box className={styles.container}>
      {strategicFields.map(({ label, value }) => (
        <Box key={label}>
          <Box className={styles.pricingRow}>
            <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
              {label}
            </Text>
            <Text size="xs" fw={450} className={styles.detailValue}>
              {value}
            </Text>
          </Box>
          <Divider mt="xs" />
        </Box>
      ))}
      <Group className={styles.actions} style={{ justifyContent: "center" }}>
        <Button
          variant="outline"
          radius="md"
          size="xs"
          className={styles.editButton}
          leftSection={<Edit width={24} height={24} style={{ color: "#0064E0" }} />}
          onClick={onEdit}
        >
          EDIT STRATEGIC INSIGHT
        </Button>
      </Group>
    </Box>
  );
}
