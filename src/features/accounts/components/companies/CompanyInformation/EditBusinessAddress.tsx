// src/features/accounts/components/companies/CompanyInformation/EditBusinessAddress.tsx
import { useState, useEffect } from "react";
import { Paper, Text, TextInput, Group, Button, Box } from "@mantine/core";
import { Add } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "../CompanyDetails/CompanyDetails.module.css";
import type {
  CompanyFullDetails,
  CompanyAddressSummary,
} from "@/features/accounts/types/company.types";

interface EditBusinessAddressProps {
  company: CompanyFullDetails | null;
  errors?: Record<string, string>;
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

export function EditBusinessAddress({ company, errors, onChange }: EditBusinessAddressProps) {
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
  const [showWarehouseInput, setShowWarehouseInput] = useState(false);
  const [showDeliveryInput, setShowDeliveryInput] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>(errors ?? {});

  useEffect(() => {
    setLocalErrors(errors ?? {});
  }, [errors]);

  const clearFieldError = (field: string) => {
    if (!localErrors[field]) {
      return;
    }
    setLocalErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  useEffect(() => {
    if (company?.address) {
      setFormData((prev) => ({
        registeredAddress: company.address.registeredAddress || "",
        officeAddress: company.address.officeAddress || "",
        warehouseAddresses: company.address.warehouseAddresses || [],
        deliveryAddresses: company.address.deliveryAddresses || [],
        warehouseInput: prev.warehouseInput,
        deliveryInput: prev.deliveryInput,
        portOfUsualEntryExit: company.address.portOfUsualEntryExit || "",
        countryOfOrigin: company.address.countryOfOrigin || "",
        countryOfDestination: company.address.countryOfDestination || "",
      }));
    }
  }, [company]);

  const handleFieldChange = (field: keyof FormData, value: string) => {
    const nextFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(nextFormData);

    if (field === "warehouseInput" || field === "deliveryInput") {
      return;
    }

    clearFieldError(field);
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
    setShowWarehouseInput(false);
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
    setShowDeliveryInput(false);
    onChange?.(toAddressSummary(nextFormData));
  };

  const cancelWarehouseInput = () => {
    setFormData((prev) => ({ ...prev, warehouseInput: "" }));
    setShowWarehouseInput(false);
  };

  const cancelDeliveryInput = () => {
    setFormData((prev) => ({ ...prev, deliveryInput: "" }));
    setShowDeliveryInput(false);
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
            error={localErrors.registeredAddress}
            classNames={{
              input: localErrors.registeredAddress ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Office Address</Text>
          <TextInput
            placeholder="Enter office address"
            value={formData.officeAddress}
            onChange={(e) => handleFieldChange("officeAddress", e.currentTarget.value)}
            error={localErrors.officeAddress}
            classNames={{
              input: localErrors.officeAddress ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
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
            onClick={() => setShowWarehouseInput(true)}
          >
            Add Warehouse
          </Button>
        </Box>

        {showWarehouseInput && (
          <Group mt="sm">
            <TextInput
              placeholder="Add warehouse address"
              value={formData.warehouseInput}
              onChange={(e) => handleFieldChange("warehouseInput", e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button
              radius="md"
              onClick={addWarehouseAddress}
              disabled={!formData.warehouseInput.trim()}
            >
              Save
            </Button>
            <Button
              variant="outline"
              radius="md"
              onClick={cancelWarehouseInput}
            >
              Cancel
            </Button>
          </Group>
        )}

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
            onClick={() => setShowDeliveryInput(true)}
          >
            Add Delivery
          </Button>
        </Box>

        {showDeliveryInput && (
          <Group mt="sm">
            <TextInput
              placeholder="Add delivery address"
              value={formData.deliveryInput}
              onChange={(e) => handleFieldChange("deliveryInput", e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button
              radius="md"
              onClick={addDeliveryAddress}
              disabled={!formData.deliveryInput.trim()}
            >
              Save
            </Button>
            <Button
              variant="outline"
              radius="md"
              onClick={cancelDeliveryInput}
            >
              Cancel
            </Button>
          </Group>
        )}

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
            error={localErrors.portOfUsualEntryExit}
            classNames={{
              input: localErrors.portOfUsualEntryExit ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Country of Origin (For Imports)</Text>
          <TextInput
            placeholder="Enter country of origin"
            value={formData.countryOfOrigin}
            onChange={(e) => handleFieldChange("countryOfOrigin", e.currentTarget.value)}
            error={localErrors.countryOfOrigin}
            classNames={{
              input: localErrors.countryOfOrigin ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
          />
        </div>
        <div>
          <Text size="sm" fw={500}>Country of Destination (For Exports)</Text>
          <TextInput
            placeholder="Enter country of destination"
            value={formData.countryOfDestination}
            onChange={(e) => handleFieldChange("countryOfDestination", e.currentTarget.value)}
            error={localErrors.countryOfDestination}
            classNames={{
              input: localErrors.countryOfDestination ? styles.textInputError : undefined,
              error: styles.errorMessage,
            }}
          />
        </div>
      </Group>
    </Paper>
  );
}
