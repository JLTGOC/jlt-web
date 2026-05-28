import { Box, Button, Group, Text } from "@mantine/core";
import { Edit } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface BasicInformationProps {
  companyName?: string | null;
  classification?: string | null;
  onEdit?: () => void;
}

const fieldRows = [
  { label: "Trade Name", valueKey: "companyName" },
  { label: "Transaction Type", value: "Import / Export" },
  { label: "Client Classification", valueKey: "classification" },
  { label: "Company Type", value: "Corporate" },
  { label: "Industry", value: "Logistics" },
  { label: "Business Type", value: "Services" },
  { label: "Business Registration No. (SEC/DTI)", value: "SEC 123456" },
  { label: "Website/Online Presence", value: "www.jltglobal.com" },
  { label: "Years In Operation", value: "5 years" },
  { label: "Date Of Activation", value: "01 Jan 2020" },
];

export function BasicInformation({ companyName, classification, onEdit }: BasicInformationProps) {
  return (
    <Box className={styles.container}>
      {fieldRows.map(({ label, value, valueKey }) => {
        const displayValue = valueKey === "companyName" ? companyName ?? "N/A" :
          valueKey === "classification" ? classification ?? "N/A" : value;

        return (
          <Box key={label} className={styles.detailRow}>
            <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
              {label}
            </Text>
            <Text size="xs" fw={450} className={styles.detailValue}>
              {displayValue}
            </Text>
          </Box>
        );
      })}

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