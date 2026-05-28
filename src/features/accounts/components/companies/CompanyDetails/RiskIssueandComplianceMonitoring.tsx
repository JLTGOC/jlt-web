import { Box, Text, Divider, Button, Group } from "@mantine/core";
import { Edit } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface RiskIssueandComplianceMonitoringProps {
  onEdit?: () => void;
}

const riskFields = [
  { label: "Past Issues/Disputes", value: "N/A" },
  { label: "Penalties/Violation History", value: "N/A" },
  { label: "Customs Flags/Alerts", value: "N/A" },
  { label: "Payment Delays History", value: "N/A" },
  { label: "Claims/Damage Records", value: "N/A" },
  { label: "Notes/Remarks/Reports", value: "N/A" },
];

export function RiskIssueandComplianceMonitoring({ onEdit }: RiskIssueandComplianceMonitoringProps) {
  return (
    <Box className={styles.container}>
      {riskFields.map(({ label, value }) => (
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
          EDIT RISK, ISSUES AND COMPLIANCE MONITORING
        </Button>
      </Group>
    </Box>
  );
}
