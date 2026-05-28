import { Box, Text, Divider, Button, Group } from "@mantine/core";
import { Edit } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface OperationalInstructionsProps {
  onEdit?: () => void;
}

const operationalFields = [
  { label: "Preferred Communication Style", value: "N/A" },
  { label: "Response Time Expectation", value: "N/A" },
  { label: "Decision-Making Process", value: "N/A" },
  { label: "Client Specific SOP", value: "N/A" },
  { label: "Approval Workflow", value: "N/A" },
  { label: "Required Pre-Alert Details", value: "N/A" },
  { label: "Special Instructions", value: "N/A" },
];

export function OperationalInstructions({ onEdit }: OperationalInstructionsProps) {
  return (
    <Box className={styles.container}>
      {operationalFields.map(({ label, value }) => (
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
          className={styles.editButton}
          leftSection={<Edit width={24} height={24} style={{ color: "#0064E0" }} />}
          onClick={onEdit}
        >
          EDIT OPERATIONAL INSTRUCTIONS
        </Button>
      </Group>
    </Box>
  );
}
