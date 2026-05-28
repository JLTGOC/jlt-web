import { Box, Text, Divider, Button, Group } from "@mantine/core";
import { Edit, Add } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface GovernmentandComplianceDetailsProps {
  company?: import("../../../types/company.types").CompanyFullDetails | null;
  onEdit?: () => void;
}

export function GovernmentandComplianceDetails({ company, onEdit }: GovernmentandComplianceDetailsProps) {
  const gov = company?.governmentCompliance ?? {};
  const fields = [
    { label: "TIN", value: gov.tin ?? "N/A" },
    { label: "BIR Registration Number", value: gov.birRegistrationNumber ?? "N/A" },
    { label: "Importer Accreditation Number", value: gov.importerAccreditationNumber ?? "N/A" },
    { label: "Importer Expiration Date", value: gov.importerExpirationDate ?? "N/A" },
    { label: "CPRS Status", value: gov.cprsStatus ?? "N/A" },
    { label: "Exporter Accreditation Number", value: gov.exporterAccreditationNumber ?? "N/A" },
    { label: "Exporter Expiration Date", value: gov.exporterExpirationDate ?? "N/A" },
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

      <Box>
        <Box className={styles.pricingRow} style={{ alignItems: "start" }}>
          <Box style={{ display: "grid", gap: 4 }}>
            <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel} style={{ whiteSpace: "nowrap" }}>
              Authorize Representative/s
            </Text>
            <Text size="xs" fw={450} className={styles.detailValue}>
              {gov.authorizedRepresentatives && gov.authorizedRepresentatives.length > 0
                ? `• ${gov.authorizedRepresentatives[0]}`
                : "• N/A"}
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

      <Box>
        <Box className={styles.pricingRow}>
          <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
            Special Permits (If Applicable)
          </Text>
          <Text size="xs" fw={450} className={styles.detailValue}>
            {gov.specialPermits ?? "N/A"}
          </Text>
        </Box>
        <Divider mt="xs" />
      </Box>

      <Box>
        <Box className={styles.pricingRow}>
          <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
            Compliance Risk
          </Text>
          <Text size="xs" fw={450} className={styles.detailValue}>
            {gov.complianceRisk ?? "N/A"}
          </Text>
        </Box>
        <Divider mt="xs" />
      </Box>

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
