import { Box, Button, Group, Text } from "@mantine/core";
import { Edit } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface BasicInformationProps {
  company?: import("../../../types/company.types").CompanyFullDetails | null;
  onEdit?: () => void;
}

const fieldRows = (summary: import("../../../types/company.types").CompanySummary) => [
  { label: "Trade Name", value: summary.tradeName ?? summary.companyName ?? "N/A" },
  { label: "Transaction Type", value: summary.transactionType ?? "N/A" },
  { label: "Client Classification", value: summary.clientClassification ?? "N/A" },
  { label: "Company Type", value: summary.companyType ?? "N/A" },
  { label: "Industry", value: summary.industry ?? "N/A" },
  { label: "Business Type", value: summary.businessType ?? "N/A" },
  { label: "Business Registration No. (SEC/DTI)", value: summary.businessRegistrationNumber ?? "N/A" },
  { label: "Website/Online Presence", value: summary.website ?? "N/A" },
  { label: "Years In Operation", value: summary.yearsInOperation ?? "N/A" },
  { label: "Date Of Activation", value: summary.dateOfActivation ?? "N/A" },
];

export function BasicInformation({ company, onEdit }: BasicInformationProps) {
  const summary = company?.summary ?? ({} as import("../../../types/company.types").CompanySummary);
  return (
    <Box className={styles.container}>
      {fieldRows(summary).map(({ label, value }) => (
        <Box key={label} className={styles.detailRow}>
          <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
            {label}
          </Text>
          <Text size="xs" fw={450} className={styles.detailValue}>
            {value}
          </Text>
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
          EDIT BASIC INFORMATION
        </Button>
      </Group>
    </Box>
  );
}