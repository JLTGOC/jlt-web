import { Box, Text, Divider, Button, Group } from "@mantine/core";
import { Edit, Add } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface BusinessAddressandLocationProps {
  onEdit?: () => void;
}

const addressFields = [
  { label: "Registered Address", value: "N/A" },
  { label: "Office Address", value: "N/A" },
];

const groupedAddressFields = [
  { label: "Warehouse Addresses", value: "N/A", count: 0, buttonLabel: "Warehouse" },
  { label: "Delivery Addresses", value: "N/A", count: 0, buttonLabel: "Deliver" },
];

const otherFields = [
  { label: "Port Of Usual Entry/Exit", value: "N/A" },
  { label: "Country of Origin (For Imports)", value: "N/A" },
  { label: "Country of Destination (For Exports)", value: "N/A" },
];

export function BusinessAddressandLocation({ onEdit }: BusinessAddressandLocationProps) {
  return (
    <Box className={styles.container}>
      {addressFields.map(({ label, value }) => (
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

      {groupedAddressFields.map(({ label, value, count, buttonLabel }) => (
        <Box key={label}>
          <Box className={styles.pricingRow} style={{ alignItems: "start" }}>
            <Box style={{ display: "grid", gap: 4 }}>
              <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap" }}>
                <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel} style={{ whiteSpace: "nowrap" }}>
                  {label}
                </Text>
                <Text c="#7a808a" fz="0.75rem" style={{ whiteSpace: "nowrap" }}>
                  ({count})
                </Text>
              </Box>
              <Text size="xs" fw={450} className={styles.detailValue}>
                • {value}
              </Text>
            </Box>
            <Box style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
              <Button
                leftSection={<Add width={18} height={18} style={{ color: "#0064E0" }} />}
                variant="outline"
                radius="md"
                className={styles.smallEditButton}
              >
                {buttonLabel}
              </Button>
            </Box>
          </Box>
          {label !== "Warehouse Addresses" ? <Divider mt="xs" /> : null}
        </Box>
      ))}

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
          EDIT BUSINESS ADDRESS & LOCATION
        </Button>
      </Group>
    </Box>
  );
}
