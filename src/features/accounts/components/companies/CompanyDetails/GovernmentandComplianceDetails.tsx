import { Box, Text, Divider, Button, Group } from "@mantine/core";
import { Edit, Add } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface GovernmentandComplianceDetailsProps {
  onEdit?: () => void;
}

const complianceFields = [
  { label: "TIN", value: "N/A" },
  { label: "BIR Registration Number", value: "N/A" },
  { label: "Import Accreditation Number", value: "N/A" },
  { label: "Date Of Expiration", value: "N/A" },
  { label: "CPRS Status", value: "N/A" },
  { label: "Exporter Accreditation Number", value: "N/A" },
  { label: "Date Of Expiration", value: "N/A" },
];

const otherFields = [
  { label: "Special Permits (If Applicable)", value: "N/A" },
  { label: "Compliance Risk", value: "N/A" },
];

export function GovernmentandComplianceDetails({ onEdit }: GovernmentandComplianceDetailsProps) {
  return (
    <Box className={styles.container}>
      {complianceFields.map(({ label, value }) => (
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

      <Box>
        <Box className={styles.pricingRow} style={{ alignItems: "start" }}>
          <Box style={{ display: "grid", gap: 4 }}>
            <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel} style={{ whiteSpace: "nowrap" }}>
              Authorize Representative/s
            </Text>
            <Text size="xs" fw={450} className={styles.detailValue}>
              • N/A
            </Text>
          </Box>
          <Box style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <Button
              leftSection={<Add width={22} height={18} style={{ color: "#0064E0" }} />}
              variant="outline"
              radius="md"
              className={styles.smallEditButtonAR}
            >
              Authorize Representative
            </Button>
          </Box>
        </Box>
        <Divider mt="xs" />
      </Box>

      {otherFields.map(({ label, value }) => (
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
          EDIT GOVERNMENT & COMPLIANCE DETAILS
        </Button>
      </Group>
    </Box>
  );
}
