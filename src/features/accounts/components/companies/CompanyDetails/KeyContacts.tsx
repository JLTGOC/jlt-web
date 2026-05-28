import { Box, Button, Group, Text } from "@mantine/core";
import { Edit } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface KeyContactsProps {
  company?: import("../../../types/company.types").CompanyFullDetails | null;
  onEdit?: () => void;
}

export function KeyContacts({ company, onEdit }: KeyContactsProps) {
  const contacts = company?.keyContacts ?? {};
  const primary = contacts.primaryContact ?? {};
  const secondary = contacts.secondaryContact ?? {};
  const billing = contacts.billingContact ?? {};
  const list = [
    { label: "Primary Contact", ...primary },
    { label: "Secondary Contact", ...secondary },
    { label: "Billing Contact", ...billing },
  ];

  return (
    <Box className={styles.container}>
      {list.map(({ label, fullName, position, contactNumber, email }) => (
        <Box key={label} className={styles.contactBlock}>
          <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
            {label}
          </Text>
          <Box className={styles.contactSection}>
            <Box className={styles.nestedDetailRow}>
              <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
                Name
              </Text>
              <Text size="xs" fw={450} className={styles.detailValue}>
                {fullName ?? "N/A"}
              </Text>
            </Box>
            <Box className={styles.nestedDetailRow}>
              <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
                Position
              </Text>
              <Text size="xs" fw={450} className={styles.detailValue}>
                {position ?? "N/A"}
              </Text>
            </Box>
            <Box className={styles.nestedDetailRow}>
              <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
                Contact Number
              </Text>
              <Text size="xs" fw={450} className={styles.detailValue}>
                {contactNumber ?? "N/A"}
              </Text>
            </Box>
            <Box className={styles.nestedDetailRow}>
              <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
                Email
              </Text>
              <Text size="xs" fw={450} className={styles.detailValue}>
                {email ?? "N/A"}
              </Text>
            </Box>
          </Box>
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
          EDIT KEY CONTACTS
        </Button>
      </Group>
    </Box>
  );
}
