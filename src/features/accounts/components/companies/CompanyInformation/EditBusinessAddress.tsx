// src/features/accounts/components/companies/CompanyInformation/EditBusinessAddress.tsx
import { useState, useEffect } from "react";
import { Paper, Text, TextInput, Group, Button, Box } from "@mantine/core";
import { Add } from "@nine-thirty-five/material-symbols-react/outlined";
import type {
  CompanyFullDetails,
  CompanyAddressSummary,
} from "@/features/accounts/types/company.types";

interface EditBusinessAddressProps {
  company: CompanyFullDetails | null;
  onChange?: (address: CompanyAddressSummary) => void;
}

interface FormData {
  registeredAddress: string;
  officeAddress: string;
  warehouseAddresses: string[];
  deliveryAddresses: string[];
  warehouseInput: string;
  deliveryInput: string;
  portOfUsualEntryExit: string;
  countryOfOrigin: string;
  countryOfDestination: string;
}

const toAddressSummary = (data: FormData): CompanyAddressSummary => ({
  registeredAddress: data.registeredAddress || null,
  officeAddress: data.officeAddress || null,
  warehouseAddresses: data.warehouseAddresses,
  deliveryAddresses: data.deliveryAddresses,
  portOfUsualEntryExit: data.portOfUsualEntryExit || null,
  countryOfOrigin: data.countryOfOrigin || null,
  countryOfDestination: data.countryOfDestination || null,
});

export function EditBusinessAddress({ company, onChange }: EditBusinessAddressProps) {
  const [formData, setFormData] = useState<FormData>({
    registeredAddress: "",
    officeAddress: "",
    warehouseAddresses: [],
    deliveryAddresses: [],
    warehouseInput: "",
    deliveryInput: "",
    portOfUsualEntryExit: "",
    countryOfOrigin: "",
    countryOfDestination: "",
  });

  useEffect(() => {
    if (company?.address) {
      const nextFormData: FormData = {
        registeredAddress: company.address.registeredAddress || "",
        officeAddress: company.address.officeAddress || "",
        warehouseAddresses: company.address.warehouseAddresses || [],
        deliveryAddresses: company.address.deliveryAddresses || [],
        warehouseInput: "",
        deliveryInput: "",
        portOfUsualEntryExit: company.address.portOfUsualEntryExit || "",
        countryOfOrigin: company.address.countryOfOrigin || "",
        countryOfDestination: company.address.countryOfDestination || "",
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(nextFormData);
      onChange?.(toAddressSummary(nextFormData));
    }
  }, [company, onChange]);

  const handleFieldChange = (field: keyof FormData, value: string) => {
    const nextFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(nextFormData);
    onChange?.(toAddressSummary(nextFormData));
  };

  const addWarehouseAddress = () => {
    if (!formData.warehouseInput.trim()) {
      return;
    }
    const nextFormData = {
      ...formData,
      warehouseAddresses: [...formData.warehouseAddresses, formData.warehouseInput.trim()],
      warehouseInput: "",
    };
    setFormData(nextFormData);
    onChange?.(toAddressSummary(nextFormData));
  };

  const addDeliveryAddress = () => {
    if (!formData.deliveryInput.trim()) {
      return;
    }
    const nextFormData = {
      ...formData,
      deliveryAddresses: [...formData.deliveryAddresses, formData.deliveryInput.trim()],
      deliveryInput: "",
    };
    setFormData(nextFormData);
    onChange?.(toAddressSummary(nextFormData));
  };

  return (
    <Paper p="lg">
      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Registered Address</Text>
          <TextInput
            placeholder="Enter registered address"
            value={formData.registeredAddress}
            onChange={(e) => handleFieldChange("registeredAddress", e.currentTarget.value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Office Address</Text>
          <TextInput
            placeholder="Enter office address"
            value={formData.officeAddress}
            onChange={(e) => handleFieldChange("officeAddress", e.currentTarget.value)}
          />
        </div>
      </Group>

      <Box style={{ marginBottom: "1rem" }}>
        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Text size="sm" fw={500}>Warehouse Addresses</Text>
          <Button
            leftSection={<Add width={18} height={18} style={{ color: "#0064E0" }} />}
            variant="outline"
            radius="md"
            onClick={addWarehouseAddress}
          >
            Add Warehouse
          </Button>
        </Box>

        <Group mt="sm">
          <TextInput
            placeholder="Add warehouse address"
            value={formData.warehouseInput}
            onChange={(e) => handleFieldChange("warehouseInput", e.currentTarget.value)}
          />
        </Group>

        {formData.warehouseAddresses.length === 0 ? (
          <Box
            style={{
              backgroundColor: "#f1f3f5",
              padding: "0.5rem",
              borderRadius: "4px",
              marginTop: "0.5rem",
            }}
          >
            <Text size="sm" c="dimmed" ta="center">
              NO WAREHOUSE ADDRESSES ADDED
            </Text>
          </Box>
        ) : (
          formData.warehouseAddresses.map((addr, i) => (
            <Box key={i} style={{ marginTop: "0.5rem" }}>
              <Text size="sm">{addr}</Text>
            </Box>
          ))
        )}
      </Box>

      <Box style={{ marginBottom: "1rem" }}>
        <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Text size="sm" fw={500}>Delivery Addresses</Text>
          <Button
            leftSection={<Add width={18} height={18} style={{ color: "#0064E0" }} />}
            variant="outline"
            radius="md"
            onClick={addDeliveryAddress}
          >
            Add Delivery
          </Button>
        </Box>

        <Group mt="sm">
          <TextInput
            placeholder="Add delivery address"
            value={formData.deliveryInput}
            onChange={(e) => handleFieldChange("deliveryInput", e.currentTarget.value)}
          />
        </Group>

        {formData.deliveryAddresses.length === 0 ? (
          <Box
            style={{
              backgroundColor: "#f1f3f5",
              padding: "0.5rem",
              borderRadius: "4px",
              marginTop: "0.5rem",
            }}
          >
            <Text size="sm" c="dimmed" ta="center">
              NO DELIVERY ADDRESSES ADDED
            </Text>
          </Box>
        ) : (
          formData.deliveryAddresses.map((addr, i) => (
            <Box key={i} style={{ marginTop: "0.5rem" }}>
              <Text size="sm">{addr}</Text>
            </Box>
          ))
        )}
      </Box>

      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Port Of Usual Entry/Exit</Text>
          <TextInput
            placeholder="Enter port"
            value={formData.portOfUsualEntryExit}
            onChange={(e) => handleFieldChange("portOfUsualEntryExit", e.currentTarget.value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Country of Origin (For Imports)</Text>
          <TextInput
            placeholder="Enter country of origin"
            value={formData.countryOfOrigin}
            onChange={(e) => handleFieldChange("countryOfOrigin", e.currentTarget.value)}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Country of Destination (For Exports)</Text>
          <TextInput
            placeholder="Enter country of destination"
            value={formData.countryOfDestination}
            onChange={(e) => handleFieldChange("countryOfDestination", e.currentTarget.value)}
          />
        </div>
      </Group>
    </Paper>
  );
}
