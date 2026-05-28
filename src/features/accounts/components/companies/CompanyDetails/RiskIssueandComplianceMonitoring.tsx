import { Box, Text, Divider, Button, Group } from "@mantine/core";
import { Edit } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface RiskIssueandComplianceMonitoringProps {
  company?: import("../../../types/company.types").CompanyFullDetails | null;
  onEdit?: () => void;
}

export function RiskIssueandComplianceMonitoring({ company, onEdit }: RiskIssueandComplianceMonitoringProps) {
  const risk = company?.riskIssueMonitoring ?? {};
  const fields = [
    { label: "Risk Monitoring Notes", value: risk.riskMonitoringNotes ?? "N/A" },
    { label: "Issue Tracking Notes", value: risk.issueTrackingNotes ?? "N/A" },
    { label: "Compliance Monitoring Notes", value: risk.complianceMonitoringNotes ?? "N/A" },
  ];

  return (
    <Box className={styles.container}>
      {fields.map(({ label, value }) => (
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
