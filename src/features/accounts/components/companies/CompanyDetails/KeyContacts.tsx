import { Box, Button, Group, Text } from "@mantine/core";
import { Edit } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface KeyContactsProps {
  onEdit?: () => void;
}

const contacts = [
  {
    label: "Primary Contact",
    name: "Ana Santos",
    position: "Account Manager",
    phone: "+63 912 345 6789",
    email: "ana.santos@jltglobal.com",
  },
  {
    label: "Secondary Contact",
    name: "Miguel Reyes",
    position: "Operations Lead",
    phone: "+63 927 654 3210",
    email: "miguel.reyes@jltglobal.com",
  },
  {
    label: "Billing Contact",
    name: "Leila Cruz",
    position: "Finance Officer",
    phone: "+63 917 888 1122",
    email: "leila.cruz@jltglobal.com",
  },
];

export function KeyContacts({ onEdit }: KeyContactsProps) {
  return (
    <Box className={styles.container}>
      {contacts.map(({ label, name, position, phone, email }) => (
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
                {name}
              </Text>
            </Box>
            <Box className={styles.nestedDetailRow}>
              <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
                Position
              </Text>
              <Text size="xs" fw={450} className={styles.detailValue}>
                {position}
              </Text>
            </Box>
            <Box className={styles.nestedDetailRow}>
              <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
                Contact Number
              </Text>
              <Text size="xs" fw={450} className={styles.detailValue}>
                {phone}
              </Text>
            </Box>
            <Box className={styles.nestedDetailRow}>
              <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
                Email
              </Text>
              <Text size="xs" fw={450} className={styles.detailValue}>
                {email}
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
