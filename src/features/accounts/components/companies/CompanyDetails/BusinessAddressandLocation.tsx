import { Box, Text, Divider, Button, Group } from "@mantine/core";
import { Edit, Add } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface BusinessAddressandLocationProps {
  company?: import("../../../types/company.types").CompanyFullDetails | null;
  onEdit?: () => void;
}

export function BusinessAddressandLocation({ company, onEdit }: BusinessAddressandLocationProps) {
  const addr = company?.address ?? {};
  const registeredAddress = addr.registeredAddress ?? "N/A";
  const officeAddress = addr.officeAddress ?? "N/A";
  const warehouseAddresses = addr.warehouseAddresses ?? [];
  const deliveryAddresses = addr.deliveryAddresses ?? [];
  const port = addr.portOfUsualEntryExit ?? "N/A";
  const countryOrigin = addr.countryOfOrigin ?? "N/A";
  const countryDestination = addr.countryOfDestination ?? "N/A";

  return (
    <Box className={styles.container}>
      <Box>
        <Box className={styles.pricingRow}>
          <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
            Registered Address
          </Text>
          <Text size="xs" fw={450} className={styles.detailValue}>
            {registeredAddress}
          </Text>
        </Box>
        <Divider mt="xs" />
      </Box>

      <Box>
        <Box className={styles.pricingRow}>
          <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
            Office Address
          </Text>
          <Text size="xs" fw={450} className={styles.detailValue}>
            {officeAddress}
          </Text>
        </Box>
        <Divider mt="xs" />
      </Box>

      <Box>
        <Box className={styles.pricingRow} style={{ alignItems: "start" }}>
          <Box style={{ display: "grid", gap: 4 }}>
            <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap" }}>
              <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel} style={{ whiteSpace: "nowrap" }}>
                Warehouse Addresses
              </Text>
              <Text c="#7a808a" fz="0.75rem" style={{ whiteSpace: "nowrap" }}>
                ({warehouseAddresses.length})
              </Text>
            </Box>
            <Text size="xs" fw={450} className={styles.detailValue}>
              {warehouseAddresses.length > 0 ? `• ${warehouseAddresses[0]}` : "N/A"}
            </Text>
          </Box>
          <Box style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <Button
              leftSection={<Add width={18} height={18} style={{ color: "#0064E0" }} />}
              variant="outline"
              radius="md"
              className={styles.smallEditButton}
            >
              Warehouse
            </Button>
          </Box>
        </Box>
        <Divider mt="xs" />
      </Box>

      <Box>
        <Box className={styles.pricingRow} style={{ alignItems: "start" }}>
          <Box style={{ display: "grid", gap: 4 }}>
            <Box style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap" }}>
              <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel} style={{ whiteSpace: "nowrap" }}>
                Delivery Addresses
              </Text>
              <Text c="#7a808a" fz="0.75rem" style={{ whiteSpace: "nowrap" }}>
                ({deliveryAddresses.length})
              </Text>
            </Box>
            <Text size="xs" fw={450} className={styles.detailValue}>
              {deliveryAddresses.length > 0 ? `• ${deliveryAddresses[0]}` : "N/A"}
            </Text>
          </Box>
          <Box style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <Button
              leftSection={<Add width={18} height={18} style={{ color: "#0064E0" }} />}
              variant="outline"
              radius="md"
              className={styles.smallEditButton}
            >
              Deliver
            </Button>
          </Box>
        </Box>
        <Divider mt="xs" />
      </Box>

      <Box>
        <Box className={styles.pricingRow}>
          <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
            Port Of Usual Entry/Exit
          </Text>
          <Text size="xs" fw={450} className={styles.detailValue}>
            {port}
          </Text>
        </Box>
        <Divider mt="xs" />
      </Box>

      <Box>
        <Box className={styles.pricingRow}>
          <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
            Country of Origin (For Imports)
          </Text>
          <Text size="xs" fw={450} className={styles.detailValue}>
            {countryOrigin}
          </Text>
        </Box>
        <Divider mt="xs" />
      </Box>

      <Box>
        <Box className={styles.pricingRow}>
          <Text c="#7a808a" fz="0.75rem" className={styles.detailLabel}>
            Country of Destination (For Exports)
          </Text>
          <Text size="xs" fw={450} className={styles.detailValue}>
            {countryDestination}
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
          EDIT BUSINESS ADDRESS & LOCATION
        </Button>
      </Group>
    </Box>
  );
}
